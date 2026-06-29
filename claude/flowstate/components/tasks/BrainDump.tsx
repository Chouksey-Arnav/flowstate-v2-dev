"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { Input } from "@/components/ui";

export function BrainDump({ active }: { active: boolean }) {
  const addTask = useFlowStore((s) => s.addTask);
  const [value, setValue] = useState("");

  if (!active) return null;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      addTask({ title: value.trim(), category: "Other", priority: "MEDIUM" });
      setValue("");
    }
  }

  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-accent-green/40 bg-accent-green/5 px-4 py-3">
      <Zap size={16} className="text-accent-green" />
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a task, hit Enter, repeat. No mouse needed."
        className="border-none bg-transparent px-0 focus:border-none"
      />
    </div>
  );
}
