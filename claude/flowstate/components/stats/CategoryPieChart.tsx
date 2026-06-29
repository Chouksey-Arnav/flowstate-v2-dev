"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useFlowStore } from "@/lib/store";

const COLORS = ["#22C55E", "#3B82F6", "#EAB308", "#EF4444", "#A855F7"];

export function CategoryPieChart() {
  const tasks = useFlowStore((s) => s.tasks);

  const categoryCounts: Record<string, number> = {};
  tasks
    .filter((t) => t.status === "completed")
    .forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

  const data = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
        Completed tasks by category
      </div>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted">
          Complete some tasks to see the breakdown.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#18181B",
                border: "1px solid #27272A",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#D4D4D8" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
