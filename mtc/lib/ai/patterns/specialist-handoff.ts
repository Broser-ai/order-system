import { callOpenRouter } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function specialistHandoff(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const chain = squad.slice(0, 4);
  const results: PatternResult[] = [];
  let currentInput = brief;

  for (let i = 0; i < chain.length; i++) {
    const master = chain[i];
    const model = gatewayConfig.masterGateways[master.id] ?? gatewayConfig.defaultModel;
    const isFirst = i === 0;
    const isLast = i === chain.length - 1;
    const systemPrompt = isFirst
      ? `You are ${master.name} (${master.affiliation}). Authority: ${master.authority}. Begin the work on this brief.`
      : isLast
      ? `You are ${master.name} (${master.affiliation}). Authority: ${master.authority}. This is the final stage. Produce the polished, complete output.`
      : `You are ${master.name} (${master.affiliation}). Authority: ${master.authority}. Build on the previous expert's work and add your specialist contribution.`;

    try {
      const result = await callOpenRouter(model, systemPrompt, currentInput);
      results.push({
        masterId: master.id,
        masterName: `${i + 1}. ${master.name}`,
        model: result.model,
        content: result.content,
        tokens: result.usage.total_tokens,
        costUsd: result.costUsd,
        status: "success",
      });
      currentInput = `Original brief: ${brief}\n\nPrevious expert (${master.name}) produced:\n${result.content}\n\nContinue building on this.`;
    } catch (err) {
      results.push({ masterId: master.id, masterName: master.name, model, content: "", tokens: 0, costUsd: 0, status: "error", error: String(err) });
      break;
    }
  }
  return results;
}
