export default function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">Configure your AI keys and platform preferences</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
        <h3 className="text-white font-medium mb-1">Server-side API Keys</h3>
        <p className="text-gray-500 text-sm mb-3">These are configured as Vercel environment variables and are not visible here for security reasons.</p>
        <div className="space-y-2">
          {["OPENROUTER_API_KEY", "COMPOSIO_API_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ANTHROPIC_API_KEY", "GITHUB_TOKEN"].map(key => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
              <span className="font-mono text-sm text-gray-300">{key}</span>
              <span className="text-xs text-gray-600">Set in Vercel → Settings → Environment Variables</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-medium mb-1">Platform Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Supabase Project</span><span className="text-white font-mono">tbuluvvqhrbgfcpoifjl</span></div>
          <div className="flex justify-between"><span className="text-gray-400">AI Gateway</span><span className="text-white">OpenRouter (200+ models)</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Tool Integration</span><span className="text-white">Composio SDK</span></div>
          <div className="flex justify-between"><span className="text-gray-400">MCP Hosting</span><span className="text-white">Horizon / FastMCP</span></div>
        </div>
      </div>
    </div>
  );
}
