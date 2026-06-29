"use client";

import { useHydrated } from "@/lib/useHydrated";
import { StatsCards } from "@/components/stats/StatsCards";
import { WeeklyBarChart } from "@/components/stats/WeeklyBarChart";
import { CategoryPieChart } from "@/components/stats/CategoryPieChart";
import { MonthHeatmap } from "@/components/stats/MonthHeatmap";
import { HabitRateCompare } from "@/components/stats/HabitRateCompare";

export default function StatsPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-heading">Stats</h1>

      <StatsCards />

      <div className="grid gap-5 md:grid-cols-2">
        <WeeklyBarChart />
        <CategoryPieChart />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <MonthHeatmap />
        <HabitRateCompare />
      </div>
    </div>
  );
}
