import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { probeDeployment } from "@/lib/horizon/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const result = await probeDeployment(url);
  return NextResponse.json(result);
}
