import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data } = await supabase.from("connectors").select("*").eq("user_id", user.id).eq("category", "webhook");
  return NextResponse.json({ webhooks: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, url, provider } = await request.json();
  if (!name || !url) return NextResponse.json({ error: "name and url required" }, { status: 400 });
  const { data } = await supabase.from("connectors").insert({ user_id: user.id, category: "webhook", provider, name, url, auth_type: "none", status: "configured" }).select().single();
  return NextResponse.json({ webhook: data });
}
