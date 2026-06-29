export type TaskCategory =
  | "Business"
  | "CAC/Projects"
  | "Learning"
  | "Personal"
  | "Other";

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "active" | "completed" | "archived";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // ISO date string
  estimatedMinutes?: number;
  subtasks: SubTask[];
  tags: string[];
  order: number;
  createdAt: string;
  completedAt?: string;
}

export type HabitCategory = "Health" | "Business" | "Learning" | "Mental" | "Misc";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  completions: string[]; // ISO date strings, date-only (yyyy-MM-dd)
  order: number;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  durationMinutes: number;
  type: "pomodoro" | "custom";
  startedAt: string;
  endedAt: string;
}

export type AmbientSound = "none" | "white" | "brown";
export type TimerSound = "bell" | "digital" | "silent";

export interface Settings {
  name: string;
  dailyGoal: string;
  dailyGoalDate: string; // yyyy-MM-dd the goal was set for
  pomodoroWork: number;
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  autoStartNext: boolean;
  timerSound: TimerSound;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  ambientSound: AmbientSound;
  firstDayOfWeek: "sunday" | "monday";
}
