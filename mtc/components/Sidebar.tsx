"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/conductor", label: "AI Conductor", icon: "🎼" },
  { href: "/ubi", label: "Build Intelligence", icon: "🧠" },
  { href: "/horizon", label: "Horizon Runtime", icon: "🌐" },
  { href: "/composio", label: "Composio", icon: "🔧" },
  { href: "/departments", label: "Departments", icon: "🏢" },
  { href: "/ecosystems", label: "AI Ecosystems", icon: "🤖" },
  { href: "/projects", label: "Projects", icon: "📁" },
  { href: "/memory", label: "Memory & Watchers", icon: "🧬" },
  { href: "/builder", label: "Connector Builder", icon: "🔨" },
  { href: "/automation", label: "Automation", icon: "⚡" },
  { href: "/security", label: "Security", icon: "🔒" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/architecture", label: "Architecture", icon: "🗺️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-800">
        <div className="text-white font-bold text-sm">Master Team Console</div>
        <div className="text-gray-500 text-xs mt-0.5">AI Orchestration Platform</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 border-r-2 border-indigo-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="w-full text-left text-gray-500 hover:text-white text-sm transition-colors"
        >
          → Sign out
        </button>
      </div>
    </aside>
  );
}
