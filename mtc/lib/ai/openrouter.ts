export interface OpenRouterResponse {
  content: string;
  model: string;
  usage: { total_tokens: number; prompt_tokens: number; completion_tokens: number };
  costUsd: number;
}

const MODEL_COST_PER_TOKEN: Record<string, number> = {
  "anthropic/claude-opus-4": 0.000015,
  "openai/gpt-4o": 0.000005,
  "google/gemini-2.0-flash-exp": 0.0000005,
  "meta-llama/llama-3.3-70b-instruct": 0.0000009,
  "mistralai/mistral-large": 0.000003,
  "deepseek/deepseek-chat": 0.00000014,
  "qwen/qwen-2.5-72b-instruct": 0.0000009,
  default: 0.000002,
};

function estimateCost(model: string, totalTokens: number): number {
  const rate = MODEL_COST_PER_TOKEN[model] ?? MODEL_COST_PER_TOKEN.default;
  return parseFloat((rate * totalTokens).toFixed(6));
}

export async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtc.vercel.app",
      "X-Title": "Master Team Console",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const usage = data.usage ?? { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 };
  const actualModel = data.model ?? model;

  return {
    content,
    model: actualModel,
    usage,
    costUsd: estimateCost(actualModel, usage.total_tokens),
  };
}

export const CHEAP_MODELS = [
  "deepseek/deepseek-chat",
  "qwen/qwen-2.5-72b-instruct",
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-small",
  "openrouter/auto",
];

export const DEFAULT_MODEL = "anthropic/claude-opus-4";
