import PathCard from "@/components/PathCard";

const pathCards = [
  {
    title: "AI Conductor",
    description: "Run multi-model AI workflows. Define a brief, build a squad, pick an execution pattern, and get real AI output.",
    href: "/conductor",
    icon: "🎼",
    color: "bg-indigo-600/20",
    badge: "Core",
  },
  {
    title: "Universal Build Intelligence",
    description: "Discover AI tools, match your task to the right ecosystem, and explore 58 AI providers by capability.",
    href: "/ubi",
    icon: "🧠",
    color: "bg-purple-600/20",
  },
  {
    title: "Horizon Runtime",
    description: "Browse and probe your deployed MCP servers. Add new servers, test tools, and manage connections.",
    href: "/horizon",
    icon: "🌐",
    color: "bg-blue-600/20",
  },
  {
    title: "Composio Runtime",
    description: "Access 500+ pre-built tool integrations. Connect Salesforce, GitHub, Slack, and 150+ apps.",
    href: "/composio",
    icon: "🔧",
    color: "bg-cyan-600/20",
    badge: "54 tools",
  },
  {
    title: "Security Policy",
    description: "4 risk classes with automated approval gates. Every AI call is audited. Review the live audit log.",
    href: "/security",
    icon: "🔒",
    color: "bg-red-600/20",
  },
  {
    title: "Memory & Watchers",
    description: "Persistent project memory that Conductor uses as context. Scheduled watchers that auto-run briefs.",
    href: "/memory",
    icon: "🧬",
    color: "bg-green-600/20",
  },
  {
    title: "Connector Builder",
    description: "Design custom MCP servers with a form. Generate FastMCP Python code. Deploy to Horizon.",
    href: "/builder",
    icon: "🔨",
    color: "bg-orange-600/20",
  },
  {
    title: "Automation Platforms",
    description: "Register n8n, Make, Zapier, or Pipedream webhooks. Trigger workflows directly from the console.",
    href: "/automation",
    icon: "⚡",
    color: "bg-yellow-600/20",
  },
  {
    title: "Multi-AI Settings",
    description: "Configure BYO API keys for specific gateways. Manage your OpenRouter, Anthropic, and other keys.",
    href: "/settings",
    icon: "⚙️",
    color: "bg-gray-600/20",
  },
  {
    title: "Architecture Status",
    description: "Live coverage of all 12 architecture layers. See which modules are active, configured, or missing.",
    href: "/architecture",
    icon: "🗺️",
    color: "bg-teal-600/20",
  },
];

export default function HomePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Master Team Console</h1>
        <p className="text-gray-400 mt-1">Universal AI Orchestration Platform — select a module to begin</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pathCards.map((card) => (
          <PathCard key={card.href} {...card} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">90</div>
          <div className="text-gray-500 text-sm">Departments</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">58</div>
          <div className="text-gray-500 text-sm">AI Ecosystems</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-gray-500 text-sm">Execution Patterns</div>
        </div>
      </div>
    </div>
  );
}
