import { callOpenRouter } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function humanApprovalCheckpoint(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig,
  phase: "phase1" | "phase2" = "phase1"
): Promise<PatternResult[]> {
  if (phase === "phase1") {
    const master = squad[0];
    const model = gatewayConfig.masterGateways[master?.id] ?? gatewayConfig.defaultModel;
    const systemPrompt = `You are ${master?.name ?? "AI"} (${master?.affiliation ?? ""}). Authority: ${master?.authority ?? ""}. Produce a Phase 1 analysis and proposal. This will be reviewed by a human before Phase 2 executes.`;
    try {
      const result = await callOpenRouter(model, systemPrompt, `PHASE 1 ANALYSIS:\n${brief}`);
      return [{
        masterId: master?.id ?? "auto",
        masterName: `Phase 1: ${master?.name ?? "AI"}`,
        model: result.model,
        content: result.content + "\n\n---\n⏸️ **Awaiting human approval before Phase 2 executes.**",
        tokens: result.usage.total_tokens,
        costUsd: result.costUsd,
        status: "success",
      }];
    } catch (err) {
      return [{ masterId: "phase1", masterName: "Phase 1", model, content: "", tokens: 0, costUsd: 0, status: "error", error: String(err) }];
    }
  } else {
    const master = squad[1] ?? squad[0];
    const model = gatewayConfig.masterGateways[master?.id] ?? gatewayConfig.defaultModel;
    const systemPrompt = `You are ${master?.name ?? "AI"}. Phase 1 was approved. Now execute Phase 2: produce the final deliverable based on the approved plan.`;
    try {
      const result = await callOpenRouter(model, systemPrompt, `APPROVED BRIEF — EXECUTE PHASE 2:\n${brief}`);
      return [{
        masterId: master?.id ?? "auto",
        masterName: `Phase 2: ${master?.name ?? "AI"}`,
        model: result.model,
        content: result.content,
        tokens: result.usage.total_tokens,
        costUsd: result.costUsd,
        status: "success",
      }];
    } catch (err) {
      return [{ masterId: "phase2", masterName: "Phase 2", model, content: "", tokens: 0, costUsd: 0, status: "error", error: String(err) }];
    }
  }
}
