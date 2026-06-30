"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------- Button ----------
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent-green text-black hover:bg-accent-green/90",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/5",
    danger: "bg-danger/15 text-danger hover:bg-danger/25",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- Modal ----------
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-heading">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-white/5 hover:text-heading"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ---------- Input ----------
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-zinc-950 px-3 py-2 text-sm text-body placeholder:text-muted focus:border-accent-green focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

// ---------- Textarea ----------
export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-border bg-zinc-950 px-3 py-2 text-sm text-body placeholder:text-muted focus:border-accent-green focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

// ---------- Select ----------
export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-border bg-zinc-950 px-3 py-2 text-sm text-body focus:border-accent-green focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// ---------- Checkbox ----------
export function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors",
        checked ? "border-accent-green bg-accent-green" : "border-zinc-600 bg-transparent",
        className
      )}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-black" fill="none">
          <path
            d="M3 8.5L6 11.5L13 4.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

// ---------- Badge ----------
type BadgeColor = "green" | "blue" | "red" | "yellow" | "zinc";

export function Badge({
  color = "zinc",
  className,
  children,
}: {
  color?: BadgeColor;
  className?: string;
  children: React.ReactNode;
}) {
  const colors: Record<BadgeColor, string> = {
    green: "bg-accent-green/15 text-accent-green",
    blue: "bg-accent-blue/15 text-accent-blue",
    red: "bg-danger/15 text-danger",
    yellow: "bg-warning/15 text-warning",
    zinc: "bg-zinc-800 text-zinc-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
