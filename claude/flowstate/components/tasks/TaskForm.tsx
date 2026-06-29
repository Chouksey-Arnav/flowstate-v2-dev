"use client";

import { useState } from "react";
import { useFlowStore } from "@/lib/store";
import { Modal, Input, Textarea, Select, Button } from "@/components/ui";
import { TASK_CATEGORIES, PRIORITIES } from "@/lib/defaults";
import type { Task, TaskCategory, TaskPriority } from "@/lib/types";

export function TaskForm({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task?: Task;
}) {
  const addTask = useFlowStore((s) => s.addTask);
  const updateTask = useFlowStore((s) => s.updateTask);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? "Business");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    task?.estimatedMinutes?.toString() ?? ""
  );
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");

  function reset() {
    setTitle("");
    setDescription("");
    setCategory("Business");
    setPriority("MEDIUM");
    setDueDate("");
    setEstimatedMinutes("");
    setTags("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (task) {
      updateTask(task.id, payload);
    } else {
      addTask(payload);
      reset();
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? "Edit task" : "New task"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          autoFocus
          placeholder="What needs to get done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Input
            type="number"
            min={0}
            placeholder="Est. minutes"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
          />
        </div>
        <Input
          placeholder="Tags, comma separated (e.g. CivicLens, cold-call)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {task ? "Save changes" : "Add task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
