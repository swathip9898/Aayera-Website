"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { Faq, GalleryItem, MediaAsset, ThemeTrack } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";
import { ImageUploadField } from "./ImageUploadField";

export function ContentManager({
  themes,
  gallery,
  faqs,
  mediaLibrary,
  onRefresh,
  onMediaUploaded,
}: {
  themes: ThemeTrack[];
  gallery: GalleryItem[];
  faqs: Faq[];
  mediaLibrary: MediaAsset[];
  onRefresh: () => Promise<void>;
  onMediaUploaded: (a: MediaAsset) => void;
}) {
  const [subTab, setSubTab] = useState<"themes" | "gallery" | "faqs">("themes");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [themeForm, setThemeForm] = useState<Omit<ThemeTrack, "id">>({
    title: "",
    subtitle: "",
    description: "",
    icon: "Sparkles",
    accent: "cyan",
    order: themes.length + 1,
  });

  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, "id">>({
    title: "",
    caption: "",
    category: "Highlights",
    imageUrl: "/images/banner-1.svg",
    order: gallery.length + 1,
  });

  const [faqForm, setFaqForm] = useState<Omit<Faq, "id">>({
    question: "",
    answer: "",
    category: "General",
    order: faqs.length + 1,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload =
        subTab === "themes" ? themeForm : subTab === "gallery" ? galleryForm : faqForm;
      const res = await fetch(`/api/collection/${subTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: "themes" | "gallery" | "faqs", id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/collection/${type}/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Themes, Gallery & FAQs</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Control conference pillars, visual gallery lightbox items, and visitor FAQs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add {subTab === "themes" ? "Theme" : subTab === "gallery" ? "Gallery Photo" : "FAQ"}
        </button>
      </div>

      <div className="flex gap-2">
        {(["themes", "gallery", "faqs"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSubTab(t)}
            className={`rounded-full px-5 py-2 text-xs font-bold capitalize transition cursor-pointer ${
              subTab === t ? "btn-aurora text-white" : "glass-subtle"
            }`}
          >
            {t} ({t === "themes" ? themes.length : t === "gallery" ? gallery.length : faqs.length})
          </button>
        ))}
      </div>

      {subTab === "themes" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((th) => (
            <div key={th.id} className="glass-panel rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase text-cyan-400">{th.subtitle}</div>
                <h3 className="font-display text-base font-bold mt-0.5">{th.title}</h3>
                <p className="mt-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {th.description}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete("themes", th.id)}
                  className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === "gallery" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.id} className="glass-panel overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={g.imageUrl} alt={g.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase text-cyan-400">{g.category}</div>
                  <div className="truncate font-display text-sm font-bold">{g.title}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete("gallery", g.id)}
                  className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === "faqs" && (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="glass-panel flex items-start justify-between gap-4 rounded-2xl p-4">
              <div>
                <div className="font-display text-sm font-bold">{f.question}</div>
                <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {f.answer}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete("faqs", f.id)}
                className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Add ${subTab === "themes" ? "Conference Theme" : subTab === "gallery" ? "Gallery Image" : "FAQ"}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {subTab === "themes" && (
            <>
              <input
                required
                placeholder="Theme Title (e.g. AI & Digital Transformation)"
                value={themeForm.title}
                onChange={(e) => setThemeForm({ ...themeForm, title: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                placeholder="Subtitle"
                value={themeForm.subtitle}
                onChange={(e) => setThemeForm({ ...themeForm, subtitle: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Description"
                value={themeForm.description}
                onChange={(e) => setThemeForm({ ...themeForm, description: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={themeForm.icon}
                  onChange={(e) => setThemeForm({ ...themeForm, icon: e.target.value })}
                  className="glass-input rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Handshake">Handshake</option>
                  <option value="Cpu">Cpu / AI</option>
                  <option value="ShieldCheck">Shield / Security</option>
                  <option value="Layers">Layers / Cloud</option>
                  <option value="Globe">Globe</option>
                  <option value="Rocket">Rocket</option>
                </select>
                <select
                  value={themeForm.accent}
                  onChange={(e) =>
                    setThemeForm({ ...themeForm, accent: e.target.value as ThemeTrack["accent"] })
                  }
                  className="glass-input rounded-xl px-3 py-2 text-sm"
                >
                  <option value="cyan">Cyan</option>
                  <option value="violet">Violet</option>
                  <option value="emerald">Emerald</option>
                  <option value="amber">Amber</option>
                  <option value="rose">Rose</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            </>
          )}

          {subTab === "gallery" && (
            <>
              <ImageUploadField
                label="Gallery Image"
                value={galleryForm.imageUrl}
                onChange={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })}
                mediaLibrary={mediaLibrary}
                onMediaUploaded={onMediaUploaded}
                folder="gallery"
              />
              <input
                required
                placeholder="Title"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                placeholder="Category (Keynotes / Networking / Exhibition / Venue)"
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <textarea
                rows={2}
                placeholder="Caption"
                value={galleryForm.caption}
                onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </>
          )}

          {subTab === "faqs" && (
            <>
              <input
                required
                placeholder="Question"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
              <textarea
                required
                rows={3}
                placeholder="Answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </>
          )}

          <div className="flex justify-end gap-2">
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
              Save
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
