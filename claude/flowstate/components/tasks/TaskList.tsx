"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Zap, CheckCheck, Trash2, Archive } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilters, type TaskFilterState } from "./TaskFilters";
import { BrainDump } from "./BrainDump";
import { Button } from "@/components/ui";
import { isOverdue, parseISO } from "@/lib/utils";
import type { Task } from "@/lib/types";

export function TaskList() {
  const tasks = useFlowStore((s) => s.tasks);
  const reorderTasks = useFlowStore((s) => s.reorderTasks);
  const completeAllActive = useFlowStore((s) => s.completeAllActive);
  const deleteAllCompleted = useFlowStore((s) => s.deleteAllCompleted);
  const archiveAllCompleted = useFlowStore((s) => s.archiveAllCompleted);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [brainDump, setBrainDump] = useState(false);
  const [filters, setFilters] = useState<TaskFilterState>({
    category: "all",
    priority: "all",
    status: "active",
    sort: "manual",
    search: "",
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => {
      if (filters.status === "active") return t.status === "active";
      if (filters.status === "completed") return t.status === "completed";
      if (filters.status === "archived") return t.status === "archived";
      if (filters.status === "overdue") return isOverdue(t);
      return true;
    });

    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    if (filters.priority !== "all") list = list.filter((t) => t.priority === filters.priority);
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (filters.sort === "dueDate") {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
      });
    } else if (filters.sort === "priority") {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (filters.sort === "createdAt") {
      sorted.sort(
        (a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
      );
    } else {
      sorted.sort((a, b) => a.order - b.order);
    }
    return sorted;
  }, [tasks, filters]);

  const totalEstimate = filtered
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = filtered.map((t) => t.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    reorderTasks(arrayMove(ids, oldIndex, newIndex));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold text-heading">Tasks</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setBrainDump((b) => !b)}>
            <Zap size={16} /> Brain dump
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingTask(undefined);
              setFormOpen(true);
            }}
          >
            <Plus size={16} /> New task
          </Button>
        </div>
      </div>

      <BrainDump active={brainDump} />
      <TaskFilters value={filters} onChange={setFilters} />

      {totalEstimate > 0 && (
        <p className="mb-3 text-xs text-muted">
          {Math.round((totalEstimate / 60) * 10) / 10}h estimated for active tasks shown
        </p>
      )}

      {filters.status === "completed" && filtered.length > 0 && (
        <div className="mb-3 flex gap-2">
          <Button size="sm" variant="ghost" onClick={archiveAllCompleted}>
            <Archive size={14} /> Move to archive
          </Button>
          <Button size="sm" variant="danger" onClick={deleteAllCompleted}>
            <Trash2 size={14} /> Delete completed
          </Button>
        </div>
      )}
      {filters.status === "active" && filtered.length > 0 && (
        <div className="mb-3">
          <Button size="sm" variant="ghost" onClick={completeAllActive}>
            <CheckCheck size={14} /> Complete all
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted">
          Nothing here. {filters.status === "active" ? "Add a task and get moving." : ""}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filtered.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setFormOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(undefined);
        }}
        task={editingTask}
      />
    </div>
  );
}
