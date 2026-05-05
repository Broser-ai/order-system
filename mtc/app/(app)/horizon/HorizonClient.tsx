"use client";

import { useState } from "react";

interface Connector { id: string; name: string; url: string; status: string; capabilities: string[]; provider: string; }
interface Template { id: string; name: string; description: string; capabilities: string[]; category: string; auth_type: string; }
interface Tool { name: string; description: string; }

export default function HorizonClient({ connectors, templates }: { connectors: Connector[]; templates: Template[]; }) {
  const [probeResults, setProbeResults] = useState<Record<string, { tools: Tool[]; error?: string; loading?: boolean }>>({});

  async function handleProbe(url: string, id: string) {
    setProbeResults(prev => ({ ...prev, [id]: { tools: [], loading: true } }));
    const res = await fetch("/api/horizon/probe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    const data = await res.json();
    setProbeResults(prev => ({ ...prev, [id]: { tools: data.tools ?? [], error: data.error } }));
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Horizon Runtime</h1>
        <p className="text-gray-400 mt-1 text-sm">Your deployed MCP servers — probe to discover tools</p>
      </div>

      <div className="mb-8">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Your Servers ({connectors.length})</h2>
        <div className="space-y-3">
          {connectors.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-medium">{c.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5 font-mono">{c.url}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(c.capabilities as unknown as string[]).map((cap: string) => (
                      <span key={cap} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{cap}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleProbe(c.url, c.id)}
                  disabled={probeResults[c.id]?.loading}
                  className="shrink-0 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs px-3 py-1.5 rounded-lg border border-indigo-800/50 transition disabled:opacity-50"
                >
                  {probeResults[c.id]?.loading ? "Probing..." : "Probe"}
                </button>
              </div>
              {probeResults[c.id] && !probeResults[c.id].loading && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  {probeResults[c.id].error
                    ? <p className="text-red-400 text-xs">{probeResults[c.id].error}</p>
                    : <div className="space-y-1">{probeResults[c.id].tools.map(t => (
                        <div key={t.name} className="text-xs text-gray-300">
                          <span className="text-green-400 font-mono">{t.name}</span>
                          {t.description && <span className="text-gray-500 ml-2">— {t.description}</span>}
                        </div>
                      ))}</div>
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Templates ({templates.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map(t => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-white font-medium text-sm mb-1">{t.name}</div>
              <div className="text-gray-500 text-xs mb-2">{t.description}</div>
              <div className="flex gap-1 flex-wrap">
                {(t.capabilities as unknown as string[]).slice(0, 3).map((cap: string) => (
                  <span key={cap} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{cap}</span>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-600">Auth: {t.auth_type} · {t.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
