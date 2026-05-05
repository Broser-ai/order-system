import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { executePattern } from "@/lib/ai/patterns";
import { logAuditEvent } from "@/lib/audit";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ watcherId: string }> }) {
  const { watcherId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: watcher } = await supabase.from("watchers").select("*").eq("id", watcherId).eq("user_id", user.id).single();
  if (!watcher) return NextResponse.json({ error: "Watcher not found" }, { status: 404 });

  const serviceClient = await createServiceClient();
  const { data: run } = await serviceClient.from("watcher_runs").insert({ watcher_id: watcherId, status: "running" }).select().single();

  try {
    const results = await executePattern(
      "single_best_model",
      watcher.action_description,
      [],
      { outputTypes: [] },
      { defaultModel: "anthropic/claude-opus-4", masterGateways: {} }
    );
    await serviceClient.from("watcher_runs").update({ status: "success", completed_at: new Date().toISOString(), output: results }).eq("id", run?.id);
    await serviceClient.from("watchers").update({ last_run_at: new Date().toISOString(), last_run_status: "success" }).eq("id", watcherId);
    await logAuditEvent({ userId: user.id, action: "watcher_run", target: watcher.name, riskClass: "low", status: "ok" });
    return NextResponse.json({ success: true, results });
  } catch (err) {
    const msg = String(err);
    await serviceClient.from("watcher_runs").update({ status: "error", error_message: msg, completed_at: new Date().toISOString() }).eq("id", run?.id);
    await serviceClient.from("watchers").update({ last_run_status: "error" }).eq("id", watcherId);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
