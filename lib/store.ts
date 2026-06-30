"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Task,
  Habit,
  FocusSession,
  Settings,
  SubTask,
  TaskCategory,
  TaskPriority,
} from "./types";
import { generateId, todayKey } from "./utils";
import { getDefaultHabits } from "./defaults";

interface FlowState {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  settings: Settings;
  hasSeededHabits: boolean;

  // Task actions
  addTask: (input: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate?: string;
    estimatedMinutes?: number;
    tags?: string[];
  }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  reorderTasks: (orderedIds: string[]) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  completeAllActive: () => void;
  deleteAllCompleted: () => void;
  archiveAllCompleted: () => void;

  // Habit actions
  addHabit: (input: { name: string; icon: string; category: Habit["category"] }) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;
  reorderHabits: (orderedIds: string[]) => void;
  ensureDefaultHabits: () => void;

  // Focus session actions
  logFocusSession: (session: Omit<FocusSession, "id">) => void;

  // Settings
  updateSettings: (patch: Partial<Settings>) => void;

  // Data management
  exportData: () => string;
  clearCompletedTasks: () => void;
  resetHabits: () => void;
  resetEverything: () => void;
}

const defaultSettings: Settings = {
  name: "",
  dailyGoal: "",
  dailyGoalDate: "",
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  autoStartNext: false,
  timerSound: "bell",
  soundEnabled: true,
  confettiEnabled: true,
  ambientSound: "none",
  firstDayOfWeek: "monday",
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      tasks: [],
      habits: [],
      focusSessions: [],
      settings: defaultSettings,
      hasSeededHabits: false,

      addTask: (input) => {
        const tasks = get().tasks;
        const newTask: Task = {
          id: generateId(),
          title: input.title,
          description: input.description,
          category: input.category,
          priority: input.priority,
          status: "active",
          dueDate: input.dueDate,
          estimatedMinutes: input.estimatedMinutes,
          subtasks: [],
          tags: input.tags ?? [],
          order: tasks.length,
          createdAt: new Date().toISOString(),
        };
        set({ tasks: [...tasks, newTask] });
      },

      updateTask: (id, patch) => {
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        });
      },

      toggleTaskComplete: (id) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== id) return t;
            const completing = t.status !== "completed";
            return {
              ...t,
              status: completing ? "completed" : "active",
              completedAt: completing ? new Date().toISOString() : undefined,
            };
          }),
        });
      },

      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      archiveTask: (id) => {
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, status: "archived" } : t)),
        });
      },

      reorderTasks: (orderedIds) => {
        const byId = new Map(get().tasks.map((t) => [t.id, t]));
        const reordered = orderedIds
          .map((id, idx) => {
            const t = byId.get(id);
            return t ? { ...t, order: idx } : null;
          })
          .filter((t): t is Task => t !== null);
        const rest = get().tasks.filter((t) => !orderedIds.includes(t.id));
        set({ tasks: [...reordered, ...rest] });
      },

      addSubtask: (taskId, title) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== taskId) return t;
            const sub: SubTask = { id: generateId(), title, completed: false };
            return { ...t, subtasks: [...t.subtasks, sub] };
          }),
        });
      },

      toggleSubtask: (taskId, subtaskId) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            };
          }),
        });
      },

      deleteSubtask: (taskId, subtaskId) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== taskId) return t;
            return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
          }),
        });
      },

      completeAllActive: () => {
        const now = new Date().toISOString();
        set({
          tasks: get().tasks.map((t) =>
            t.status === "active" ? { ...t, status: "completed", completedAt: now } : t
          ),
        });
      },

      deleteAllCompleted: () => {
        set({ tasks: get().tasks.filter((t) => t.status !== "completed") });
      },

      archiveAllCompleted: () => {
        set({
          tasks: get().tasks.map((t) =>
            t.status === "completed" ? { ...t, status: "archived" } : t
          ),
        });
      },

      addHabit: (input) => {
        const habits = get().habits;
        const newHabit: Habit = {
          id: generateId(),
          name: input.name,
          icon: input.icon || "✅",
          category: input.category,
          completions: [],
          order: habits.length,
          createdAt: new Date().toISOString(),
        };
        set({ habits: [...habits, newHabit] });
      },

      updateHabit: (id, patch) => {
        set({ habits: get().habits.map((h) => (h.id === id ? { ...h, ...patch } : h)) });
      },

      deleteHabit: (id) => {
        set({ habits: get().habits.filter((h) => h.id !== id) });
      },

      toggleHabitToday: (id) => {
        const today = todayKey();
        set({
          habits: get().habits.map((h) => {
            if (h.id !== id) return h;
            const has = h.completions.includes(today);
            return {
              ...h,
              completions: has
                ? h.completions.filter((d) => d !== today)
                : [...h.completions, today],
            };
          }),
        });
      },

      reorderHabits: (orderedIds) => {
        const byId = new Map(get().habits.map((h) => [h.id, h]));
        const reordered = orderedIds
          .map((id, idx) => {
            const h = byId.get(id);
            return h ? { ...h, order: idx } : null;
          })
          .filter((h): h is Habit => h !== null);
        set({ habits: reordered });
      },

      ensureDefaultHabits: () => {
        if (!get().hasSeededHabits && get().habits.length === 0) {
          set({ habits: getDefaultHabits(), hasSeededHabits: true });
        }
      },

      logFocusSession: (session) => {
        const newSession: FocusSession = { id: generateId(), ...session };
        set({ focusSessions: [...get().focusSessions, newSession] });
      },

      updateSettings: (patch) => {
        set({ settings: { ...get().settings, ...patch } });
      },

      exportData: () => {
        const { tasks, habits, focusSessions, settings } = get();
        return JSON.stringify({ tasks, habits, focusSessions, settings }, null, 2);
      },

      clearCompletedTasks: () => {
        set({ tasks: get().tasks.filter((t) => t.status !== "completed") });
      },

      resetHabits: () => {
        set({ habits: [] });
      },

      resetEverything: () => {
        set({
          tasks: [],
          habits: [],
          focusSessions: [],
          settings: defaultSettings,
          hasSeededHabits: false,
        });
      },
    }),
    {
      name: "flowstate-storage",
    }
  )
);
