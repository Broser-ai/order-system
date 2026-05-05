import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executePattern } from "@/lib/ai/patterns";
import { logAuditEvent } from "@/lib/audit";
import { checkApproval } from "@/lib/security";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { brief, patternId, squad, components, gatewayConfig, projectId, phase } = body;

  if (!brief || !patternId) {
    return NextResponse.json({ error: "brief and patternId are required" }, { status: 400 });
  }

  const approval = checkApproval({ action: "ai_call", riskClass: "low", userId: user.id });
  if (!approval.allowed) {
    return NextResponse.json({ error: approval.reason, requiresApproval: true }, { status: 202 });
  }

  const { data: execution } = await supabase.from("executions").insert({
    user_id: user.id,
    project_id: projectId ?? null,
    brief,
    pattern_id: patternId,
    squad_master_ids: (squad ?? []).map((m: { id: string }) => m.id),
    gateway_assignments: gatewayConfig?.masterGateways ?? {},
    components: components ?? {},
    status: "running",
  }).select().single();

  await logAuditEvent({
    userId: user.id,
    projectId,
    executionId: execution?.id,
    action: "ai_call_start",
    target: patternId,
    riskClass: "low",
    status: "ok",
    details: { patternId, squadSize: squad?.length ?? 0 },
  });

  try {
    const results = await executePattern(
      patternId,
      brief,
      squad ?? [],
      components ?? { outputTypes: [] },
      gatewayConfig ?? { defaultModel: "anthropic/claude-opus-4", masterGateways: {} },
      phase
    );

    const totalTokens = results.reduce((s, r) => s + r.tokens, 0);
    const totalCost = results.reduce((s, r) => s + r.costUsd, 0);

    const isApprovalPattern = patternId === "human_approval_checkpoint" && (!phase || phase === "phase1");
    const finalStatus = isApprovalPattern ? "awaiting_approval" : "success";

    await supabase.from("executions").update({
      status: finalStatus,
      results,
      total_tokens: totalTokens,
      total_cost_usd: totalCost,
      completed_at: new Date().toISOString(),
    }).eq("id", execution?.id);

    await logAuditEvent({
      userId: user.id,
      projectId,
      executionId: execution?.id,
      action: "ai_call_complete",
      target: patternId,
      riskClass: "low",
      status: "ok",
      details: { results: results.length, totalTokens },
      costUsd: totalCost,
    });

    return NextResponse.json({ executionId: execution?.id, results, status: finalStatus, totalTokens, totalCost });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("executions").update({ status: "error" }).eq("id", execution?.id);
    await logAuditEvent({ userId: user.id, executionId: execution?.id, action: "ai_call_error", target: patternId, riskClass: "low", status: "error", details: { error: msg } });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
