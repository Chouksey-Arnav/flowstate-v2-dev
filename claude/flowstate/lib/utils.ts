import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isYesterday,
  parseISO,
  differenceInCalendarDays,
  startOfWeek,
  addDays,
  isSameDay,
  getDayOfYear,
  isLeapYear,
} from "date-fns";
import type { Task, Habit } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function dateKey(d: Date | string): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "yyyy-MM-dd");
}

export function dayOfYearLabel(): string {
  const now = new Date();
  const day = getDayOfYear(now);
  const total = isLeapYear(now) ? 366 : 365;
  return `Day ${day} of ${total} — ${total - day} left.`;
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return "Still up. Time to build.";
  if (hour < 12) return "Good morning. Time to build.";
  if (hour < 17) return "Good afternoon. Keep moving.";
  if (hour < 21) return "Good evening. Finish strong.";
  return "Late night grind. Respect.";
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status !== "active") return false;
  const due = parseISO(task.dueDate);
  return differenceInCalendarDays(new Date(), due) > 0;
}

/**
 * A "completion day" is any calendar day where at least one task was
 * completed. Streak = consecutive days up to and including today/yesterday.
 */
export function calculateTaskStreak(tasks: Task[]): { current: number; best: number } {
  const completionDays = new Set(
    tasks
      .filter((t) => t.completedAt)
      .map((t) => dateKey(t.completedAt as string))
  );

  if (completionDays.size === 0) return { current: 0, best: 0 };

  const sortedDays = Array.from(completionDays).sort();

  // Best streak: longest run of consecutive calendar days
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = parseISO(sortedDays[i - 1]);
    const curr = parseISO(sortedDays[i]);
    if (differenceInCalendarDays(curr, prev) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
  }

  // Current streak: walk backward from today (or yesterday, so a streak
  // doesn't break just because today isn't over yet)
  let current = 0;
  let cursor = new Date();
  if (!completionDays.has(dateKey(cursor)) && !completionDays.has(dateKey(addDays(cursor, -1)))) {
    return { current: 0, best };
  }
  if (!completionDays.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (completionDays.has(dateKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, best };
}

export function calculateHabitStreak(habit: Habit): { current: number; longest: number } {
  if (habit.completions.length === 0) return { current: 0, longest: 0 };
  const days = Array.from(new Set(habit.completions)).sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = parseISO(days[i - 1]);
    const curr = parseISO(days[i]);
    if (differenceInCalendarDays(curr, prev) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  let current = 0;
  let cursor = new Date();
  const set = new Set(days);
  if (!set.has(dateKey(cursor)) && !set.has(dateKey(addDays(cursor, -1)))) {
    return { current: 0, longest };
  }
  if (!set.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (set.has(dateKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}

export function getWeekDays(firstDayOfWeek: "sunday" | "monday" = "monday"): Date[] {
  const start = startOfWeek(new Date(), { weekStartsOn: firstDayOfWeek === "monday" ? 1 : 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatDueDate(iso?: string): string {
  if (!iso) return "";
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export { isSameDay, format, parseISO };
