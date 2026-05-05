import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("watchers").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ watchers: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, triggerDescription, actionDescription, scheduleCron, scheduleHuman, projectId } = await request.json();
  if (!name || !actionDescription) return NextResponse.json({ error: "name and actionDescription required" }, { status: 400 });
  const { data, error } = await supabase.from("watchers").insert({
    user_id: user.id, project_id: projectId ?? null, name,
    trigger_description: triggerDescription ?? "", action_description: actionDescription,
    schedule_cron: scheduleCron ?? "*/15 * * * *", schedule_human: scheduleHuman ?? "Every 15 minutes",
    status: "active",
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ watcher: data });
}
