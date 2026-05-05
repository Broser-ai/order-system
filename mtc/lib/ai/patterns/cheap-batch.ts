import { callOpenRouter, CHEAP_MODELS } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function cheapBatchMode(
  brief: string,
  _squad: Master[],
  _gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const systemPrompt = "You are a helpful expert AI assistant. Provide a concise, high-quality response.";
  const results = await Promise.allSettled(
    CHEAP_MODELS.map(async (model): Promise<PatternResult> => {
      const result = await callOpenRouter(model, systemPrompt, brief, { maxTokens: 1024 });
      return {
        masterId: model,
        masterName: model.split("/")[1] ?? model,
        model: result.model,
        content: result.content,
        tokens: result.usage.total_tokens,
        costUsd: result.costUsd,
        status: "success",
      };
    })
  );
  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { masterId: CHEAP_MODELS[i], masterName: CHEAP_MODELS[i], model: CHEAP_MODELS[i], content: "", tokens: 0, costUsd: 0, status: "error" as const, error: r.reason?.message }
  );
}
