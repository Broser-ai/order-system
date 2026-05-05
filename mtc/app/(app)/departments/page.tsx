import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DepartmentsPage() {
  const supabase = await createClient();
  const { data: departments } = await supabase.from("departments").select("*, masters(id, name)").order("tier").order("display_order");

  const tiers = [...new Set((departments ?? []).map(d => d.tier))].sort();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Departments</h1>
        <p className="text-gray-400 mt-1 text-sm">{departments?.length ?? 0} departments across 10 tiers</p>
      </div>
      {tiers.map(tier => {
        const items = (departments ?? []).filter(d => d.tier === tier);
        const tierName = items[0]?.tier_name ?? `Tier ${tier}`;
        return (
          <div key={tier} className="mb-8">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Tier {tier} — {tierName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(d => (
                <Link key={d.id} href={`/departments/${d.id}`} className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition">
                  <div className="text-white font-medium text-sm group-hover:text-indigo-300 transition">{d.name}</div>
                  <div className="text-gray-500 text-xs mt-1 line-clamp-2">{d.scope}</div>
                  <div className="text-gray-600 text-xs mt-2">{(d.masters as unknown[])?.length ?? 0} masters</div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
