"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, SkipForward, Maximize2 } from "lucide-react";
import { useTimerStore } from "@/lib/timerStore";
import { usePomodoroEngine } from "@/lib/usePomodoroEngine";
import { useFlowStore } from "@/lib/store";
import { Button, Select } from "@/components/ui";

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PomodoroTimer({ onEnterFocusMode }: { onEnterFocusMode: () => void }) {
  const { phase, secondsLeft, isRunning, sessionCount } = usePomodoroEngine();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const reset = useTimerStore((s) => s.reset);
  const setPhase = useTimerStore((s) => s.setPhase);
  const setTaskId = useTimerStore((s) => s.setTaskId);
  const taskId = useTimerStore((s) => s.taskId);

  const settings = useFlowStore((s) => s.settings);
  const tasks = useFlowStore((s) => s.tasks.filter((t) => t.status === "active"));

  const durations: Record<string, number> = {
    work: settings.pomodoroWork * 60,
    break: settings.pomodoroBreak * 60,
    longBreak: settings.pomodoroLongBreak * 60,
  };
  const totalForPhase = durations[phase];
  const progress = totalForPhase > 0 ? secondsLeft / totalForPhase : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  function toggle() {
    if (isRunning) {
      pause();
    } else if (secondsLeft === 0) {
      setPhase("work", settings.pomodoroWork * 60);
      start(settings.pomodoroWork * 60);
    } else {
      resume();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8">
      <div className="text-xs font-medium uppercase tracking-wider text-muted">
        {phase === "work" ? `Pomodoro ${sessionCount + 1} of 4` : phase === "break" ? "Short break" : "Long break"}
      </div>

      <div className="relative h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={RADIUS} stroke="#27272A" strokeWidth="10" fill="none" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke={phase === "work" ? "#22C55E" : "#3B82F6"}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-5xl font-bold text-heading">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" variant="primary" onClick={toggle}>
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => reset(durations[phase])}
          aria-label="Reset timer"
        >
          <RotateCcw size={18} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const next = phase === "work" ? "break" : "work";
            setPhase(next, durations[next]);
          }}
          aria-label="Skip to next phase"
        >
          <SkipForward size={18} />
        </Button>
        <Button variant="ghost" onClick={onEnterFocusMode} aria-label="Enter full focus mode">
          <Maximize2 size={18} />
        </Button>
      </div>

      {phase === "work" && tasks.length > 0 && (
        <div className="w-full max-w-xs">
          <Select value={taskId ?? ""} onChange={(e) => setTaskId(e.target.value || undefined)}>
            <option value="">No task linked</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
