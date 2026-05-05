import { callOpenRouter, DEFAULT_MODEL } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";

export async function debateRedTeamMode(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const forMaster = squad[0];
  const againstMaster = squad[1] ?? squad[0];
  const forModel = gatewayConfig.masterGateways[forMaster?.id] ?? gatewayConfig.defaultModel;
  const againstModel = gatewayConfig.masterGateways[againstMaster?.id] ?? "openai/gpt-4o";

  const [forResult, againstResult] = await Promise.allSettled([
    callOpenRouter(forModel, `You are ${forMaster?.name ?? "Advocate"}. Argue strongly FOR the following proposition. Be persuasive and evidence-based.`, brief),
    callOpenRouter(againstModel, `You are ${againstMaster?.name ?? "Devil's Advocate"}. Argue strongly AGAINST the following proposition. Challenge assumptions and highlight risks.`, brief),
  ]);

  const forContent = forResult.status === "fulfilled" ? forResult.value.content : "FOR argument failed";
  const againstContent = againstResult.status === "fulfilled" ? againstResult.value.content : "AGAINST argument failed";

  const judgePrompt = `You are an impartial judge. Review these two positions and provide a balanced synthesis with your verdict.\n\nFOR:\n${forContent}\n\nAGAINST:\n${againstContent}\n\nOriginal proposition: ${brief}`;
  const judgeResult = await callOpenRouter(DEFAULT_MODEL, "You are an impartial strategic advisor. Synthesize the debate and provide a clear verdict.", judgePrompt);

  return [
    {
      masterId: forMaster?.id ?? "for",
      masterName: `FOR: ${forMaster?.name ?? "Advocate"}`,
      model: forResult.status === "fulfilled" ? forResult.value.model : forModel,
      content: forContent,
      tokens: forResult.status === "fulfilled" ? forResult.value.usage.total_tokens : 0,
      costUsd: forResult.status === "fulfilled" ? forResult.value.costUsd : 0,
      status: forResult.status === "fulfilled" ? "success" : "error",
    },
    {
      masterId: againstMaster?.id ?? "against",
      masterName: `AGAINST: ${againstMaster?.name ?? "Devil's Advocate"}`,
      model: againstResult.status === "fulfilled" ? againstResult.value.model : againstModel,
      content: againstContent,
      tokens: againstResult.status === "fulfilled" ? againstResult.value.usage.total_tokens : 0,
      costUsd: againstResult.status === "fulfilled" ? againstResult.value.costUsd : 0,
      status: againstResult.status === "fulfilled" ? "success" : "error",
    },
    {
      masterId: "judge",
      masterName: "⚖️ Judge Synthesis",
      model: judgeResult.model,
      content: judgeResult.content,
      tokens: judgeResult.usage.total_tokens,
      costUsd: judgeResult.costUsd,
      status: "success",
    },
  ];
}
