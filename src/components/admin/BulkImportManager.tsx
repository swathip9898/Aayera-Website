"use client";

import React, { useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { parseCsv } from "@/lib/csv";

type Target = "speakers" | "sessions" | "sponsors" | "faqs";

const TEMPLATES: Record<Target, { csv: string; json: string }> = {
  speakers: {
    csv: `name,role,company,category,bio,photoUrl,featured,order
Dr. Kavita Menon,VP Clinical Innovation,BioNova Labs,Keynote,"Leads AI drug discovery across APAC.",/images/speaker-1.svg,true,10
Lucas Weber,Chief Architect,AutoDrive Tech,Panelist,"Pioneering zonal E/E vehicle software.",/images/speaker-2.svg,true,11`,
    json: JSON.stringify(
      [
        {
          name: "Dr. Kavita Menon",
          role: "VP Clinical Innovation",
          company: "BioNova Labs",
          category: "Keynote",
          bio: "Leads AI drug discovery across APAC.",
          photoUrl: "/images/speaker-1.svg",
          featured: true,
        },
      ],
      null,
      2
    ),
  },
  sessions: {
    csv: `day,dateLabel,startTime,endTime,title,description,track,sessionType,hall,speakers
Day 1,"March 18, 2027",03:30 PM,04:15 PM,"Next-Gen Partnering Roundtable","Interactive deal structuring session.",Partnering & M&A,Panel,Aurora Hall B,"Dr. Ananya Deshmukh; Elena Lindholm"`,
    json: JSON.stringify(
      [
        {
          day: "Day 1",
          dateLabel: "March 18, 2027",
          startTime: "03:30 PM",
          endTime: "04:15 PM",
          title: "Next-Gen Partnering Roundtable",
          description: "Interactive deal structuring session.",
          track: "Partnering & M&A",
          sessionType: "Panel",
          hall: "Aurora Hall B",
          speakers: ["Dr. Ananya Deshmukh", "Elena Lindholm"],
        },
      ],
      null,
      2
    ),
  },
  sponsors: {
    csv: `name,tier,logoUrl,websiteUrl,description
PulseMed Diagnostics,Gold Sponsor,/images/sponsor-3.svg,https://example.com,"Precision diagnostic solutions."
CloudDrive Systems,Technology Partner,/images/sponsor-6.svg,https://example.com,"Connected OTA vehicle telemetry."`,
    json: JSON.stringify(
      [
        {
          name: "PulseMed Diagnostics",
          tier: "Gold Sponsor",
          logoUrl: "/images/sponsor-3.svg",
          websiteUrl: "https://example.com",
          description: "Precision diagnostic solutions.",
        },
      ],
      null,
      2
    ),
  },
  faqs: {
    csv: `question,answer,category
"Is group registration available?","Yes! Teams of 3+ delegates receive an automatic 20% executive discount.",Attendance`,
    json: JSON.stringify(
      [
        {
          question: "Is group registration available?",
          answer: "Yes! Teams of 3+ delegates receive an automatic 20% executive discount.",
          category: "Attendance",
        },
      ],
      null,
      2
    ),
  },
};

export function BulkImportManager({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [target, setTarget] = useState<Target>("speakers");
  const [rawText, setRawText] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleParse = (text: string, fmt: "csv" | "json") => {
    setRawText(text);
    setError("");
    setResult("");
    if (!text.trim()) {
      setPreview([]);
      return;
    }
    try {
      if (fmt === "json") {
        const parsed = JSON.parse(text);
        setPreview(Array.isArray(parsed) ? parsed : [parsed]);
      } else {
        setPreview(parseCsv(text));
      }
    } catch {
      setPreview([]);
      setError(`Could not parse ${fmt.toUpperCase()} preview. Check formatting.`);
    }
  };

  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    const detected: "csv" | "json" = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
    setFormat(detected);
    handleParse(text, detected);
  };

  const downloadTemplate = (fmt: "csv" | "json") => {
    const content = TEMPLATES[target][fmt];
    const blob = new Blob([content], {
      type: fmt === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${target}-template.${fmt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!preview.length) return;
    setImporting(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, rows: preview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult(`Successfully imported ${data.count} ${target} record(s) into the database!`);
      setRawText("");
      setPreview([]);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Bulk Data Upload (CSV / JSON)</h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          Upload CSV spreadsheets or JSON files to batch-import Speakers, Agenda Sessions, Sponsors, or FAQs directly into MongoDB.
        </p>
      </div>

      {/* Step 1: Choose Collection */}
      <div className="glass-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(["speakers", "sessions", "sponsors", "faqs"] as Target[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTarget(t);
                  setPreview([]);
                  setRawText("");
                  setResult("");
                  setError("");
                }}
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                  target === t ? "btn-aurora text-white" : "glass-subtle"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadTemplate("csv")}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold hover:text-cyan-400 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Sample CSV
            </button>
            <button
              type="button"
              onClick={() => downloadTemplate("json")}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold hover:text-cyan-400 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Sample JSON
            </button>
            <button
              type="button"
              onClick={() => {
                setFormat("csv");
                handleParse(TEMPLATES[target].csv, "csv");
              }}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-cyan-400 cursor-pointer"
            >
              Load Demo Data
            </button>
          </div>
        </div>

        {/* File Dropzone */}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-400/35 bg-cyan-500/5 p-8 text-center transition hover:bg-cyan-500/10">
          <FileSpreadsheet className="h-8 w-8 text-cyan-400" />
          <span className="mt-2 font-display text-sm font-bold">
            Drop or click to upload a .CSV or .JSON file for {target}
          </span>
          <span className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Or paste raw CSV/JSON directly below to preview before importing
          </span>
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />
        </label>

        {/* Raw editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Paste CSV or JSON Data</label>
            <div className="flex gap-1.5">
              {(["csv", "json"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFormat(f);
                    handleParse(rawText, f);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                    format === f ? "bg-cyan-500/20 text-cyan-400" : "glass-subtle"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => handleParse(e.target.value, format)}
            placeholder={`Paste ${format.toUpperCase()} rows here...`}
            className="glass-input w-full rounded-2xl p-3.5 font-mono text-xs"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-xs text-rose-400">
            {error}
          </div>
        )}
        {result && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {result}
          </div>
        )}

        {/* Preview Table */}
        {preview.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">
                Ready to import {preview.length} row(s) into {target}
              </span>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="btn-aurora inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold cursor-pointer"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import {preview.length} Records Now
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5">
                  <tr>
                    {Object.keys(preview[0]).map((col) => (
                      <th key={col} className="px-3 py-2 font-bold uppercase tracking-wider text-[10px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 8).map((row, idx) => (
                    <tr key={idx} className="border-t" style={{ borderColor: "var(--glass-border)" }}>
                      {Object.keys(preview[0]).map((col) => (
                        <td key={col} className="px-3 py-2 max-w-[200px] truncate">
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
