"use client";

import { Select, Input } from "@/components/ui";
import { TASK_CATEGORIES, PRIORITIES } from "@/lib/defaults";

export type StatusFilter = "active" | "completed" | "archived" | "overdue" | "all";
export type SortKey = "dueDate" | "priority" | "createdAt" | "manual";

export interface TaskFilterState {
  category: string;
  priority: string;
  status: StatusFilter;
  sort: SortKey;
  search: string;
}

export function TaskFilters({
  value,
  onChange,
}: {
  value: TaskFilterState;
  onChange: (v: TaskFilterState) => void;
}) {
  function set<K extends keyof TaskFilterState>(key: K, v: TaskFilterState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Input
        placeholder="Search tasks..."
        value={value.search}
        onChange={(e) => set("search", e.target.value)}
        className="max-w-xs"
      />
      <Select
        value={value.status}
        onChange={(e) => set("status", e.target.value as StatusFilter)}
        className="w-auto"
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
        <option value="archived">Archived</option>
        <option value="all">All</option>
      </Select>
      <Select
        value={value.category}
        onChange={(e) => set("category", e.target.value)}
        className="w-auto"
      >
        <option value="all">All categories</option>
        {TASK_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Select
        value={value.priority}
        onChange={(e) => set("priority", e.target.value)}
        className="w-auto"
      >
        <option value="all">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>
      <Select
        value={value.sort}
        onChange={(e) => set("sort", e.target.value as SortKey)}
        className="w-auto"
      >
        <option value="manual">Manual order</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created date</option>
      </Select>
    </div>
  );
}
