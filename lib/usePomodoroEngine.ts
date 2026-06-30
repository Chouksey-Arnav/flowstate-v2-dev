"use client";

import { useEffect, useRef } from "react";
import { useTimerStore } from "./timerStore";
import { useFlowStore } from "./store";
import { playTimerSound } from "./noise";

export function usePomodoroEngine() {
  const {
    phase,
    secondsLeft,
    isRunning,
    sessionCount,
    taskId,
    startedAt,
    tick,
    setPhase,
    incrementSessionCount,
  } = useTimerStore();

  const settings = useFlowStore((s) => s.settings);
  const logFocusSession = useFlowStore((s) => s.logFocusSession);
  const prevSecondsRef = useRef(secondsLeft);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  // Handle phase completion (secondsLeft hit 0 while running)
  useEffect(() => {
    if (secondsLeft === 0 && prevSecondsRef.current > 0) {
      if (settings.soundEnabled && settings.timerSound !== "silent") {
        playTimerSound(settings.timerSound);
      }

      if (phase === "work") {
        if (startedAt) {
          logFocusSession({
            taskId,
            durationMinutes: settings.pomodoroWork,
            type: "pomodoro",
            startedAt,
            endedAt: new Date().toISOString(),
          });
        }
        incrementSessionCount();
        const nextCount = sessionCount + 1;
        const isLong = nextCount % 4 === 0;
        const nextPhase = isLong ? "longBreak" : "break";
        const nextDuration =
          (isLong ? settings.pomodoroLongBreak : settings.pomodoroBreak) * 60;
        setPhase(nextPhase, nextDuration);
        if (settings.autoStartNext) {
          setTimeout(() => useTimerStore.getState().start(), 300);
        }
      } else {
        setPhase("work", settings.pomodoroWork * 60);
        if (settings.autoStartNext) {
          setTimeout(() => useTimerStore.getState().start(), 300);
        }
      }
    }
    prevSecondsRef.current = secondsLeft;
  }, [
    secondsLeft,
    phase,
    settings,
    startedAt,
    taskId,
    sessionCount,
    logFocusSession,
    incrementSessionCount,
    setPhase,
  ]);

  return { phase, secondsLeft, isRunning, sessionCount };
}
