import { callOpenRouter } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function singleBestModel(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const master = squad[0];
  const model = gatewayConfig.masterGateways[master?.id] ?? gatewayConfig.defaultModel;
  const systemPrompt = master
    ? `You are ${master.name} (${master.affiliation}). Your authority: ${master.authority}. Respond with expert insight.`
    : "You are an expert AI assistant.";

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
  } catch (err) {
    return [{ masterId: master?.id ?? "auto", masterName: master?.name ?? "AI", model, content: "", tokens: 0, costUsd: 0, status: "error", error: String(err) }];
  }
}
