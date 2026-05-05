"use client";

import { useState } from "react";
import Link from "next/link";

interface Project { id: string; name: string; description: string; status: string; created_at: string; }

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localProjects, setLocalProjects] = useState(projects);
  const [creating, setCreating] = useState(false);

  async function createProject() {
    if (!name) return;
    setCreating(true);
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) });
    const data = await res.json();
    if (data.project) { setLocalProjects(prev => [data.project, ...prev]); setName(""); setDescription(""); }
    setCreating(false);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-gray-400 mt-1 text-sm">{localProjects.length} projects</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-medium text-sm mb-3">New Project</h3>
        <div className="space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          <button onClick={createProject} disabled={creating} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50">{creating ? "Creating..." : "Create project"}</button>
        </div>
      </div>
      <div className="space-y-3">
        {localProjects.map(p => (
          <Link key={p.id} href={`/projects/${p.id}`} className="block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium group-hover:text-indigo-300 transition">{p.name}</div>
                {p.description && <div className="text-gray-500 text-xs mt-0.5">{p.description}</div>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-green-900/40 text-green-300" : "bg-gray-800 text-gray-400"}`}>{p.status}</span>
            </div>
          </Link>
        ))}
        {localProjects.length === 0 && <div className="text-center text-gray-600 py-12">No projects yet. Create one above.</div>}
      </div>
    </div>
  );
}
