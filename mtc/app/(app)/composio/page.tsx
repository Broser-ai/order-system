import { createClient } from "@/lib/supabase/server";

export default async function ComposioPage() {
  const supabase = await createClient();
  const { data: toolkits } = await supabase.from("composio_toolkits").select("*").order("is_popular", { ascending: false }).order("name");

  const categories = [...new Set((toolkits ?? []).map(t => t.category))].sort();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Composio Runtime</h1>
        <p className="text-gray-400 mt-1 text-sm">{toolkits?.length ?? 0} tool integrations available</p>
      </div>
      {categories.map(cat => {
        const items = (toolkits ?? []).filter(t => t.category === cat);
        return (
          <div key={cat} className="mb-8">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{cat}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map(t => (
                <div key={t.slug} className={`bg-gray-900 border rounded-xl p-4 ${t.is_popular ? "border-indigo-800/50" : "border-gray-800"}`}>
                  <div className="font-medium text-white text-sm mb-1">{t.name}</div>
                  <div className="text-gray-500 text-xs mb-2 line-clamp-2">{t.description}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.auth_type === "oauth" ? "bg-blue-900/40 text-blue-300" : "bg-gray-800 text-gray-400"}`}>
                    {t.auth_type}
                  </span>
                  {t.is_popular && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300">popular</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
