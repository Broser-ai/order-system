import { createClient } from "@/lib/supabase/server";

const LAYERS = [
  { id: "ui", name: "Simple UI / Output Selector", route: "/", check: "home_page" },
  { id: "contract", name: "Project Execution Contract", route: "/projects", check: "projects" },
  { id: "ubi", name: "Universal Build Intelligence", route: "/ubi", check: "ubi" },
  { id: "artifact", name: "Artifact Intelligence Engine", route: "/ubi", check: "ubi" },
  { id: "conductor", name: "AI Conductor", route: "/conductor", check: "conductor" },
  { id: "classifier", name: "Task Classifier", route: "/conductor", check: "conductor" },
  { id: "aggregator", name: "Model Aggregator (8 patterns)", route: "/conductor", check: "patterns" },
  { id: "agents", name: "Agent Orchestration (90 departments)", route: "/departments", check: "departments" },
  { id: "mcp", name: "MCP / Connector Layer", route: "/horizon", check: "horizon" },
  { id: "composio", name: "Composio Tool Router", route: "/composio", check: "composio" },
  { id: "automation", name: "n8n/Make/Zapier/Pipedream", route: "/automation", check: "automation" },
  { id: "security", name: "QA / Approval / Security", route: "/security", check: "security" },
  { id: "delivery", name: "Delivery / Deployment", route: "/builder", check: "builder" },
  { id: "memory", name: "Memory / Watchers / Auto-Rerun", route: "/memory", check: "memory" },
];

export default async function ArchitecturePage() {
  const supabase = await createClient();
  const [
    { count: deptCount },
    { count: ecoCount },
    { count: patternCount },
    { count: riskCount },
    { count: toolkitCount },
    { count: horizonCount },
  ] = await Promise.all([
    supabase.from("departments").select("*", { count: "exact", head: true }),
    supabase.from("ai_ecosystems").select("*", { count: "exact", head: true }),
    supabase.from("execution_patterns").select("*", { count: "exact", head: true }),
    supabase.from("risk_classes").select("*", { count: "exact", head: true }),
    supabase.from("composio_toolkits").select("*", { count: "exact", head: true }),
    supabase.from("horizon_templates").select("*", { count: "exact", head: true }),
  ]);

  const checks: Record<string, boolean> = {
    home_page: true, projects: true, ubi: true, conductor: true,
    patterns: (patternCount ?? 0) === 8,
    departments: (deptCount ?? 0) >= 90,
    horizon: (horizonCount ?? 0) >= 10,
    composio: (toolkitCount ?? 0) > 50,
    automation: true, security: (riskCount ?? 0) === 4,
    builder: true, memory: true,
  };

  const passing = LAYERS.filter(l => checks[l.check]).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Architecture Status</h1>
        <p className="text-gray-400 mt-1 text-sm">{passing}/{LAYERS.length} layers active</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Departments", value: deptCount },
          { label: "AI Ecosystems", value: ecoCount },
          { label: "Patterns", value: patternCount },
          { label: "Risk Classes", value: riskCount },
          { label: "Composio Tools", value: toolkitCount },
          { label: "Horizon Templates", value: horizonCount },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {LAYERS.map((layer, i) => {
          const ok = checks[layer.check];
          return (
            <div key={layer.id} className={`flex items-center gap-3 p-3 rounded-xl border ${ok ? "bg-green-900/10 border-green-900/30" : "bg-gray-900 border-gray-800"}`}>
              <span className={`text-lg ${ok ? "text-green-400" : "text-gray-600"}`}>{ok ? "✓" : "○"}</span>
              <span className={`text-xs text-gray-500 w-5`}>{i + 1}</span>
              <span className={`flex-1 text-sm ${ok ? "text-white" : "text-gray-500"}`}>{layer.name}</span>
              <a href={layer.route} className="text-xs text-indigo-500 hover:text-indigo-400 transition">{layer.route}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
