"use client";

import { create } from "zustand";

export type SessionPhase = "work" | "break" | "longBreak";

interface TimerState {
  phase: SessionPhase;
  secondsLeft: number;
  isRunning: boolean;
  sessionCount: number; // completed work sessions today
  taskId?: string;
  startedAt?: string;

  start: (durationSeconds?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: (durationSeconds: number, phase?: SessionPhase) => void;
  tick: () => void;
  setTaskId: (id?: string) => void;
  setPhase: (phase: SessionPhase, durationSeconds: number) => void;
  incrementSessionCount: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  phase: "work",
  secondsLeft: 25 * 60,
  isRunning: false,
  sessionCount: 0,
  taskId: undefined,
  startedAt: undefined,

  start: (durationSeconds) => {
    set({
      isRunning: true,
      startedAt: new Date().toISOString(),
      secondsLeft: durationSeconds ?? get().secondsLeft,
    });
  },

  pause: () => set({ isRunning: false }),
  resume: () => set({ isRunning: true }),

  reset: (durationSeconds, phase) =>
    set({
      secondsLeft: durationSeconds,
      isRunning: false,
      phase: phase ?? get().phase,
      startedAt: undefined,
    }),

  tick: () => {
    const left = get().secondsLeft;
    if (left <= 0) {
      set({ isRunning: false });
      return;
    }
    set({ secondsLeft: left - 1 });
  },

  setTaskId: (id) => set({ taskId: id }),

  setPhase: (phase, durationSeconds) =>
    set({ phase, secondsLeft: durationSeconds, isRunning: false, startedAt: undefined }),

  incrementSessionCount: () => set({ sessionCount: get().sessionCount + 1 }),
}));
