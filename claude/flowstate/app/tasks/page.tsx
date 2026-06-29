"use client";

import { useHydrated } from "@/lib/useHydrated";
import { TaskList } from "@/components/tasks/TaskList";

export default function TasksPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;
  return <TaskList />;
}
