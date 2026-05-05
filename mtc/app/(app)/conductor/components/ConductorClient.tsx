"use client";

import { useState } from "react";

interface Pattern { id: string; name: string; icon: string; description: string; use_case: string; }
interface Department { id: string; name: string; tier_name: string; }
interface Master { id: string; name: string; affiliation: string; authority: string; department_id: string; default_gateway: string; }
interface Ecosystem { id: string; name: string; openrouter_model_string: string; display_color: string; }
interface PatternResult { masterId: string; masterName: string; model: string; content: string; tokens: number; costUsd: number; status: string; error?: string; }

export default function ConductorClient({ patterns, departments, masters, ecosystems }: {
  patterns: Pattern[]; departments: Department[]; masters: Master[]; ecosystems: Ecosystem[];
}) {
  const [brief, setBrief] = useState("");
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]?.id ?? "");
  const [selectedMasters, setSelectedMasters] = useState<Master[]>([]);
  const [results, setResults] = useState<PatternResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [searchMaster, setSearchMaster] = useState("");

  const filteredMasters = masters.filter(m =>
    m.name.toLowerCase().includes(searchMaster.toLowerCase()) ||
    m.affiliation?.toLowerCase().includes(searchMaster.toLowerCase())
  ).slice(0, 20);

  function toggleMaster(master: Master) {
    setSelectedMasters(prev =>
      prev.find(m => m.id === master.id)
        ? prev.filter(m => m.id !== master.id)
        : [...prev, master]
    );
  }

  function getModelForMaster(master: Master): string {
    const eco = ecosystems.find(e => e.id === master.default_gateway);
    return eco?.openrouter_model_string || "anthropic/claude-opus-4";
  }

  async function handleRun() {
    if (!brief.trim()) { setError("Enter a brief"); return; }
    if (selectedMasters.length === 0 && !["cheap_batch_mode"].includes(selectedPattern)) {
      setError("Select at least one master"); return;
    }
    setLoading(true); setError(""); setResults([]);
    try {
      const gatewayConfig = {
        defaultModel: "anthropic/claude-opus-4",
        masterGateways: Object.fromEntries(selectedMasters.map(m => [m.id, getModelForMaster(m)])),
      };
      const res = await fetch("/api/ai/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, patternId: selectedPattern, squad: selectedMasters, components: { outputTypes: [] }, gatewayConfig }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Execution failed"); return; }
      setResults(data.results ?? []);
      setTotalCost(data.totalCost ?? 0);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">AI Conductor</h1>
      <p className="text-gray-400 mb-6 text-sm">Define a brief → select squad → pick pattern → execute</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Brief</label>
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              rows={4}
              placeholder="Describe what you want the AI squad to work on..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-300 mb-3">Execution Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {patterns.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPattern(p.id)}
                  className={`text-left p-3 rounded-lg border transition text-xs ${selectedPattern === p.id ? "border-indigo-500 bg-indigo-600/20 text-white" : "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"}`}
                >
                  <div className="font-medium">{p.icon} {p.name}</div>
                  <div className="text-gray-500 mt-0.5 text-xs">{p.use_case}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">{error}</div>}

          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            {loading ? "⏳ Running..." : "▶ Execute"}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold">Results</h2>
                <span className="text-gray-500 text-xs">${totalCost.toFixed(6)} total cost</span>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`bg-gray-900 border rounded-xl p-5 ${r.status === "error" ? "border-red-800" : "border-gray-800"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium text-sm">{r.masterName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">{r.model}</span>
                      <span className="text-gray-500 text-xs">{r.tokens} tok</span>
                    </div>
                  </div>
                  {r.status === "error"
                    ? <p className="text-red-400 text-sm">{r.error}</p>
                    : <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{r.content}</div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-fit">
          <h3 className="text-white font-medium mb-3 text-sm">Squad Builder</h3>
          <input
            value={searchMaster}
            onChange={e => setSearchMaster(e.target.value)}
            placeholder="Search masters..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-xs mb-3 focus:outline-none focus:border-indigo-500"
          />
          {selectedMasters.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Selected ({selectedMasters.length})</div>
              {selectedMasters.map(m => (
                <div key={m.id} className="flex items-center justify-between py-1">
                  <span className="text-indigo-300 text-xs">{m.name}</span>
                  <button onClick={() => toggleMaster(m)} className="text-gray-600 hover:text-red-400 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredMasters.map(m => {
              const selected = selectedMasters.some(s => s.id === m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMaster(m)}
                  className={`w-full text-left p-2 rounded-lg transition text-xs ${selected ? "bg-indigo-600/20 text-indigo-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                >
                  <div className="font-medium">{m.name}</div>
                  <div className="text-gray-600 text-xs">{m.affiliation}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
