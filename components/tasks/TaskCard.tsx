"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { GripVertical, ChevronDown, Pencil, Trash2, Archive } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { Checkbox, Badge } from "@/components/ui";
import { SubTaskList } from "./SubTaskList";
import { formatDueDate, isOverdue } from "@/lib/utils";
import type { Task } from "@/lib/types";

const PRIORITY_COLOR: Record<Task["priority"], "red" | "yellow" | "green"> = {
  HIGH: "red",
  MEDIUM: "yellow",
  LOW: "green",
};

export function TaskCard({ task, onEdit }: { task: Task; onEdit: (t: Task) => void }) {
  const toggleTaskComplete = useFlowStore((s) => s.toggleTaskComplete);
  const deleteTask = useFlowStore((s) => s.deleteTask);
  const archiveTask = useFlowStore((s) => s.archiveTask);
  const confettiEnabled = useFlowStore((s) => s.settings.confettiEnabled);
  const soundEnabled = useFlowStore((s) => s.settings.soundEnabled);
  const [expanded, setExpanded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completed = task.status === "completed";
  const overdue = isOverdue(task);
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length;

  function handleToggle(e?: React.MouseEvent<HTMLButtonElement>) {
    const willComplete = !completed;
    if (willComplete && confettiEnabled && e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 55,
        startVelocity: 28,
        origin: {
          x: (rect.left + 12) / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ["#22C55E", "#3B82F6", "#FAFAFA"],
      });
    }
    if (willComplete && soundEnabled) {
      try {
        const ctx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // ignore audio errors (e.g. autoplay restrictions)
      }
    }
    toggleTaskComplete(task.id);
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-muted hover:text-zinc-300 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        <div className="mt-1">
          <Checkbox checked={completed} onChange={handleToggle} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-medium ${
                completed ? "text-muted line-through" : "text-heading"
              }`}
            >
              {task.title}
            </span>
            <Badge color={PRIORITY_COLOR[task.priority]}>{task.priority}</Badge>
            <Badge>{task.category}</Badge>
            {overdue && <Badge color="red">OVERDUE</Badge>}
            {task.dueDate && !overdue && (
              <span className="text-xs text-muted">{formatDueDate(task.dueDate)}</span>
            )}
            {task.estimatedMinutes && (
              <span className="text-xs text-muted">{task.estimatedMinutes}m</span>
            )}
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-zinc-400">{task.description}</p>
          )}

          {task.tags.length > 0 && (
            <div className="mt-1.5 flex gap-1.5">
              {task.tags.map((t) => (
                <span key={t} className="text-xs text-accent-blue">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {task.subtasks.length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-zinc-300"
            >
              <ChevronDown
                size={14}
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
              {doneSubtasks}/{task.subtasks.length} subtasks
            </button>
          )}

          <AnimatePresence>
            {(expanded || task.subtasks.length === 0) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <SubTaskList task={task} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1.5 text-muted hover:bg-white/5 hover:text-zinc-200"
            aria-label="Edit task"
          >
            <Pencil size={15} />
          </button>
          {completed && (
            <button
              onClick={() => archiveTask(task.id)}
              className="rounded-md p-1.5 text-muted hover:bg-white/5 hover:text-zinc-200"
              aria-label="Archive task"
            >
              <Archive size={15} />
            </button>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
