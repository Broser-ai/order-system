export interface Toolkit { slug: string; name: string; category: string; description: string; auth_type: string; is_popular: boolean; }
export interface Tool { name: string; description: string; parameters: Record<string, unknown>; }

export async function listComposioToolkits(): Promise<Toolkit[]> {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) throw new Error("COMPOSIO_API_KEY not set");
  const res = await fetch("https://backend.composio.dev/api/v1/apps?limit=100", {
    headers: { "x-api-key": apiKey },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Composio API error: ${res.status}`);
  const data = await res.json();
  return (data.items ?? []).map((app: Record<string, unknown>) => ({
    slug: app.key ?? app.appId,
    name: app.name,
    category: Array.isArray(app.categories) ? app.categories[0] : "general",
    description: app.description ?? "",
    auth_type: (app.auth_schemes as string[])?.[0] ?? "api_key",
    is_popular: Boolean(app.isPopular ?? (app.no_of_connections as number) > 1000),
  }));
}

export async function listToolkitTools(slug: string): Promise<Tool[]> {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) throw new Error("COMPOSIO_API_KEY not set");
  const res = await fetch(`https://backend.composio.dev/api/v1/actions?appNames=${slug}&limit=50`, {
    headers: { "x-api-key": apiKey },
  });
  if (!res.ok) throw new Error(`Composio API error: ${res.status}`);
  const data = await res.json();
  return (data.items ?? []).map((action: Record<string, unknown>) => ({
    name: action.name as string,
    description: action.description as string ?? "",
    parameters: (action.parameters as Record<string, unknown>) ?? {},
  }));
}

export async function executeComposioTool(slug: string, toolName: string, args: Record<string, unknown>, userId: string): Promise<unknown> {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) throw new Error("COMPOSIO_API_KEY not set");
  const res = await fetch("https://backend.composio.dev/api/v1/actions/execute/get-response", {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ actionName: toolName, input: args, connectedAccountId: userId }),
  });
  if (!res.ok) throw new Error(`Composio execute error: ${res.status}`);
  return res.json();
}
