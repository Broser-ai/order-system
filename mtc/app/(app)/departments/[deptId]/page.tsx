import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ deptId: string }> }) {
  const { deptId } = await params;
  const supabase = await createClient();
  const [{ data: dept }, { data: masters }] = await Promise.all([
    supabase.from("departments").select("*").eq("id", deptId).single(),
    supabase.from("masters").select("*, ai_ecosystems(name, display_color)").eq("department_id", deptId).order("display_order"),
  ]);
  if (!dept) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/departments" className="text-gray-500 hover:text-white text-sm mb-4 block">← Departments</Link>
      <div className="mb-2">
        <span className="text-xs text-gray-500">Tier {dept.tier} — {dept.tier_name}</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{dept.name}</h1>
      <p className="text-gray-400 mb-1 text-sm">{dept.description}</p>
      <p className="text-gray-600 text-xs mb-8">{dept.scope}</p>

      <h2 className="text-white font-semibold mb-4">Masters ({masters?.length ?? 0})</h2>
      <div className="space-y-4">
        {(masters ?? []).map(m => (
          <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white font-semibold">{m.name}</div>
                <div className="text-gray-400 text-sm">{m.affiliation}</div>
              </div>
              {m.ai_ecosystems && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300" style={{ borderLeft: `3px solid ${(m.ai_ecosystems as { display_color: string }).display_color}` }}>
                  {(m.ai_ecosystems as { name: string }).name}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-2">{m.authority}</p>
            <p className="text-gray-600 text-xs mt-2">{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
