"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ExternalLink, Search, Sparkles, UserCheck } from "lucide-react";
import type { Session, Speaker } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";

export function SpeakersSection({
  speakers,
  sessions,
  onApplySpeaker,
}: {
  speakers: Speaker[];
  sessions: Session[];
  onApplySpeaker: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    speakers.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [speakers]);

  const filtered = useMemo(() => {
    return speakers.filter((s) => {
      const catOk = selectedCategory === "All" || s.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [speakers, selectedCategory, query]);

  const activeSpeakerSessions = useMemo(() => {
    if (!activeSpeaker) return [];
    const nameLower = activeSpeaker.name.toLowerCase();
    return sessions.filter((sess) =>
      sess.speakers.some((sp) => sp.toLowerCase().includes(nameLower))
    );
  }, [activeSpeaker, sessions]);

  return (
    <section id="speakers" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Executive Faculty
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Visionary <span className="text-gradient-aurora">Speakers & Leaders</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Click any speaker card to open their translucent profile screen, executive bio, and summit sessions.
            </p>
          </div>
          <button
            type="button"
            onClick={onApplySpeaker}
            className="glass-panel inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-105 cursor-pointer"
          >
            <UserCheck className="h-4 w-4 text-cyan-400" />
            Nominate / Apply as Speaker
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "btn-aurora text-white"
                    : "glass-subtle hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search speaker or company..."
              className="glass-input w-full rounded-full py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((speaker, idx) => (
            <motion.button
              key={speaker.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.3) }}
              whileHover={{ y: -6 }}
              onClick={() => setActiveSpeaker(speaker)}
              className="glass-panel group relative overflow-hidden rounded-3xl p-5 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                  <img
                    src={speaker.photoUrl || "/images/speaker-1.svg"}
                    alt={speaker.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400">
                    {speaker.category}
                  </span>
                  <h3 className="mt-1 truncate font-display text-lg font-bold">
                    {speaker.name}
                  </h3>
                  <p className="truncate text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {speaker.role}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-semibold text-indigo-400">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {speaker.company}
                  </p>
                </div>
              </div>
              {speaker.bio && (
                <p
                  className="mt-4 line-clamp-2 text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {speaker.bio}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>View Translucent Profile</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-panel mt-8 rounded-3xl p-10 text-center">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No speakers match your filter yet.
            </p>
          </div>
        )}
      </div>

      {/* Translucent Speaker Detail Screen */}
      <GlassModal
        open={Boolean(activeSpeaker)}
        onClose={() => setActiveSpeaker(null)}
        title={activeSpeaker?.name}
        subtitle={
          activeSpeaker ? `${activeSpeaker.role} • ${activeSpeaker.company}` : undefined
        }
      >
        {activeSpeaker && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={activeSpeaker.photoUrl || "/images/speaker-1.svg"}
                alt={activeSpeaker.name}
                className="h-32 w-32 shrink-0 rounded-2xl object-cover border border-white/20 shadow-xl"
              />
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-400">
                  {activeSpeaker.category}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {activeSpeaker.bio || "Executive speaker participating at the summit."}
                </p>
                {activeSpeaker.linkedin && (
                  <a
                    href={activeSpeaker.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    Connect on LinkedIn
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            {activeSpeakerSessions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Speaking Sessions
                </h4>
                {activeSpeakerSessions.map((sess) => (
                  <div key={sess.id} className="glass-subtle rounded-2xl p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400 font-semibold">
                      <span>{sess.day}</span>
                      <span>•</span>
                      <span>
                        {sess.startTime} – {sess.endTime}
                      </span>
                      <span>•</span>
                      <span>{sess.hall}</span>
                    </div>
                    <p className="mt-1 font-display font-bold text-sm">{sess.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassModal>
    </section>
  );
}
