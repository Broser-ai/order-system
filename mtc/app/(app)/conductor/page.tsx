import { createClient } from "@/lib/supabase/server";
import ConductorClient from "./components/ConductorClient";

export default async function ConductorPage() {
  const supabase = await createClient();
  const [{ data: patterns }, { data: departments }, { data: masters }, { data: ecosystems }] = await Promise.all([
    supabase.from("execution_patterns").select("*").order("display_order"),
    supabase.from("departments").select("id, name, tier_name").order("display_order"),
    supabase.from("masters").select("*").order("display_order"),
    supabase.from("ai_ecosystems").select("id, name, openrouter_model_string, display_color").order("display_order"),
  ]);

  return (
    <ConductorClient
      patterns={patterns ?? []}
      departments={departments ?? []}
      masters={masters ?? []}
      ecosystems={ecosystems ?? []}
    />
  );
}
