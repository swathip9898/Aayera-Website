"use client";

import React, { useState } from "react";
import { Edit3, Loader2, Plus, Save, Star, Trash2 } from "lucide-react";
import type { MediaAsset, Speaker } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";
import { ImageUploadField } from "./ImageUploadField";

const EMPTY_SPEAKER: Omit<Speaker, "id"> = {
  name: "",
  role: "",
  company: "",
  category: "Keynote",
  bio: "",
  photoUrl: "/images/speaker-1.svg",
  linkedin: "",
  featured: true,
  order: 1,
};

export function SpeakersManager({
  speakers,
  mediaLibrary,
  onRefresh,
  onMediaUploaded,
}: {
  speakers: Speaker[];
  mediaLibrary: MediaAsset[];
  onRefresh: () => Promise<void>;
  onMediaUploaded: (a: MediaAsset) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Speaker, "id">>(EMPTY_SPEAKER);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_SPEAKER, order: speakers.length + 1 });
    setOpen(true);
  };

  const openEdit = (sp: Speaker) => {
    setEditingId(sp.id);
    setForm({
      name: sp.name,
      role: sp.role,
      company: sp.company,
      category: sp.category,
      bio: sp.bio,
      photoUrl: sp.photoUrl,
      linkedin: sp.linkedin || "",
      featured: sp.featured,
      order: sp.order,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `/api/collection/speakers/${editingId}`
        : "/api/collection/speakers";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setOpen(false);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this speaker?")) return;
    await fetch(`/api/collection/speakers/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Speakers Directory</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage executive speakers, upload portraits, and organize categories.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Speaker
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {speakers.map((sp) => (
          <div key={sp.id} className="glass-panel flex flex-col justify-between rounded-3xl p-4">
            <div className="flex items-start gap-3.5">
              <img
                src={sp.photoUrl || "/images/speaker-1.svg"}
                alt={sp.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-white/15"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                    {sp.category}
                  </span>
                  {sp.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                </div>
                <h3 className="mt-1 truncate font-display text-base font-bold">{sp.name}</h3>
                <p className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                  {sp.role}
                </p>
                <p className="truncate text-xs font-semibold text-indigo-400">{sp.company}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--glass-border)" }}>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Order #{sp.order}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(sp)}
                  className="glass-subtle rounded-lg p-1.5 hover:text-cyan-400 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sp.id)}
                  className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Speaker" : "Add Speaker"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploadField
            label="Speaker Portrait Photo"
            value={form.photoUrl}
            onChange={(url) => setForm({ ...form, photoUrl: url })}
            mediaLibrary={mediaLibrary}
            onMediaUploaded={onMediaUploaded}
            folder="speakers"
          />
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Keynote / Panelist / Investor"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Job Title / Role *</label>
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Company *</label>
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">LinkedIn URL</label>
              <input
                value={form.linkedin || ""}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 1 })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Executive Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-cyan-400"
            />
            Featured Speaker
          </label>
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
              Save Speaker
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
