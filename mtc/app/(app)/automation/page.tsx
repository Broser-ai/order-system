import { createClient } from "@/lib/supabase/server";
import AutomationClient from "./AutomationClient";

export default async function AutomationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: platforms }, { data: webhooks }] = await Promise.all([
    supabase.from("automation_platforms").select("*").order("display_order"),
    supabase.from("connectors").select("*").eq("user_id", user!.id).eq("category", "webhook").order("created_at", { ascending: false }),
  ]);
  return <AutomationClient platforms={platforms ?? []} webhooks={webhooks ?? []} />;
}
