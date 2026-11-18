"use client";

import React, { useState } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import type { MediaAsset } from "@/types/summit";

export function MediaLibraryManager({
  media,
  onRefresh,
}: {
  media: MediaAsset[];
  onRefresh: () => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);
      }
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this asset from the Media Library?")) return;
    await fetch(`/api/collection/media/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Media & Image Library</h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          Upload hero banners, speaker photos, sponsor logos, and venue visuals. All images are instantly reusable across the entire CMS.
        </p>
      </div>

      <label className="glass-panel flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-400/40 p-8 text-center transition hover:bg-cyan-500/10">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        ) : (
          <Upload className="h-8 w-8 text-cyan-400" />
        )}
        <span className="mt-2 font-display text-sm font-bold">
          {uploading ? "Uploading images..." : "Click or drag images here to upload"}
        </span>
        <span className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          Supports PNG, JPG, WebP, GIF, AVIF, SVG (up to 10MB each, multiple files supported)
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((asset) => (
          <div key={asset.id} className="glass-panel overflow-hidden rounded-2xl">
            <div className="aspect-[4/3] bg-slate-950/40 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.originalName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="truncate text-xs font-bold">{asset.originalName}</div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => copyUrl(asset)}
                  className="glass-subtle inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold hover:text-cyan-400 cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy URL
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
