import { createClient } from "@/lib/supabase/server";

export default async function EcosystemsPage() {
  const supabase = await createClient();
  const { data: ecosystems } = await supabase.from("ai_ecosystems").select("*").order("display_order");

  const roles = [...new Set((ecosystems ?? []).map(e => e.role))].sort();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Ecosystems</h1>
        <p className="text-gray-400 mt-1 text-sm">{ecosystems?.length ?? 0} AI providers, platforms, and frameworks</p>
      </div>
      {roles.map(role => {
        const items = (ecosystems ?? []).filter(e => e.role === role);
        return (
          <div key={role} className="mb-8">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{role}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(e => (
                <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: e.display_color, borderLeftWidth: 3 }}>
                  <div className="text-white font-medium text-sm mb-1">{e.name}</div>
                  <div className="text-gray-500 text-xs mb-2">{e.systems}</div>
                  <div className="text-gray-600 text-xs mb-2">{e.governance_notes}</div>
                  <div className="flex gap-1 flex-wrap">
                    {e.modalities?.split(",").map((m: string) => (
                      <span key={m} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{m.trim()}</span>
                    ))}
                  </div>
                  {e.openrouter_model_string && (
                    <div className="mt-2 font-mono text-xs text-indigo-400">{e.openrouter_model_string}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
