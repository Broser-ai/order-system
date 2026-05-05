export type RiskClass = "low" | "medium" | "high" | "critical";

export interface AuditAction {
  action: string;
  riskClass: RiskClass;
  userId: string;
  firstRunKey?: string;
}

export interface ApprovalResult {
  allowed: boolean;
  requiresApproval: boolean;
  reason?: string;
}

const firstRunCache = new Set<string>();

export function checkApproval(action: AuditAction): ApprovalResult {
  const { riskClass, firstRunKey } = action;

  if (riskClass === "low") {
    return { allowed: true, requiresApproval: false };
  }

  if (riskClass === "medium") {
    const key = firstRunKey ?? `${action.userId}:${action.action}`;
    if (firstRunCache.has(key)) {
      return { allowed: true, requiresApproval: false };
    }
    firstRunCache.add(key);
    return { allowed: false, requiresApproval: true, reason: "First run requires approval for medium-risk actions." };
  }

  if (riskClass === "high") {
    return { allowed: false, requiresApproval: true, reason: "High-risk actions require approval every run." };
  }

  if (riskClass === "critical") {
    return { allowed: false, requiresApproval: true, reason: "Critical actions require approval + second reviewer." };
  }

  return { allowed: true, requiresApproval: false };
}

export function getRiskClassForAction(action: string): RiskClass {
  const criticalPatterns = ["payment", "legal", "delete_all", "regulated", "filing"];
  const highPatterns = ["deploy_production", "send_email", "crm_write", "publish"];
  const mediumPatterns = ["draft", "sandbox", "staging", "test_env"];

  const lower = action.toLowerCase();
  if (criticalPatterns.some((p) => lower.includes(p))) return "critical";
  if (highPatterns.some((p) => lower.includes(p))) return "high";
  if (mediumPatterns.some((p) => lower.includes(p))) return "medium";
  return "low";
}
