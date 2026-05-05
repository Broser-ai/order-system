import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { executePattern } from "@/lib/ai/patterns";

export async function GET() {
  const supabase = await createServiceClient();
  const now = new Date().toISOString();
  const { data: watchers } = await supabase.from("watchers").select("*").eq("status", "active").or(`next_run_at.is.null,next_run_at.lte.${now}`);

  if (!watchers?.length) return NextResponse.json({ ran: 0 });

  let ran = 0;
  for (const watcher of watchers) {
    try {
      const results = await executePattern("single_best_model", watcher.action_description, [], { outputTypes: [] }, { defaultModel: "anthropic/claude-opus-4", masterGateways: {} });
      await supabase.from("watcher_runs").insert({ watcher_id: watcher.id, status: "success", output: results, completed_at: now });
      await supabase.from("watchers").update({ last_run_at: now, last_run_status: "success" }).eq("id", watcher.id);
      ran++;
    } catch (err) {
      await supabase.from("watcher_runs").insert({ watcher_id: watcher.id, status: "error", error_message: String(err), completed_at: now });
    }
  }
  return NextResponse.json({ ran, total: watchers.length });
}
