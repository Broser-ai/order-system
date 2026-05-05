import { createClient } from "@/lib/supabase/server";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: servers } = await supabase.from("custom_mcp_servers").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
  return <BuilderClient servers={servers ?? []} />;
}
