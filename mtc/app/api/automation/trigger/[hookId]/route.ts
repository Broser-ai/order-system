import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ hookId: string }> }) {
  const { hookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: connector } = await supabase.from("connectors").select("*").eq("id", hookId).eq("user_id", user.id).single();
  if (!connector) return NextResponse.json({ error: "Webhook not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  try {
    const res = await fetch(connector.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await logAuditEvent({ userId: user.id, action: "webhook_trigger", target: connector.name, riskClass: "medium", status: "ok", details: { url: connector.url, statusCode: res.status } });
    await supabase.from("connectors").update({ last_used_at: new Date().toISOString() }).eq("id", hookId);
    return NextResponse.json({ ok: true, status: res.status });
  } catch (err) {
    await logAuditEvent({ userId: user.id, action: "webhook_trigger", target: connector.name, riskClass: "medium", status: "error", details: { error: String(err) } });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
