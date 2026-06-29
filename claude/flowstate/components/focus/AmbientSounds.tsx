"use client";

import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useFlowStore } from "@/lib/store";
import { startAmbientNoise, stopAmbientNoise } from "@/lib/noise";
import { cn } from "@/lib/utils";
import type { AmbientSound } from "@/lib/types";

const OPTIONS: { value: AmbientSound; label: string }[] = [
  { value: "none", label: "None" },
  { value: "white", label: "White Noise" },
  { value: "brown", label: "Brown Noise" },
];

export function AmbientSounds() {
  const ambientSound = useFlowStore((s) => s.settings.ambientSound);
  const updateSettings = useFlowStore((s) => s.updateSettings);

  useEffect(() => {
    if (ambientSound === "none") {
      stopAmbientNoise();
    } else {
      startAmbientNoise(ambientSound);
    }
    return () => stopAmbientNoise();
  }, [ambientSound]);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
        {ambientSound === "none" ? <VolumeX size={14} /> : <Volume2 size={14} />}
        Ambient sound
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateSettings({ ambientSound: opt.value })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              ambientSound === opt.value
                ? "bg-accent-green/15 text-accent-green"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
