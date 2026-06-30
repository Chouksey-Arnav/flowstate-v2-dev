"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFlowStore } from "@/lib/store";
import {
  greetingForHour,
  calculateTaskStreak,
  todayKey,
  isOverdue,
} from "@/lib/utils";
import { getCurrentQuote } from "@/lib/quotes";
import { Checkbox, Input } from "@/components/ui";
import { isLeapYear, getDayOfYear } from "date-fns";
import { Flame } from "lucide-react";

export function GreetingHero() {
  const name = useFlowStore((s) => s.settings.name);
  const [hour, setHour] = useState(new Date().getHours());
  const tasks = useFlowStore((s) => s.tasks);
  const { current } = calculateTaskStreak(tasks);

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const day = getDayOfYear(now);
  const total = isLeapYear(now) ? 366 : 365;
  const pct = Math.round((day / total) * 100);

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-semibold text-heading md:text-5xl">
        {greetingForHour(hour)}
        {name ? `, ${name}.` : ""}
      </h1>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-mono text-zinc-400">
              Day {day} of {total} — {total - day} left
            </span>
            <span className="font-mono text-zinc-500">{pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-accent-green transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
          <Flame size={18} className="text-accent-green" />
          <span className="font-mono text-2xl font-bold text-accent-green">{current}</span>
          <span className="text-xs text-muted">day streak</span>
        </div>
      </div>
    </div>
  );
}

export function DailyGoal() {
  const settings = useFlowStore((s) => s.settings);
  const updateSettings = useFlowStore((s) => s.updateSettings);
  const [value, setValue] = useState(settings.dailyGoal);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const today = todayKey();
    if (settings.dailyGoalDate !== today) {
      setValue("");
    } else {
      setValue(settings.dailyGoal);
    }
  }, [settings.dailyGoal, settings.dailyGoalDate]);

  function save() {
    updateSettings({ dailyGoal: value, dailyGoalDate: todayKey() });
    setEditing(false);
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        Today must accomplish
      </div>
      {editing ? (
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Ship the landing page. Close one deal. Whatever it is."
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full text-left text-lg text-heading hover:text-accent-green"
        >
          {value || "Click to set today's goal..."}
        </button>
      )}
    </div>
  );
}

export function MiniTaskList() {
  const tasks = useFlowStore((s) => s.tasks);
  const toggleTaskComplete = useFlowStore((s) => s.toggleTaskComplete);

  const top3 = tasks
    .filter((t) => t.status === "active")
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">
          Top priorities today
        </div>
        <Link href="/tasks" className="text-xs text-accent-green hover:underline">
          View all
        </Link>
      </div>
      {top3.length === 0 ? (
        <p className="py-4 text-sm text-muted">
          Nothing on the list. Add a task and get moving.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {top3.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <Checkbox checked={false} onChange={() => toggleTaskComplete(t.id)} />
              <span className="flex-1 text-sm text-body">{t.title}</span>
              {isOverdue(t) && (
                <span className="text-xs font-semibold text-danger">OVERDUE</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function QuoteRotator() {
  const [quote, setQuote] = useState(getCurrentQuote());

  useEffect(() => {
    const id = setInterval(() => setQuote(getCurrentQuote()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        Right now
      </div>
      <p className="text-sm italic leading-relaxed text-zinc-300">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}

export function HabitStatusRow() {
  const habits = useFlowStore((s) => s.habits);
  const toggleHabitToday = useFlowStore((s) => s.toggleHabitToday);
  const ensureDefaultHabits = useFlowStore((s) => s.ensureDefaultHabits);
  const today = todayKey();

  useEffect(() => {
    ensureDefaultHabits();
  }, [ensureDefaultHabits]);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">
          Habits today
        </div>
        <Link href="/habits" className="text-xs text-accent-green hover:underline">
          View all
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {habits.map((h) => {
          const done = h.completions.includes(today);
          return (
            <button
              key={h.id}
              onClick={() => toggleHabitToday(h.id)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              <span
                className={`h-2 w-2 rounded-full ${done ? "bg-accent-green" : "bg-danger"}`}
              />
              <span>{h.icon}</span>
              <span>{h.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
