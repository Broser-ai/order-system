import { callOpenRouter, DEFAULT_MODEL } from "../openrouter";
import type { Master, GatewayConfig, PatternResult } from "./types";
import { parallelExpertMode } from "./parallel-expert";

export async function synthesisAfterParallel(
  brief: string,
  squad: Master[],
  gatewayConfig: GatewayConfig
): Promise<PatternResult[]> {
  const parallelResults = await parallelExpertMode(brief, squad, gatewayConfig);
  const successfulResults = parallelResults.filter((r) => r.status === "success" && r.content);

  if (successfulResults.length === 0) return parallelResults;

  const expertOutputs = successfulResults
    .map((r) => `## ${r.masterName}\n${r.content}`)
    .join("\n\n---\n\n");

  const synthesisPrompt = `You received outputs from ${successfulResults.length} expert AIs on this brief:\n\n"${brief}"\n\nHere are their outputs:\n\n${expertOutputs}\n\nProduce a unified, comprehensive synthesis that:\n1. Captures the key insights from all experts\n2. Resolves any conflicts or contradictions\n3. Provides a clear, actionable conclusion\n4. Is structured with headers and bullet points`;

  try {
    const synthesis = await callOpenRouter(
      DEFAULT_MODEL,
      "You are a master synthesizer. Integrate multiple expert perspectives into a unified, insightful report.",
      synthesisPrompt,
      { maxTokens: 3000 }
    );
    return [
      ...parallelResults,
      {
        masterId: "synthesis",
        masterName: "🧬 Synthesis",
        model: synthesis.model,
        content: synthesis.content,
        tokens: synthesis.usage.total_tokens,
        costUsd: synthesis.costUsd,
        status: "success",
      },
    ];
  } catch (err) {
    return [...parallelResults, { masterId: "synthesis", masterName: "Synthesis", model: DEFAULT_MODEL, content: "", tokens: 0, costUsd: 0, status: "error", error: String(err) }];
  }
}
