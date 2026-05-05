import { callOpenRouter } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function parallelExpertMode(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const activeMasters = squad.slice(0, 5);
  const results = await Promise.allSettled(
    activeMasters.map(async (master): Promise<PatternResult> => {
      const model = gatewayConfig.masterGateways[master.id] ?? gatewayConfig.defaultModel;
      const systemPrompt = `You are ${master.name} (${master.affiliation}). Your authority: ${master.authority}. Provide your expert perspective on the brief.`;
      const result = await callOpenRouter(model, systemPrompt, brief);
      return {
        masterId: master.id,
        masterName: master.name,
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
      : {
          masterId: activeMasters[i].id,
          masterName: activeMasters[i].name,
          model: "",
          content: "",
          tokens: 0,
          costUsd: 0,
          status: "error" as const,
          error: r.reason?.message ?? "Unknown error",
        }
  );
}
