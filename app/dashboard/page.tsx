"use client";

import { useHydrated } from "@/lib/useHydrated";
import {
  GreetingHero,
  DailyGoal,
  MiniTaskList,
  QuoteRotator,
  HabitStatusRow,
} from "@/components/dashboard/DashboardWidgets";
import { WeeklyMiniChart } from "@/components/dashboard/WeeklyMiniChart";
import { PomodoroMiniWidget } from "@/components/dashboard/PomodoroMiniWidget";

export default function DashboardPage() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-surface" />;
  }

  return (
    <div>
      <GreetingHero />
      <DailyGoal />

      <div className="grid gap-4 md:grid-cols-2">
        <MiniTaskList />
        <PomodoroMiniWidget />
        <QuoteRotator />
        <WeeklyMiniChart />
      </div>

      <div className="mt-4">
        <HabitStatusRow />
      </div>
    </div>
  );
}
