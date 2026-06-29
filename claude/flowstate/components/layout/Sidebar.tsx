"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Flame,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/focus", label: "Focus", icon: Target },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const activeTaskCount = useFlowStore((s) =>
    s.tasks.filter((t) => t.status === "active").length
  );

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex-shrink-0 border-r border-border bg-surface transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-full flex-col justify-between py-5">
        <div>
          <div className={cn("mb-8 flex items-center gap-2 px-4", collapsed && "justify-center px-0")}>
            <div className="h-6 w-6 rounded bg-accent-green" />
            {!collapsed && (
              <span className="font-mono text-sm font-semibold tracking-tight text-heading">
                FLOWSTATE
              </span>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-green/10 text-accent-green"
                      : "text-muted hover:bg-white/5 hover:text-heading",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon size={18} strokeWidth={2} />
                  {!collapsed && (
                    <span className="flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.href === "/tasks" && activeTaskCount > 0 && (
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                      {activeTaskCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-1 px-3">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-heading",
              collapsed && "justify-center px-0"
            )}
          >
            <Settings size={18} strokeWidth={2} />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-heading",
              collapsed && "justify-center px-0"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
