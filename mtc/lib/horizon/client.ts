export interface Deployment { id: string; name: string; url: string; status: string; category: string; provider: string; capabilities: string[]; }
export interface Tool { name: string; description: string; inputSchema?: Record<string, unknown>; }

export const WEATHER_SERVER_URL = "https://weather-4ff72b24c5fb.fastmcp.app/mcp";

export async function probeDeployment(url: string): Promise<{ tools: Tool[]; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { tools: [], error: `HTTP ${res.status}` };
    const data = await res.json();
    return { tools: data.result?.tools ?? [] };
  } catch (err) {
    return { tools: [], error: String(err) };
  }
}
