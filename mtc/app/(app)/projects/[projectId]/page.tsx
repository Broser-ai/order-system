import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const supabase = await createClient();
  const [{ data: project }, { data: executions }, { data: memories }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("executions").select("id, brief, pattern_id, status, total_cost_usd, started_at").eq("project_id", projectId).order("started_at", { ascending: false }).limit(20),
    supabase.from("project_memories").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(10),
  ]);
  if (!project) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/projects" className="text-gray-500 hover:text-white text-sm mb-4 block">← Projects</Link>
      <h1 className="text-2xl font-bold text-white mb-1">{project.name}</h1>
      {project.description && <p className="text-gray-400 text-sm mb-6">{project.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-white font-semibold mb-3">Executions ({executions?.length ?? 0})</h2>
          <div className="space-y-2">
            {(executions ?? []).map(e => (
              <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <div className="text-white text-sm line-clamp-1">{e.brief}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600 text-xs">{e.pattern_id}</span>
                  <span className={`text-xs ${e.status === "success" ? "text-green-400" : e.status === "error" ? "text-red-400" : "text-yellow-400"}`}>{e.status}</span>
                  {e.total_cost_usd > 0 && <span className="text-gray-600 text-xs">${Number(e.total_cost_usd).toFixed(5)}</span>}
                </div>
              </div>
            ))}
            {!executions?.length && <p className="text-gray-600 text-sm">No executions yet.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-white font-semibold mb-3">Memory ({memories?.length ?? 0})</h2>
          <div className="space-y-2">
            {(memories ?? []).map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                {m.topic && <div className="text-indigo-400 text-xs mb-1">{m.topic}</div>}
                <div className="text-gray-300 text-sm">{m.content}</div>
              </div>
            ))}
            {!memories?.length && <p className="text-gray-600 text-sm">No memories yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
