"use client";

import { useFlowStore } from "@/lib/store";
import { getWeekDays, dateKey } from "@/lib/utils";
import { addDays } from "date-fns";

export function HabitRateCompare() {
  const habits = useFlowStore((s) => s.habits);
  const firstDayOfWeek = useFlowStore((s) => s.settings.firstDayOfWeek);

  const thisWeekDays = getWeekDays(firstDayOfWeek);
  const lastWeekDays = thisWeekDays.map((d) => addDays(d, -7));

  function rate(days: Date[]) {
    const past = days.filter((d) => dateKey(d) <= dateKey(new Date()));
    const total = habits.length * past.length;
    if (total === 0) return 0;
    const done = habits.reduce(
      (sum, h) => sum + past.filter((d) => h.completions.includes(dateKey(d))).length,
      0
    );
    return Math.round((done / total) * 100);
  }

  const thisRate = rate(thisWeekDays);
  const lastRate = rate(lastWeekDays);
  const diff = thisRate - lastRate;

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
        Habit completion rate
      </div>
      <div className="flex items-end gap-6">
        <div>
          <div className="font-mono text-3xl font-bold text-heading">{thisRate}%</div>
          <div className="text-xs text-muted">This week</div>
        </div>
        <div>
          <div className="font-mono text-2xl text-zinc-500">{lastRate}%</div>
          <div className="text-xs text-muted">Last week</div>
        </div>
        {lastRate > 0 && (
          <div
            className={`font-mono text-lg font-bold ${
              diff >= 0 ? "text-accent-green" : "text-danger"
            }`}
          >
            {diff >= 0 ? "+" : ""}
            {diff}%
          </div>
        )}
      </div>
    </div>
  );
}
