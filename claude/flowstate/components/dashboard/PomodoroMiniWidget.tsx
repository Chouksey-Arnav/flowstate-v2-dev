"use client";

import Link from "next/link";
import { Play, Pause, ExternalLink } from "lucide-react";
import { useTimerStore } from "@/lib/timerStore";
import { usePomodoroEngine } from "@/lib/usePomodoroEngine";
import { useFlowStore } from "@/lib/store";
import { Button } from "@/components/ui";

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function PomodoroMiniWidget() {
  const { phase, secondsLeft, isRunning } = usePomodoroEngine();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const pomodoroWork = useFlowStore((s) => s.settings.pomodoroWork);

  function toggle() {
    if (isRunning) {
      pause();
    } else if (secondsLeft === 0 || secondsLeft === pomodoroWork * 60) {
      start(pomodoroWork * 60);
    } else {
      resume();
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted">
          {phase === "work" ? "Focus session" : "Break"}
        </div>
        <div className="font-mono text-3xl font-bold text-heading">
          {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={toggle} aria-label={isRunning ? "Pause" : "Start"}>
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <Link href="/focus">
          <Button size="sm" variant="ghost" aria-label="Open focus mode">
            <ExternalLink size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
