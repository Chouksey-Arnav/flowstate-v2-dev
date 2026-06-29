"use client";

import { useHydrated } from "@/lib/useHydrated";
import { HabitList } from "@/components/habits/HabitList";

export default function HabitsPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;
  return <HabitList />;
}
