"use client";

import React, { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import type { Registration, RegistrationStatus } from "@/types/summit";
import { toCsv } from "@/lib/csv";

const STATUSES: RegistrationStatus[] = ["New", "Reviewed", "Approved", "Archived"];

export function RegistrationsManager({
  registrations,
  onRefresh,
}: {
  registrations: Registration[];
  onRefresh: () => Promise<void>;
}) {
  const [filterType, setFilterType] = useState("All");

  const filtered = registrations.filter(
    (r) => filterType === "All" || r.inquiryType === filterType
  );

  const updateStatus = async (id: string, status: RegistrationStatus) => {
    await fetch(`/api/collection/registrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this registration record?")) return;
    await fetch(`/api/collection/registrations/${id}`, { method: "DELETE" });
    await onRefresh();
  };

  const exportCsv = () => {
    const csv = toCsv(
      filtered.map((r) => ({
        FullName: r.fullName,
        Email: r.email,
        Phone: r.phone,
        Company: r.company,
        JobTitle: r.jobTitle,
        Country: r.country,
        Type: r.inquiryType,
        Status: r.status,
        Message: r.message,
        CreatedAt: r.createdAt,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summit-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Registrations & Inquiries</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Track Delegate, Sponsor, Speaker, Exhibitor, and Media leads captured from the live website.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="btn-aurora inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export CSV ({filtered.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Delegate", "Sponsor", "Speaker", "Exhibitor", "Media"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer ${
              filterType === t ? "btn-aurora text-white" : "glass-subtle"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-x-auto rounded-3xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b" style={{ borderColor: "var(--glass-border)" }}>
            <tr>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Contact</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Organization</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Type</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Notes</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderColor: "var(--glass-border)" }}>
                <td className="px-4 py-3.5">
                  <div className="font-bold">{r.fullName}</div>
                  <div className="text-[11px] text-cyan-400">{r.email}</div>
                  {r.phone && (
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {r.phone}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-semibold">{r.company}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {r.jobTitle} {r.country ? `• ${r.country}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[11px] font-bold text-indigo-400">
                    {r.inquiryType}
                  </span>
                </td>
                <td className="px-4 py-3.5 max-w-xs">
                  <p className="line-clamp-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    {r.message || "—"}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as RegistrationStatus)}
                    className="glass-input rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="glass-subtle rounded-lg p-1.5 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center" style={{ color: "var(--text-muted)" }}>
                  No registrations found in this category yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
