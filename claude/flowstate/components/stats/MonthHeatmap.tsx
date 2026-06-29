"use client";

import { useMemo } from "react";
import { useFlowStore } from "@/lib/store";
import { dateKey } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from "date-fns";

function getColor(count: number) {
  if (count === 0) return "bg-zinc-800";
  if (count <= 2) return "bg-accent-green/30";
  if (count <= 5) return "bg-accent-green/60";
  if (count <= 8) return "bg-accent-green/85";
  return "bg-accent-green";
}

export function MonthHeatmap() {
  const tasks = useFlowStore((s) => s.tasks);

  const { days, dayCountMap, monthLabel, leadingBlanks } = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    const dayCountMap: Record<string, number> = {};
    tasks
      .filter((t) => t.completedAt)
      .forEach((t) => {
        const k = dateKey(t.completedAt!);
        dayCountMap[k] = (dayCountMap[k] || 0) + 1;
      });

    // getDay returns 0=Sun, 1=Mon…; we want Mon-first grid
    const rawDay = getDay(start);
    const leadingBlanks = rawDay === 0 ? 6 : rawDay - 1;

    return { days, dayCountMap, monthLabel: format(now, "MMMM yyyy"), leadingBlanks };
  }, [tasks]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
        {monthLabel} — daily completions
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="text-xs text-zinc-600">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((d) => {
          const key = dateKey(d);
          const count = dayCountMap[key] ?? 0;
          const isToday = key === dateKey(new Date());
          return (
            <div
              key={key}
              title={`${format(d, "MMM d")}: ${count} task${count !== 1 ? "s" : ""}`}
              className={`aspect-square rounded-sm ${getColor(count)} ${
                isToday ? "ring-1 ring-accent-green ring-offset-1 ring-offset-surface" : ""
              }`}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>Less</span>
        {[0, 2, 5, 8, 10].map((n) => (
          <div key={n} className={`h-3 w-3 rounded-sm ${getColor(n)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
