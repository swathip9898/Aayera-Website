"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Mic2 } from "lucide-react";
import type { Session } from "@/types/summit";

const TYPE_STYLES: Record<string, string> = {
  Keynote: "bg-cyan-500/15 text-cyan-400 border-cyan-400/30",
  Panel: "bg-indigo-500/15 text-indigo-400 border-indigo-400/30",
  "Fireside Chat": "bg-violet-500/15 text-violet-400 border-violet-400/30",
  Workshop: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
  Networking: "bg-amber-500/15 text-amber-400 border-amber-400/30",
  Exhibition: "bg-rose-500/15 text-rose-400 border-rose-400/30",
};

export function AgendaSection({ sessions }: { sessions: Session[] }) {
  const days = useMemo(() => {
    const map = new Map<string, string>();
    sessions.forEach((s) => {
      if (!map.has(s.day)) map.set(s.day, s.dateLabel || "");
    });
    return Array.from(map.entries()).map(([day, dateLabel]) => ({ day, dateLabel }));
  }, [sessions]);

  const [activeDay, setActiveDay] = useState<string>(days[0]?.day || "Day 1");
  const [activeTrack, setActiveTrack] = useState<string>("All Tracks");

  const tracks = useMemo(() => {
    const set = new Set<string>(["All Tracks"]);
    sessions
      .filter((s) => s.day === activeDay)
      .forEach((s) => {
        if (s.track) set.add(s.track);
      });
    return Array.from(set);
  }, [sessions, activeDay]);

  const filtered = useMemo(() => {
    return sessions.filter(
      (s) =>
        s.day === activeDay && (activeTrack === "All Tracks" || s.track === activeTrack)
    );
  }, [sessions, activeDay, activeTrack]);

  return (
    <section id="agenda" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Conference Program
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive <span className="text-gradient-aurora">Multi-Day Agenda</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Explore executive keynotes, technical panels, 1-on-1 partnering blocks, and exhibition showcases.
          </p>
        </div>

        {/* Day Switcher Glass Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => {
                setActiveDay(d.day);
                setActiveTrack("All Tracks");
              }}
              className={`rounded-2xl px-6 py-3 text-left transition cursor-pointer ${
                activeDay === d.day
                  ? "btn-aurora text-white"
                  : "glass-panel hover:scale-105"
              }`}
            >
              <div className="font-display text-base font-bold">{d.day}</div>
              {d.dateLabel && (
                <div
                  className={`text-xs ${
                    activeDay === d.day ? "text-cyan-100" : "opacity-75"
                  }`}
                >
                  {d.dateLabel}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Track Filter Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {tracks.map((tr) => (
            <button
              key={tr}
              type="button"
              onClick={() => setActiveTrack(tr)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTrack === tr
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
                  : "glass-subtle hover:opacity-90"
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

        {/* Animated Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeDay}-${activeTrack}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-10 space-y-4"
          >
            {filtered.map((sess) => (
              <div
                key={sess.id}
                className="glass-panel rounded-3xl p-5 sm:p-6 transition hover:scale-[1.005]"
              >
                <div className="grid gap-4 md:grid-cols-12 md:items-center">
                  {/* Time & Hall */}
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/12 px-3 py-1 text-xs font-bold text-cyan-400">
                      <Clock className="h-3.5 w-3.5" />
                      {sess.startTime} – {sess.endTime}
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium pl-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      {sess.hall}
                    </div>
                  </div>

                  {/* Title & Details */}
                  <div className="md:col-span-9">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          TYPE_STYLES[sess.sessionType] || TYPE_STYLES.Keynote
                        }`}
                      >
                        {sess.sessionType}
                      </span>
                      <span className="glass-subtle rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                        {sess.track}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg sm:text-xl font-bold">
                      {sess.title}
                    </h3>
                    {sess.description && (
                      <p
                        className="mt-1.5 text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {sess.description}
                      </p>
                    )}
                    {sess.speakers && sess.speakers.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Mic2 className="h-3.5 w-3.5 text-indigo-400" />
                        {sess.speakers.map((sp) => (
                          <span
                            key={sp}
                            className="glass-subtle rounded-full px-3 py-1 text-xs font-semibold"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
