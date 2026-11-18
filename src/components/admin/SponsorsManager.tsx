"use client";

import React, { useState } from "react";
import { Edit3, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { MediaAsset, Sponsor, SponsorTier } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";
import { ImageUploadField } from "./ImageUploadField";

const TIERS: SponsorTier[] = [
  "Title Partner",
  "Platinum Sponsor",
  "Gold Sponsor",
  "Knowledge Partner",
  "Technology Partner",
  "Exhibitor",
  "Media Partner",
];

const EMPTY_SPONSOR: Omit<Sponsor, "id"> = {
  name: "",
  tier: "Gold Sponsor",
  logoUrl: "/images/sponsor-1.svg",
  websiteUrl: "https://",
  description: "",
  order: 1,
};

export function SponsorsManager({
  sponsors,
  mediaLibrary,
  onRefresh,
  onMediaUploaded,
}: {
  sponsors: Sponsor[];
  mediaLibrary: MediaAsset[];
  onRefresh: () => Promise<void>;
  onMediaUploaded: (a: MediaAsset) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Sponsor, "id">>(EMPTY_SPONSOR);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_SPONSOR, order: sponsors.length + 1 });
    setOpen(true);
  };

  const openEdit = (sp: Sponsor) => {
    setEditingId(sp.id);
    setForm({
      name: sp.name,
      tier: sp.tier,
      logoUrl: sp.logoUrl,
      websiteUrl: sp.websiteUrl,
      description: sp.description,
      order: sp.order,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `/api/collection/sponsors/${editingId}`
        : "/api/collection/sponsors";
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
    if (!confirm("Delete this sponsor/partner?")) return;
    await fetch(`/api/collection/sponsors/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Sponsors & Exhibitors</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Upload partner logos and group them across sponsorship tiers.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Sponsor / Partner
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sp) => (
          <div key={sp.id} className="glass-panel rounded-3xl p-4 space-y-3">
            <div className="flex h-16 items-center justify-center rounded-2xl bg-slate-950/40 p-2 border border-white/10">
              <img
                src={sp.logoUrl || "/images/sponsor-1.svg"}
                alt={sp.name}
                className="max-h-12 max-w-full object-contain"
              />
            </div>
            <div>
              <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400">
                {sp.tier}
              </span>
              <h3 className="mt-1 font-display text-base font-bold">{sp.name}</h3>
              <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {sp.description}
              </p>
            </div>
            <div className="flex justify-end gap-1.5 border-t pt-2.5" style={{ borderColor: "var(--glass-border)" }}>
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
        ))}
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Sponsor / Partner" : "Add Sponsor / Partner"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploadField
            label="Partner Logo"
            value={form.logoUrl}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            mediaLibrary={mediaLibrary}
            onMediaUploaded={onMediaUploaded}
            folder="sponsors"
          />
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Organization Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Sponsorship Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value as SponsorTier })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Website URL</label>
              <input
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
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
              <label className="mb-1 block text-xs font-semibold">Short Description</label>
              <textarea
                rows={2}
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
              Save Partner
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
