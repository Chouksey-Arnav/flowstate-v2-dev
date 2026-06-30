"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Plus, PartyPopper } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { HabitRow } from "./HabitRow";
import { HabitForm } from "./HabitForm";
import { HabitWeekGrid } from "./HabitWeekGrid";
import { Button } from "@/components/ui";
import { todayKey, getWeekDays, dateKey } from "@/lib/utils";
import type { Habit } from "@/lib/types";

export function HabitList() {
  const habits = useFlowStore((s) => s.habits);
  const reorderHabits = useFlowStore((s) => s.reorderHabits);
  const ensureDefaultHabits = useFlowStore((s) => s.ensureDefaultHabits);
  const firstDayOfWeek = useFlowStore((s) => s.settings.firstDayOfWeek);

  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  ensureDefaultHabits();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const today = todayKey();
  const perfectDay = habits.length > 0 && habits.every((h) => h.completions.includes(today));

  const weekDays = getWeekDays(firstDayOfWeek).filter((d) => dateKey(d) <= today);
  const totalPossible = habits.length * weekDays.length;
  const totalDone = habits.reduce(
    (sum, h) => sum + weekDays.filter((d) => h.completions.includes(dateKey(d))).length,
    0
  );
  const weekPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = habits.map((h) => h.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    reorderHabits(arrayMove(ids, oldIndex, newIndex));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold text-heading">Habits</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingHabit(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> New habit
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-zinc-300">
          {weekPct}% this week
        </div>
        {perfectDay && (
          <div className="flex items-center gap-1.5 rounded-lg bg-accent-green/15 px-3 py-1.5 text-sm font-medium text-accent-green">
            <PartyPopper size={15} /> Perfect day
          </div>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted">
          No habits yet. Add the non-negotiables.
        </div>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
              <div className="mb-6 flex flex-col gap-2">
                {habits.map((h) => (
                  <HabitRow
                    key={h.id}
                    habit={h}
                    onEdit={(hab) => {
                      setEditingHabit(hab);
                      setFormOpen(true);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <HabitWeekGrid />
        </>
      )}

      <HabitForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingHabit(undefined);
        }}
        habit={editingHabit}
      />
    </div>
  );
}
