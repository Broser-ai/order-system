import { createServiceClient } from "./supabase/server";

type RiskClass = "low" | "medium" | "high" | "critical";
type AuditStatus = "ok" | "error" | "awaiting_approval";

interface AuditEvent {
  userId: string;
  projectId?: string;
  executionId?: string;
  action: string;
  target?: string;
  riskClass: RiskClass;
  status: AuditStatus;
  details?: Record<string, unknown>;
  costUsd?: number;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const supabase = await createServiceClient();
    await supabase.from("audit_log").insert({
      user_id: event.userId,
      project_id: event.projectId ?? null,
      execution_id: event.executionId ?? null,
      action: event.action,
      target: event.target ?? null,
      risk_class: event.riskClass,
      status: event.status,
      details: event.details ?? {},
      cost_usd: event.costUsd ?? 0,
    });
  } catch (err) {
    console.error("[audit] failed to write audit event:", err);
  }
}
