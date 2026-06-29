import type { Habit } from "./types";
import { generateId } from "./utils";

export function getDefaultHabits(): Habit[] {
  const now = new Date().toISOString();
  const base: Array<Pick<Habit, "name" | "icon" | "category">> = [
    { name: "Cold outreach", icon: "📞", category: "Business" },
    { name: "ML/AI learning", icon: "🧠", category: "Learning" },
    { name: "Code for 1+ hour", icon: "💻", category: "Business" },
    { name: "Exercise / movement", icon: "🏃", category: "Health" },
    { name: "Read for 20 min", icon: "📖", category: "Mental" },
    { name: "No social media before noon", icon: "🚫", category: "Misc" },
  ];

  return base.map((h, i) => ({
    id: generateId(),
    name: h.name,
    icon: h.icon,
    category: h.category,
    completions: [],
    order: i,
    createdAt: now,
  }));
}

export const TASK_CATEGORIES = [
  "Business",
  "CAC/Projects",
  "Learning",
  "Personal",
  "Other",
] as const;

export const HABIT_CATEGORIES = ["Health", "Business", "Learning", "Mental", "Misc"] as const;

export const PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
