import { createClient } from "@/lib/supabase/server";
import HorizonClient from "./HorizonClient";

export default async function HorizonPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("connectors").upsert({
    user_id: user!.id,
    category: "mcp_server",
    provider: "horizon",
    name: "Weather Server",
    url: "https://weather-4ff72b24c5fb.fastmcp.app/mcp",
    auth_type: "none",
    status: "configured",
    capabilities: ["get_weather", "get_forecast", "get_alerts"],
  }, { onConflict: "id", ignoreDuplicates: true });

  const { data: connectors } = await supabase
    .from("connectors")
    .select("*")
    .eq("user_id", user!.id)
    .eq("category", "mcp_server")
    .order("created_at", { ascending: false });

  const { data: templates } = await supabase.from("horizon_templates").select("*").order("display_order");

  return <HorizonClient connectors={connectors ?? []} templates={templates ?? []} />;
}
