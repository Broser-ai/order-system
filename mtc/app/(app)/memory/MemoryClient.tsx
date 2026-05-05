"use client";

import { useState } from "react";

interface Project { id: string; name: string; }
interface Watcher { id: string; name: string; trigger_description: string; action_description: string; schedule_cron: string; schedule_human: string; status: string; last_run_at: string; }
interface WatcherRun { id: string; watcher_id: string; started_at: string; status: string; error_message?: string; }

export default function MemoryClient({ projects, watchers, watcherRuns, userId }: {
  projects: Project[]; watchers: Watcher[]; watcherRuns: WatcherRun[]; userId: string;
}) {
  const [tab, setTab] = useState<"memory" | "watchers">("memory");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [watcherName, setWatcherName] = useState("");
  const [watcherTrigger, setWatcherTrigger] = useState("");
  const [watcherAction, setWatcherAction] = useState("");
  const [watcherCron, setWatcherCron] = useState("0 7 * * *");
  const [localWatchers, setLocalWatchers] = useState(watchers);

  async function saveMemory() {
    if (!content || !projectId) return;
    setSaving(true);
    await fetch("/api/memory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, topic, content }) });
    setContent(""); setTopic("");
    setSaving(false);
  }

  async function saveWatcher() {
    if (!watcherName || !watcherAction) return;
    const res = await fetch("/api/watchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: watcherName, triggerDescription: watcherTrigger, actionDescription: watcherAction, scheduleCron: watcherCron, scheduleHuman: "Custom schedule" }) });
    const data = await res.json();
    if (data.watcher) setLocalWatchers(prev => [data.watcher, ...prev]);
    setWatcherName(""); setWatcherTrigger(""); setWatcherAction("");
  }

  async function runWatcher(id: string) {
    await fetch(`/api/watchers/run/${id}`, { method: "POST" });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Memory & Watchers</h1>
        <p className="text-gray-400 mt-1 text-sm">Project memory that Conductor uses as context · Scheduled watchers</p>
      </div>
      <div className="flex gap-2 mb-6">
        {(["memory", "watchers"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            {t === "memory" ? "🧬 Memory" : "⏰ Watchers"}
          </button>
        ))}
      </div>

      {tab === "memory" && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">Add Memory</h3>
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-2">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic (e.g. 'Brand voice')" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:outline-none focus:border-indigo-500" />
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder="Memory content — this will be injected into Conductor briefs..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-2 resize-none focus:outline-none focus:border-indigo-500" />
            <button onClick={saveMemory} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50">{saving ? "Saving..." : "Save memory"}</button>
          </div>
        </div>
      )}

      {tab === "watchers" && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">Create Watcher</h3>
            <div className="space-y-2">
              <input value={watcherName} onChange={e => setWatcherName(e.target.value)} placeholder="Watcher name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
              <input value={watcherTrigger} onChange={e => setWatcherTrigger(e.target.value)} placeholder="Trigger description (e.g. 'Every morning at 7am')" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
              <textarea value={watcherAction} onChange={e => setWatcherAction(e.target.value)} rows={2} placeholder="Action description (e.g. 'Summarize news for our industry and post to Slack')" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-indigo-500" />
              <input value={watcherCron} onChange={e => setWatcherCron(e.target.value)} placeholder="Cron expression (e.g. 0 7 * * *)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500" />
              <button onClick={saveWatcher} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition">Create watcher</button>
            </div>
          </div>
          <div className="space-y-3">
            {localWatchers.map(w => (
              <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium text-sm">{w.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{w.action_description}</div>
                    <div className="text-gray-600 text-xs mt-1 font-mono">{w.schedule_cron}</div>
                  </div>
                  <button onClick={() => runWatcher(w.id)} className="text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-800/50 px-3 py-1.5 rounded-lg hover:bg-indigo-600/40 transition">Run now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
