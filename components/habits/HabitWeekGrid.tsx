"use client";

import { useFlowStore } from "@/lib/store";
import { getWeekDays, dateKey, todayKey } from "@/lib/utils";
import { format, isToday } from "date-fns";

export function HabitWeekGrid() {
  const habits = useFlowStore((s) => s.habits);
  const toggleHabitToday = useFlowStore((s) => s.toggleHabitToday);
  const firstDayOfWeek = useFlowStore((s) => s.settings.firstDayOfWeek);
  const days = getWeekDays(firstDayOfWeek);
  const today = todayKey();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface p-4">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-muted">
              Habit
            </th>
            {days.map((d) => (
              <th
                key={d.toISOString()}
                className={`pb-2 text-center text-xs font-medium uppercase tracking-wider ${
                  isToday(d) ? "text-accent-green" : "text-muted"
                }`}
              >
                {format(d, "EEE")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => (
            <tr key={h.id} className="border-t border-border/60">
              <td className="py-2.5 pr-3 text-zinc-300">
                <span className="mr-1.5">{h.icon}</span>
                {h.name}
              </td>
              {days.map((d) => {
                const key = dateKey(d);
                const done = h.completions.includes(key);
                const isPast = key <= today;
                return (
                  <td key={key} className="text-center">
                    <button
                      onClick={() => key === today && toggleHabitToday(h.id)}
                      disabled={key !== today}
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md ${
                        done
                          ? "bg-accent-green"
                          : isPast
                          ? "bg-zinc-800"
                          : "bg-zinc-900"
                      } ${key === today ? "ring-1 ring-accent-green/50" : ""}`}
                      aria-label={`${h.name} on ${format(d, "EEEE")}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
