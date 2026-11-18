"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import type { RegistrationType } from "@/types/summit";
import { GlassModal } from "../GlassPrimitives";

const INQUIRY_TYPES: RegistrationType[] = [
  "Delegate",
  "Sponsor",
  "Speaker",
  "Exhibitor",
  "Media",
];

export function RegistrationModal({
  open,
  defaultType = "Delegate",
  eventName,
  onClose,
}: {
  open: boolean;
  defaultType?: RegistrationType;
  eventName: string;
  onClose: () => void;
}) {
  const [inquiryType, setInquiryType] = useState<RegistrationType>(defaultType);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setInquiryType(defaultType);
    if (open) {
      setSubmitted(false);
      setError("");
    }
  }, [defaultType, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/collection/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          company,
          jobTitle,
          country,
          inquiryType,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setJobTitle("");
      setCountry("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Get Involved & Register"
      subtitle={`Submit your pass or partnership inquiry for ${eventName}`}
      maxWidth="max-w-2xl"
    >
      {submitted ? (
        <div className="py-10 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h4 className="font-display text-2xl font-bold">Registration Received!</h4>
          <p className="mx-auto max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
            Your <strong>{inquiryType}</strong> inquiry has been saved to our summit database. Our executive partnerships team will reach out shortly.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-aurora mt-2 rounded-full px-7 py-3 text-sm font-bold cursor-pointer"
          >
            Back to Summit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInquiryType(type)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  inquiryType === type
                    ? "btn-aurora text-white"
                    : "glass-subtle hover:opacity-90"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Full Name *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Sarah Lin"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Work Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.lin@enterprise.com"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Company / Organization *</label>
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Helios BioTherapeutics"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Job Title</label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="VP, Strategic Partnerships"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Phone / WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="India / Germany / USA"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">
              Additional Notes / Objectives
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Tell us about your ${inquiryType.toLowerCase()} goals...`}
              className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-3.5 py-2 text-xs text-rose-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass-subtle rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-aurora inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-bold disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit {inquiryType} Request
            </button>
          </div>
        </form>
      )}
    </GlassModal>
  );
}
