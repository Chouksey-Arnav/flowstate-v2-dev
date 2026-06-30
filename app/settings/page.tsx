"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/useHydrated";
import { useFlowStore } from "@/lib/store";
import { Button, Input, Select } from "@/components/ui";
import { Download, Trash2, RotateCcw, AlertTriangle } from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-muted">
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className="sm:w-56">{children}</div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      aria-label={label}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-accent-green" : "bg-zinc-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ConfirmButton({
  onConfirm,
  label,
  confirmLabel,
  variant = "danger",
}: {
  onConfirm: () => void;
  label: string;
  confirmLabel: string;
  variant?: "danger" | "ghost";
}) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <div className="flex items-center gap-2">
      <span className="text-xs text-danger">{confirmLabel}</span>
      <Button size="sm" variant="danger" onClick={() => { onConfirm(); setConfirming(false); }}>
        Yes, do it
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  ) : (
    <Button size="sm" variant={variant} onClick={() => setConfirming(true)}>
      {label}
    </Button>
  );
}

export default function SettingsPage() {
  const hydrated = useHydrated();
  const settings = useFlowStore((s) => s.settings);
  const updateSettings = useFlowStore((s) => s.updateSettings);
  const exportData = useFlowStore((s) => s.exportData);
  const clearCompletedTasks = useFlowStore((s) => s.clearCompletedTasks);
  const resetHabits = useFlowStore((s) => s.resetHabits);
  const resetEverything = useFlowStore((s) => s.resetEverything);

  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flowstate-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-semibold text-heading">Settings</h1>

      <div className="flex flex-col gap-8">
        {/* PROFILE */}
        <section>
          <SectionTitle>Profile</SectionTitle>
          <div className="flex flex-col gap-4">
            <Row label="Your name (used in greeting)">
              <Input
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
                placeholder="e.g. Alex"
              />
            </Row>
          </div>
        </section>

        {/* POMODORO */}
        <section>
          <SectionTitle>Focus / Pomodoro</SectionTitle>
          <div className="flex flex-col gap-4">
            <Row label="Work duration (minutes)">
              <Input
                type="number"
                min={1}
                max={120}
                value={settings.pomodoroWork}
                onChange={(e) => updateSettings({ pomodoroWork: Number(e.target.value) })}
              />
            </Row>
            <Row label="Short break (minutes)">
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.pomodoroBreak}
                onChange={(e) => updateSettings({ pomodoroBreak: Number(e.target.value) })}
              />
            </Row>
            <Row label="Long break (minutes)">
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.pomodoroLongBreak}
                onChange={(e) => updateSettings({ pomodoroLongBreak: Number(e.target.value) })}
              />
            </Row>
            <Row label="Auto-start next session">
              <Toggle
                value={settings.autoStartNext}
                onChange={(v) => updateSettings({ autoStartNext: v })}
                label="Auto-start next session"
              />
            </Row>
            <Row label="Timer completion sound">
              <Select
                value={settings.timerSound}
                onChange={(e) =>
                  updateSettings({
                    timerSound: e.target.value as typeof settings.timerSound,
                  })
                }
              >
                <option value="bell">Bell</option>
                <option value="digital">Digital beep</option>
                <option value="silent">Silent</option>
              </Select>
            </Row>
          </div>
        </section>

        {/* APP BEHAVIOR */}
        <section>
          <SectionTitle>App behavior</SectionTitle>
          <div className="flex flex-col gap-4">
            <Row label="Confetti on task completion">
              <Toggle
                value={settings.confettiEnabled}
                onChange={(v) => updateSettings({ confettiEnabled: v })}
                label="Confetti on task completion"
              />
            </Row>
            <Row label="Sound effects">
              <Toggle
                value={settings.soundEnabled}
                onChange={(v) => updateSettings({ soundEnabled: v })}
                label="Sound effects"
              />
            </Row>
            <Row label="First day of week">
              <Select
                value={settings.firstDayOfWeek}
                onChange={(e) =>
                  updateSettings({
                    firstDayOfWeek: e.target.value as "monday" | "sunday",
                  })
                }
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </Select>
            </Row>
            <Row label="Ambient sound in focus mode">
              <Select
                value={settings.ambientSound}
                onChange={(e) =>
                  updateSettings({
                    ambientSound: e.target.value as typeof settings.ambientSound,
                  })
                }
              >
                <option value="none">None</option>
                <option value="white">White Noise</option>
                <option value="brown">Brown Noise</option>
              </Select>
            </Row>
          </div>
        </section>

        {/* DATA */}
        <section>
          <SectionTitle>Data</SectionTitle>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleExport}>
                <Download size={15} /> Export all data as JSON
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <ConfirmButton
                label="Clear completed tasks"
                confirmLabel="Delete all completed tasks?"
                onConfirm={clearCompletedTasks}
                variant="ghost"
              />
              <ConfirmButton
                label="Reset all habits"
                confirmLabel="Delete all habits and streaks?"
                onConfirm={resetHabits}
                variant="ghost"
              />
            </div>
            <div className="mt-2 rounded-xl border border-danger/30 bg-danger/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
                <AlertTriangle size={16} /> Nuclear option
              </div>
              <p className="mb-3 text-xs text-zinc-400">
                Deletes everything. Tasks, habits, sessions, settings. Gone. No undo.
              </p>
              <ConfirmButton
                label="Reset everything"
                confirmLabel="Are you absolutely sure? This cannot be undone."
                onConfirm={resetEverything}
                variant="danger"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
