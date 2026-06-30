"use client";

import { useState } from "react";
import { useFlowStore } from "@/lib/store";
import { Modal, Input, Select, Button } from "@/components/ui";
import { HABIT_CATEGORIES } from "@/lib/defaults";
import type { Habit, HabitCategory } from "@/lib/types";

const EMOJI_SUGGESTIONS = ["✅", "💻", "📞", "🏃", "📖", "🧠", "💧", "🧘", "🚫", "🔥"];

export function HabitForm({
  open,
  onClose,
  habit,
}: {
  open: boolean;
  onClose: () => void;
  habit?: Habit;
}) {
  const addHabit = useFlowStore((s) => s.addHabit);
  const updateHabit = useFlowStore((s) => s.updateHabit);

  const [name, setName] = useState(habit?.name ?? "");
  const [icon, setIcon] = useState(habit?.icon ?? "✅");
  const [category, setCategory] = useState<HabitCategory>(habit?.category ?? "Misc");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (habit) {
      updateHabit(habit.id, { name: name.trim(), icon, category });
    } else {
      addHabit({ name: name.trim(), icon, category });
      setName("");
      setIcon("✅");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={habit ? "Edit habit" : "New habit"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          autoFocus
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <div className="mb-1.5 text-xs text-muted">Icon</div>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setIcon(e)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${
                  icon === e ? "bg-accent-green/20 ring-1 ring-accent-green" : "bg-zinc-800"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value as HabitCategory)}>
          {HABIT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {habit ? "Save changes" : "Add habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
