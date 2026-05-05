"use client";

import { useState } from "react";

interface Tool { name: string; description: string; params: string; }
interface Server { id: string; name: string; description: string; status: string; generated_code: string; horizon_deployment_url: string; }

export default function BuilderClient({ servers }: { servers: Server[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState<Tool[]>([{ name: "", description: "", params: "" }]);
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [localServers, setLocalServers] = useState(servers);

  function addTool() { setTools(prev => [...prev, { name: "", description: "", params: "" }]); }
  function updateTool(i: number, field: keyof Tool, value: string) {
    setTools(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  }

  async function handleGenerate() {
    if (!name || !tools[0].name) return;
    setGenerating(true);
    const res = await fetch("/api/connectors/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, tools }),
    });
    const data = await res.json();
    setGeneratedCode(data.code ?? "");
    if (data.server) setLocalServers(prev => [data.server, ...prev]);
    setGenerating(false);
  }

  function downloadCode() {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-server.py`; a.click();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Custom Connector Builder</h1>
        <p className="text-gray-400 mt-1 text-sm">Design a custom MCP server → generate FastMCP code → deploy to Horizon</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">Server Details</h3>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Server name (e.g. My CRM Connector)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:outline-none focus:border-indigo-500" />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium text-sm">Tools</h3>
              <button onClick={addTool} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add tool</button>
            </div>
            {tools.map((t, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-800 rounded-lg space-y-2">
                <input value={t.name} onChange={e => updateTool(i, "name", e.target.value)} placeholder="Tool name (e.g. get_customer)" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none" />
                <input value={t.description} onChange={e => updateTool(i, "description", e.target.value)} placeholder="What this tool does" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-xs focus:outline-none" />
                <input value={t.params} onChange={e => updateTool(i, "params", e.target.value)} placeholder="Parameters (e.g. customer_id: str, include_history: bool = False)" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none" />
              </div>
            ))}
          </div>
          <button onClick={handleGenerate} disabled={generating} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50">
            {generating ? "Generating..." : "Generate FastMCP Server"}
          </button>
        </div>

        <div className="space-y-4">
          {generatedCode && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">Generated Code</h3>
                <button onClick={downloadCode} className="text-xs bg-green-600/20 text-green-300 border border-green-800/50 px-3 py-1 rounded-lg hover:bg-green-600/40 transition">⬇ Download</button>
              </div>
              <pre className="text-xs text-green-300 font-mono overflow-x-auto max-h-80 overflow-y-auto bg-gray-950 p-3 rounded-lg">{generatedCode}</pre>
            </div>
          )}
          {localServers.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">Built Servers</h3>
              {localServers.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <div className="text-white text-sm">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.description}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "deployed" ? "bg-green-900/40 text-green-300" : "bg-gray-800 text-gray-400"}`}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
