"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { Checkbox } from "@/components/ui";
import type { Task } from "@/lib/types";

export function SubTaskList({ task }: { task: Task }) {
  const toggleSubtask = useFlowStore((s) => s.toggleSubtask);
  const deleteSubtask = useFlowStore((s) => s.deleteSubtask);
  const addSubtask = useFlowStore((s) => s.addSubtask);
  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addSubtask(task.id, newTitle.trim());
    setNewTitle("");
  }

  return (
    <div className="ml-8 mt-2 flex flex-col gap-1.5 border-l border-border pl-4">
      {task.subtasks.map((s) => (
        <div key={s.id} className="group flex items-center gap-2">
          <Checkbox checked={s.completed} onChange={() => toggleSubtask(task.id, s.id)} />
          <span
            className={`flex-1 text-sm ${
              s.completed ? "text-muted line-through" : "text-zinc-300"
            }`}
          >
            {s.title}
          </span>
          <button
            onClick={() => deleteSubtask(task.id, s.id)}
            className="text-muted opacity-0 hover:text-danger group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <Plus size={14} className="text-muted" />
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add subtask..."
          className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-muted focus:outline-none"
        />
      </form>
    </div>
  );
}
