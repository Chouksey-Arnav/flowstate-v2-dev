"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useFlowStore } from "@/lib/store";
import { getWeekDays, dateKey } from "@/lib/utils";
import { format } from "date-fns";

export function WeeklyMiniChart() {
  const tasks = useFlowStore((s) => s.tasks);
  const firstDayOfWeek = useFlowStore((s) => s.settings.firstDayOfWeek);

  const days = getWeekDays(firstDayOfWeek);
  const data = days.map((d) => {
    const key = dateKey(d);
    const count = tasks.filter((t) => t.completedAt && dateKey(t.completedAt) === key).length;
    return { day: format(d, "EEEEE"), count };
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        This week
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: "#71717A", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#18181B",
              border: "1px solid #27272A",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#FAFAFA" }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
