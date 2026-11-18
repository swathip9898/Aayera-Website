"use client";

import React, { useState } from "react";
import { Clock, Edit3, Loader2, MapPin, Plus, Save, Trash2 } from "lucide-react";
import type { Session } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";

const EMPTY_SESSION: Omit<Session, "id"> = {
  day: "Day 1",
  dateLabel: "March 18, 2027",
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  title: "",
  description: "",
  track: "Main Stage",
  sessionType: "Keynote",
  hall: "Grand Meridian Arena",
  speakers: [],
  order: 1,
};

export function AgendaManager({
  sessions,
  onRefresh,
}: {
  sessions: Session[];
  onRefresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Session, "id">>(EMPTY_SESSION);
  const [speakersInput, setSpeakersInput] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_SESSION, order: sessions.length + 1 });
    setSpeakersInput("");
    setOpen(true);
  };

  const openEdit = (s: Session) => {
    setEditingId(s.id);
    setForm({
      day: s.day,
      dateLabel: s.dateLabel,
      startTime: s.startTime,
      endTime: s.endTime,
      title: s.title,
      description: s.description,
      track: s.track,
      sessionType: s.sessionType,
      hall: s.hall,
      speakers: s.speakers,
      order: s.order,
    });
    setSpeakersInput(s.speakers.join(", "));
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        speakers: speakersInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const url = editingId
        ? `/api/collection/sessions/${editingId}`
        : "/api/collection/sessions";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setOpen(false);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agenda session?")) return;
    await fetch(`/api/collection/sessions/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Agenda & Schedule</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Build and update multi-day conference tracks, time slots, halls, and assigned speakers.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Session
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 font-bold text-cyan-400">
                  {s.day}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  {s.startTime} – {s.endTime}
                </span>
                <span className="glass-subtle rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                  {s.sessionType}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  {s.hall}
                </span>
              </div>
              <div className="font-display text-base font-bold">{s.title}</div>
              {s.speakers.length > 0 && (
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Speakers: {s.speakers.join(", ")}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openEdit(s)}
                className="glass-subtle rounded-lg p-2 hover:text-cyan-400 cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                className="glass-subtle rounded-lg p-2 hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Agenda Session" : "Add Agenda Session"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Day *</label>
              <input
                required
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                placeholder="Day 1"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Date Label</label>
              <input
                value={form.dateLabel}
                onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                placeholder="March 18, 2027"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Start Time *</label>
              <input
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                placeholder="10:00 AM"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">End Time *</label>
              <input
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                placeholder="11:00 AM"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Session Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Track</label>
              <input
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Session Type</label>
              <select
                value={form.sessionType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sessionType: e.target.value as Session["sessionType"],
                  })
                }
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="Keynote">Keynote</option>
                <option value="Panel">Panel</option>
                <option value="Fireside Chat">Fireside Chat</option>
                <option value="Workshop">Workshop</option>
                <option value="Networking">Networking</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Hall / Room</label>
              <input
                value={form.hall}
                onChange={(e) => setForm({ ...form, hall: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 1 })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">
                Speakers (comma separated)
              </label>
              <input
                value={speakersInput}
                onChange={(e) => setSpeakersInput(e.target.value)}
                placeholder="Dr. Ananya Deshmukh, Vikramaditya Rao"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="glass-subtle rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-aurora inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Session
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
