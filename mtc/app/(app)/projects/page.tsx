import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: projects } = await supabase.from("projects").select("*, executions(count)").eq("user_id", user!.id).order("created_at", { ascending: false });
  return <ProjectsClient projects={projects ?? []} />;
}
