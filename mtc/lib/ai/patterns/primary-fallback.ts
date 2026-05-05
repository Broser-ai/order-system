import { callOpenRouter } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

const FALLBACK_MODELS = [
  "anthropic/claude-opus-4",
  "openai/gpt-4o",
  "meta-llama/llama-3.3-70b-instruct",
];

export async function primaryPlusFallback(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const master = squad[0];
  const primaryModel = gatewayConfig.masterGateways[master?.id] ?? gatewayConfig.defaultModel;
  const systemPrompt = master
    ? `You are ${master.name} (${master.affiliation}). Authority: ${master.authority}.`
    : "You are an expert AI assistant.";

  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

  for (const model of modelsToTry) {
    try {
      const result = await callOpenRouter(model, systemPrompt, brief);
      return [{
        masterId: master?.id ?? "auto",
        masterName: master?.name ?? "AI",
        model: result.model,
        content: result.content,
        tokens: result.usage.total_tokens,
        costUsd: result.costUsd,
        status: "success",
      }];
    } catch {
      continue;
    }
  }
  return [{ masterId: master?.id ?? "auto", masterName: master?.name ?? "AI", model: primaryModel, content: "", tokens: 0, costUsd: 0, status: "error", error: "All models failed" }];
}
