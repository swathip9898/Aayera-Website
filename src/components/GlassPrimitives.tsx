"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} glass theme`}
      title={`Switch to ${theme === "dark" ? "Light Frosted" : "Dark Obsidian"} Glass`}
      className={`glass-subtle inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition hover:scale-105 cursor-pointer ${className}`}
      style={{ color: "var(--text-primary)" }}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 text-amber-300" />
          <span className="hidden sm:inline">Light Glass</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-600" />
          <span className="hidden sm:inline">Dark Glass</span>
        </>
      )}
    </button>
  );
}

export function GlassModal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-2xl",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{
            background: "var(--glass-backdrop-overlay)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`glass-panel-strong relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h3 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close translucent screen"
                className="glass-subtle rounded-full p-2 transition hover:scale-105 cursor-pointer"
                style={{ color: "var(--text-primary)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CountdownTimer({ targetIso }: { targetIso: string }) {
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetMs = new Date(targetIso).getTime();
    const tick = () => {
      const diff = Math.max(0, targetMs - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setParts({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const boxes = [
    { label: "Days", value: mounted ? String(parts.days).padStart(2, "0") : "--" },
    { label: "Hours", value: mounted ? String(parts.hours).padStart(2, "0") : "--" },
    { label: "Mins", value: mounted ? String(parts.minutes).padStart(2, "0") : "--" },
    { label: "Secs", value: mounted ? String(parts.seconds).padStart(2, "0") : "--" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {boxes.map((box) => (
        <div
          key={box.label}
          className="glass-subtle flex flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-center"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tabular-nums text-white drop-shadow">
            {box.value}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-cyan-200/80 font-semibold">
            {box.label}
          </span>
        </div>
      ))}
    </div>
  );
}
