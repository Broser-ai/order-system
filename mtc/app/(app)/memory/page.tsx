import { createClient } from "@/lib/supabase/server";
import MemoryClient from "./MemoryClient";

export default async function MemoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: projects }, { data: watchers }, { data: watcherRuns }] = await Promise.all([
    supabase.from("projects").select("id, name").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("watchers").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("watcher_runs").select("*, watchers!inner(user_id)").eq("watchers.user_id", user!.id).order("started_at", { ascending: false }).limit(20),
  ]);
  return <MemoryClient projects={projects ?? []} watchers={watchers ?? []} watcherRuns={watcherRuns ?? []} userId={user!.id} />;
}
