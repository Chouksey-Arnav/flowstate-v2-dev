"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Flame } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { Checkbox, Badge } from "@/components/ui";
import { calculateHabitStreak, todayKey } from "@/lib/utils";
import type { Habit } from "@/lib/types";

function flameSize(streak: number) {
  if (streak >= 30) return 26;
  if (streak >= 14) return 22;
  if (streak >= 7) return 19;
  if (streak >= 1) return 16;
  return 14;
}

export function HabitRow({ habit, onEdit }: { habit: Habit; onEdit: (h: Habit) => void }) {
  const toggleHabitToday = useFlowStore((s) => s.toggleHabitToday);
  const deleteHabit = useFlowStore((s) => s.deleteHabit);
  const { current, longest } = calculateHabitStreak(habit);
  const done = habit.completions.includes(todayKey());

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted hover:text-zinc-300 active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>
      <Checkbox checked={done} onChange={() => toggleHabitToday(habit.id)} />
      <span className="text-lg">{habit.icon}</span>
      <span className="flex-1 text-sm font-medium text-heading">{habit.name}</span>
      <Badge>{habit.category}</Badge>
      <div className="flex items-center gap-1 text-accent-green" title={`Best: ${longest} days`}>
        <Flame size={flameSize(current)} className={current > 0 ? "fill-accent-green" : ""} />
        <span className="font-mono text-sm">{current}</span>
      </div>
      <button
        onClick={() => onEdit(habit)}
        className="rounded-md p-1.5 text-muted hover:bg-white/5 hover:text-zinc-200"
        aria-label="Edit habit"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={() => deleteHabit(habit.id)}
        className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
        aria-label="Delete habit"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
