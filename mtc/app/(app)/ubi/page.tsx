import { createClient } from "@/lib/supabase/server";
import UBIClient from "./UBIClient";

export default async function UBIPage() {
  const supabase = await createClient();
  const { data: ecosystems } = await supabase.from("ai_ecosystems").select("*").order("display_order");
  return <UBIClient ecosystems={ecosystems ?? []} />;
}
