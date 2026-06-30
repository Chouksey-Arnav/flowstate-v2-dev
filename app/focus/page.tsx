"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/useHydrated";
import { VideoGrid } from "@/components/focus/VideoGrid";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { AmbientSounds } from "@/components/focus/AmbientSounds";
import { FocusModeOverlay } from "@/components/focus/FocusModeOverlay";

export default function FocusPage() {
  const hydrated = useHydrated();
  const [focusMode, setFocusMode] = useState(false);

  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-surface" />;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold text-heading">Focus</h1>

      <VideoGrid />

      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <PomodoroTimer onEnterFocusMode={() => setFocusMode(true)} />
        <AmbientSounds />
      </div>

      {focusMode && <FocusModeOverlay onExit={() => setFocusMode(false)} />}
    </div>
  );
}
