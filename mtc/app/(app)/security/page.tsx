import { createClient } from "@/lib/supabase/server";

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: riskClasses }, { data: auditLog }] = await Promise.all([
    supabase.from("risk_classes").select("*").order("display_order"),
    supabase.from("audit_log").select("*").eq("user_id", user!.id).order("timestamp", { ascending: false }).limit(50),
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Security Policy</h1>
        <p className="text-gray-400 mt-1 text-sm">4 risk classes · every AI call is audited</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(riskClasses ?? []).map(rc => (
          <div key={rc.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: rc.color, borderLeftWidth: 3 }}>
            <div className="font-semibold text-white text-sm mb-1">{rc.name}</div>
            <div className="text-gray-500 text-xs mb-2">{rc.examples}</div>
            <div className="text-xs px-2 py-1 rounded-full inline-block" style={{ backgroundColor: rc.bg_color + "33", color: rc.color }}>
              {rc.approval_default.replace(/_/g, " ")}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-white font-semibold mb-3">Audit Log</h2>
        {(auditLog ?? []).length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
            No audit events yet. Run a Conductor brief to see entries here.
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr className="text-gray-500 text-xs">
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Target</th>
                  <th className="text-left p-3">Risk</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {(auditLog ?? []).map(entry => (
                  <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-3 text-gray-500 text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 text-white text-xs font-mono">{entry.action}</td>
                    <td className="p-3 text-gray-400 text-xs">{entry.target ?? "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        entry.risk_class === "critical" ? "bg-purple-900/40 text-purple-300" :
                        entry.risk_class === "high" ? "bg-red-900/40 text-red-300" :
                        entry.risk_class === "medium" ? "bg-yellow-900/40 text-yellow-300" :
                        "bg-green-900/40 text-green-300"
                      }`}>{entry.risk_class}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs ${entry.status === "ok" ? "text-green-400" : entry.status === "error" ? "text-red-400" : "text-yellow-400"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-500 text-xs">{entry.cost_usd > 0 ? `$${Number(entry.cost_usd).toFixed(6)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
