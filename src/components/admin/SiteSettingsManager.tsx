"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import type { MediaAsset, SiteConfig } from "@/types/summit";
import { ImageUploadField } from "./ImageUploadField";

export function SiteSettingsManager({
  config,
  mediaLibrary,
  onRefresh,
  onMediaUploaded,
}: {
  config: SiteConfig;
  mediaLibrary: MediaAsset[];
  onRefresh: () => Promise<void>;
  onMediaUploaded: (a: MediaAsset) => void;
}) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [highlightsText, setHighlightsText] = useState(config.aboutHighlights.join("\n"));
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);
    try {
      const payload = {
        ...form,
        aboutHighlights: highlightsText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setSavedNotice(true);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (idx: number, field: "label" | "value" | "suffix", val: string) => {
    const next = [...form.stats];
    next[idx] = { ...next[idx], [field]: val };
    setForm({ ...form, stats: next });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Site Settings & Branding</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Rebrand the summit name, dates, countdown timer, venue, logo, stats counters, and default glass theme.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Settings
        </button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Site settings saved! Visit the public homepage to see your updates live.
        </div>
      )}

      {/* Event Identity */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-cyan-400">Event Identity & Branding</h3>
        <ImageUploadField
          label="Summit Brand Logo"
          value={form.logoUrl}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
          mediaLibrary={mediaLibrary}
          onMediaUploaded={onMediaUploaded}
          folder="branding"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Event Full Name</label>
            <input
              value={form.eventName}
              onChange={(e) => setForm({ ...form, eventName: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Short Name / Acronym</label>
            <input
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Industry / Domain</label>
            <input
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Edition Badge</label>
            <input
              value={form.editionBadge}
              onChange={(e) => setForm({ ...form, editionBadge: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Event Dates Display</label>
            <input
              value={form.eventDates}
              onChange={(e) => setForm({ ...form, eventDates: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Countdown Target (ISO Date)</label>
            <input
              value={form.countdownTarget}
              onChange={(e) => setForm({ ...form, countdownTarget: e.target.value })}
              placeholder="2027-03-18T09:00:00+05:30"
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Default Translucent Theme</label>
            <select
              value={form.defaultTheme}
              onChange={(e) =>
                setForm({ ...form, defaultTheme: e.target.value as "dark" | "light" })
              }
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="dark">Dark Obsidian Aurora Glass</option>
              <option value="light">Light Frosted Crystal Glass</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Organizer Name</label>
            <input
              value={form.organizerName}
              onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-cyan-400">Impact Metrics Bar</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {form.stats.map((st, idx) => (
            <div key={idx} className="glass-subtle rounded-2xl p-3 space-y-2">
              <input
                value={st.value}
                onChange={(e) => updateStat(idx, "value", e.target.value)}
                placeholder="1,500"
                className="glass-input w-full rounded-lg px-2.5 py-1.5 text-sm font-bold"
              />
              <input
                value={st.suffix || ""}
                onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                placeholder="+"
                className="glass-input w-full rounded-lg px-2.5 py-1.5 text-xs"
              />
              <input
                value={st.label}
                onChange={(e) => updateStat(idx, "label", e.target.value)}
                placeholder="Global Delegates"
                className="glass-input w-full rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* About & Venue */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-cyan-400">About & Host Venue</h3>
        <ImageUploadField
          label="About Section Visual"
          value={form.aboutImage}
          onChange={(url) => setForm({ ...form, aboutImage: url })}
          mediaLibrary={mediaLibrary}
          onMediaUploaded={onMediaUploaded}
          folder="about"
        />
        <input
          value={form.aboutTitle}
          onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
          placeholder="About Title"
          className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
        />
        <textarea
          rows={3}
          value={form.aboutDescription}
          onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
          placeholder="About Description"
          className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
        />
        <div>
          <label className="mb-1 block text-xs font-semibold">
            Key Value Highlights (one per line)
          </label>
          <textarea
            rows={4}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
        </div>

        <hr className="opacity-15" />

        <ImageUploadField
          label="Venue Showcase Image"
          value={form.venueImage}
          onChange={(url) => setForm({ ...form, venueImage: url })}
          mediaLibrary={mediaLibrary}
          onMediaUploaded={onMediaUploaded}
          folder="venue"
        />
        <div className="grid gap-3.5 sm:grid-cols-2">
          <input
            value={form.venueName}
            onChange={(e) => setForm({ ...form, venueName: e.target.value })}
            placeholder="Venue Name"
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
          <input
            value={form.venueCity}
            onChange={(e) => setForm({ ...form, venueCity: e.target.value })}
            placeholder="City, Country"
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
          <input
            value={form.venueAddress}
            onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
            placeholder="Full Address"
            className="glass-input sm:col-span-2 w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
          <input
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            placeholder="Contact Email"
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
          <input
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            placeholder="Contact Phone"
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>
    </form>
  );
}
