"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Upload, Check } from "lucide-react";
import type { MediaAsset } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";

export function ImageUploadField({
  label,
  value,
  onChange,
  mediaLibrary,
  onMediaUploaded,
  folder = "uploads",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  mediaLibrary: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      if (data.asset) onMediaUploaded(data.asset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-slate-950/40 flex items-center justify-center">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 opacity-40" />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/image.png or https://..."
            className="glass-input w-full rounded-xl px-3 py-2 text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:bg-cyan-500/20 cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
              ) : (
                <Upload className="h-3.5 w-3.5 text-cyan-400" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:bg-indigo-500/20 cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
              Pick from Media Library
            </button>
          </div>
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>
      </div>

      <GlassModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Media Library Picker"
        subtitle="Select any uploaded or built-in summit asset"
        maxWidth="max-w-3xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {mediaLibrary.map((asset) => {
            const selected = asset.url === value;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onChange(asset.url);
                  setPickerOpen(false);
                }}
                className={`group relative overflow-hidden rounded-2xl border text-left transition cursor-pointer ${
                  selected
                    ? "border-cyan-400 ring-2 ring-cyan-400/50"
                    : "border-white/15 hover:border-cyan-400/50"
                }`}
              >
                <div className="aspect-[4/3] bg-slate-950/50 overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.originalName}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-2 text-[11px] truncate font-medium">
                  {asset.originalName}
                </div>
                {selected && (
                  <span className="absolute top-2 right-2 rounded-full bg-cyan-400 p-1 text-slate-950">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </GlassModal>
    </div>
  );
}
