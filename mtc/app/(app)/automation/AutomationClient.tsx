"use client";

import { useState } from "react";

interface Platform { id: string; name: string; deployable: string; best_for: string; url: string; auth_type: string; }
interface Webhook { id: string; name: string; url: string; provider: string; status: string; }

export default function AutomationClient({ platforms, webhooks }: { platforms: Platform[]; webhooks: Webhook[] }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState("n8n");
  const [localWebhooks, setLocalWebhooks] = useState(webhooks);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [triggerResult, setTriggerResult] = useState<Record<string, string>>({});

  async function addWebhook() {
    if (!name || !url) return;
    const res = await fetch("/api/automation/webhooks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, url, provider }) });
    const data = await res.json();
    if (data.webhook) { setLocalWebhooks(prev => [data.webhook, ...prev]); setName(""); setUrl(""); }
  }

  async function triggerWebhook(id: string) {
    setTriggering(id);
    const res = await fetch(`/api/automation/trigger/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload: { source: "mtc", timestamp: new Date().toISOString() } }) });
    const data = await res.json();
    setTriggerResult(prev => ({ ...prev, [id]: data.ok ? "✓ Triggered" : `✗ ${data.error}` }));
    setTriggering(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Automation Platforms</h1>
        <p className="text-gray-400 mt-1 text-sm">n8n · Make · Zapier · Pipedream · Register webhooks · Trigger workflows</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {platforms.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition block">
            <div className="text-white font-medium text-sm mb-1">{p.name}</div>
            <div className="text-gray-500 text-xs mb-2">{p.best_for}</div>
            <div className="text-gray-600 text-xs">{p.deployable}</div>
          </a>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-medium text-sm mb-3">Register Webhook</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Webhook name" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Webhook URL" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          <select value={provider} onChange={e => setProvider(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
            {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <button onClick={addWebhook} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition">Add webhook</button>
      </div>

      {localWebhooks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-500 text-xs">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Provider</th><th className="text-left p-3">URL</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {localWebhooks.map(w => (
                <tr key={w.id} className="border-b border-gray-800/50">
                  <td className="p-3 text-white">{w.name}</td>
                  <td className="p-3 text-gray-400">{w.provider}</td>
                  <td className="p-3 text-gray-500 text-xs font-mono truncate max-w-xs">{w.url}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => triggerWebhook(w.id)} disabled={triggering === w.id} className="text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-800/50 px-3 py-1 rounded-lg hover:bg-indigo-600/40 transition disabled:opacity-50">
                      {triggering === w.id ? "..." : triggerResult[w.id] ?? "Trigger"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
