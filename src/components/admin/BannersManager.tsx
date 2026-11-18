"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Plus, Save, Trash2, Edit3, Loader2 } from "lucide-react";
import type { Banner, MediaAsset } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";
import { ImageUploadField } from "./ImageUploadField";

const EMPTY_BANNER: Omit<Banner, "id"> = {
  title: "",
  subtitle: "",
  badge: "Flagship Edition",
  imageUrl: "/images/banner-1.svg",
  ctaPrimaryText: "Register Now",
  ctaPrimaryAction: "register",
  ctaPrimaryUrl: "",
  ctaSecondaryText: "Explore Agenda",
  ctaSecondaryAction: "agenda",
  ctaSecondaryUrl: "",
  overlayStyle: "aurora",
  order: 1,
  active: true,
};

export function BannersManager({
  banners,
  mediaLibrary,
  onRefresh,
  onMediaUploaded,
}: {
  banners: Banner[];
  mediaLibrary: MediaAsset[];
  onRefresh: () => Promise<void>;
  onMediaUploaded: (a: MediaAsset) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(EMPTY_BANNER);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_BANNER, order: banners.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge,
      imageUrl: b.imageUrl,
      ctaPrimaryText: b.ctaPrimaryText,
      ctaPrimaryAction: b.ctaPrimaryAction,
      ctaPrimaryUrl: b.ctaPrimaryUrl || "",
      ctaSecondaryText: b.ctaSecondaryText,
      ctaSecondaryAction: b.ctaSecondaryAction,
      ctaSecondaryUrl: b.ctaSecondaryUrl || "",
      overlayStyle: b.overlayStyle,
      order: b.order,
      active: b.active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `/api/collection/banners/${editingId}`
        : "/api/collection/banners";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save banner");
      setModalOpen(false);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/collection/banners/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !b.active }),
    });
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero banner?")) return;
    await fetch(`/api/collection/banners/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Hero Banners Manager</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Upload new banner images, change headlines, switch translucent overlay styles, and toggle slides live.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Banner
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {banners.map((b) => (
          <div key={b.id} className="glass-panel overflow-hidden rounded-3xl">
            <div className="relative h-48 overflow-hidden">
              <img
                src={b.imageUrl || "/images/banner-1.svg"}
                alt={b.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${
                    b.active
                      ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/40"
                      : "bg-slate-800/70 text-slate-300 border border-white/15"
                  }`}
                >
                  {b.active ? "Active Slide" : "Hidden"}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  Order #{b.order} • {b.overlayStyle}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="text-[11px] text-cyan-300 font-semibold truncate">
                  {b.badge}
                </div>
                <h3 className="font-display text-lg font-bold leading-snug line-clamp-1">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-200/80 line-clamp-2">{b.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="glass-subtle rounded-full px-2.5 py-1 font-semibold">
                  CTA 1: {b.ctaPrimaryText}
                </span>
                <span className="glass-subtle rounded-full px-2.5 py-1 font-semibold">
                  CTA 2: {b.ctaSecondaryText}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleActive(b)}
                  title={b.active ? "Hide banner" : "Activate banner"}
                  className="glass-subtle rounded-xl p-2 hover:text-cyan-400 cursor-pointer"
                >
                  {b.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(b)}
                  className="glass-subtle rounded-xl p-2 hover:text-cyan-400 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  className="glass-subtle rounded-xl p-2 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Hero Banner" : "Create Hero Banner"}
        subtitle="Changes publish immediately to the animated translucent hero carousel"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploadField
            label="Banner Background Image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            mediaLibrary={mediaLibrary}
            onMediaUploaded={onMediaUploaded}
            folder="banners"
          />

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Headline *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Subtitle</label>
              <textarea
                rows={2}
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Top Badge Text</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Glass Overlay Style</label>
              <select
                value={form.overlayStyle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    overlayStyle: e.target.value as Banner["overlayStyle"],
                  })
                }
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="aurora">Aurora Cyan-Indigo</option>
                <option value="prism">Prism Violet-Aqua</option>
                <option value="obsidian">Obsidian Deep Teal</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Primary CTA Label</label>
              <input
                value={form.ctaPrimaryText}
                onChange={(e) => setForm({ ...form, ctaPrimaryText: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Primary CTA Action</label>
              <select
                value={form.ctaPrimaryAction}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ctaPrimaryAction: e.target.value as Banner["ctaPrimaryAction"],
                  })
                }
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="register">Open Registration Modal</option>
                <option value="sponsor">Open Sponsor Inquiry</option>
                <option value="agenda">Scroll to Agenda</option>
                <option value="speakers">Scroll to Speakers</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Secondary CTA Label</label>
              <input
                value={form.ctaSecondaryText}
                onChange={(e) => setForm({ ...form, ctaSecondaryText: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Slide Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 1 })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="rounded accent-cyan-400"
            />
            Show this banner on the live website
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
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
              Save Banner
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
