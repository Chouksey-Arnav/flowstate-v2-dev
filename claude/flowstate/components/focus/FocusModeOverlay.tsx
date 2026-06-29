"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { usePomodoroEngine } from "@/lib/usePomodoroEngine";
import { useFlowStore } from "@/lib/store";
import { useTimerStore } from "@/lib/timerStore";

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function FocusModeOverlay({ onExit }: { onExit: () => void }) {
  const { phase, secondsLeft, sessionCount } = usePomodoroEngine();
  const taskId = useTimerStore((s) => s.taskId);
  const task = useFlowStore((s) => s.tasks.find((t) => t.id === taskId));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onExit();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onExit]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303]"
    >
      <button
        onClick={onExit}
        className="absolute right-6 top-6 rounded-md p-2 text-zinc-600 hover:text-zinc-300"
        aria-label="Exit focus mode"
      >
        <X size={22} />
      </button>

      <div className="text-xs font-medium uppercase tracking-widest text-zinc-600">
        {phase === "work" ? `Session ${sessionCount + 1} of 4` : "Break"}
      </div>

      <div className="mt-4 font-mono text-8xl font-bold text-zinc-100 md:text-9xl">
        {formatTime(secondsLeft)}
      </div>

      {task && (
        <div className="mt-6 max-w-md text-center text-lg text-zinc-400">{task.title}</div>
      )}

      <p className="absolute bottom-8 text-xs text-zinc-700">Press ESC to exit</p>
    </motion.div>,
    document.body
  );
}
