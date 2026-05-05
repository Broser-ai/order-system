"use client";

import { useState } from "react";

interface Ecosystem { id: string; name: string; role: string; systems: string; default_agents: string; modalities: string; gateway_options: string; governance_notes: string; openrouter_model_string: string; display_color: string; }

export default function UBIClient({ ecosystems }: { ecosystems: Ecosystem[] }) {
  const [query, setQuery] = useState("");
  const [matchResults, setMatchResults] = useState<Ecosystem[]>([]);
  const [matching, setMatching] = useState(false);

  function handleMatch() {
    if (!query) return;
    setMatching(true);
    const q = query.toLowerCase();
    const scored = ecosystems.map(e => {
      let score = 0;
      if (e.default_agents?.toLowerCase().includes(q)) score += 3;
      if (e.role?.toLowerCase().includes(q)) score += 2;
      if (e.modalities?.toLowerCase().includes(q)) score += 2;
      if (e.name?.toLowerCase().includes(q)) score += 1;
      if (e.governance_notes?.toLowerCase().includes(q)) score += 1;
      return { ...e, score };
    }).filter(e => e.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
    setMatchResults(scored);
    setMatching(false);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Universal Build Intelligence</h1>
        <p className="text-gray-400 mt-1 text-sm">Find the right AI ecosystem for your task</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
        <label className="block text-sm text-gray-400 mb-2">What do you need to do?</label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleMatch()}
            placeholder="e.g. 'generate marketing images', 'analyze legal contract', 'code generation', 'EU GDPR compliant'"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button onClick={handleMatch} disabled={matching} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50">
            Match
          </button>
        </div>
      </div>

      {matchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Best Matches for &quot;{query}&quot;</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchResults.map(e => (
              <div key={e.id} className="bg-gray-900 border rounded-xl p-4" style={{ borderLeftColor: e.display_color, borderLeftWidth: 3, borderTopColor: "#374151", borderRightColor: "#374151", borderBottomColor: "#374151" }}>
                <div className="text-white font-semibold text-sm mb-1">{e.name}</div>
                <div className="text-gray-400 text-xs mb-1">{e.role}</div>
                <div className="text-gray-500 text-xs mb-2">{e.default_agents}</div>
                {e.openrouter_model_string && <div className="font-mono text-xs text-indigo-400">{e.openrouter_model_string}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-white font-semibold mb-3">All Ecosystems ({ecosystems.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ecosystems.map(e => (
            <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-xs">
              <div className="text-white font-medium mb-0.5" style={{ color: e.display_color }}>{e.name}</div>
              <div className="text-gray-600">{e.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
