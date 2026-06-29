"use client";

import { useMemo } from "react";
import { useFlowStore } from "@/lib/store";
import { calculateTaskStreak, todayKey, dateKey } from "@/lib/utils";
import { startOfWeek, startOfMonth, parseISO } from "date-fns";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className="font-mono text-3xl font-bold text-heading">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function StatsCards() {
  const tasks = useFlowStore((s) => s.tasks);
  const focusSessions = useFlowStore((s) => s.focusSessions);

  const stats = useMemo(() => {
    const today = todayKey();
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const monthStart = startOfMonth(new Date());

    const completed = tasks.filter((t) => t.completedAt);
    const todayCount = completed.filter((t) => dateKey(t.completedAt!) === today).length;
    const weekCount = completed.filter((t) => parseISO(t.completedAt!) >= weekStart).length;
    const monthCount = completed.filter((t) => parseISO(t.completedAt!) >= monthStart).length;
    const allTime = completed.length;

    const { current, best } = calculateTaskStreak(tasks);

    const focusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const focusHours = Math.floor(focusMinutes / 60);
    const focusMinsLeft = focusMinutes % 60;

    // Most productive day of week
    const dayCount: Record<string, number> = {};
    completed.forEach((t) => {
      const d = parseISO(t.completedAt!).toLocaleDateString("en-US", { weekday: "long" });
      dayCount[d] = (dayCount[d] || 0) + 1;
    });
    const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return { todayCount, weekCount, monthCount, allTime, current, best, focusHours, focusMinsLeft, focusSessions: focusSessions.length, bestDay };
  }, [tasks, focusSessions]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Completed today" value={stats.todayCount} />
      <StatCard label="Completed this week" value={stats.weekCount} />
      <StatCard label="Completed this month" value={stats.monthCount} />
      <StatCard label="All time" value={stats.allTime} sub="tasks completed" />
      <StatCard label="Current streak" value={`${stats.current}d`} sub="consecutive days" />
      <StatCard label="Best streak ever" value={`${stats.best}d`} />
      <StatCard
        label="Total focus time"
        value={`${stats.focusHours}h ${stats.focusMinsLeft}m`}
        sub={`${stats.focusSessions} Pomodoro sessions`}
      />
      <StatCard label="Most productive day" value={stats.bestDay} />
    </div>
  );
}
