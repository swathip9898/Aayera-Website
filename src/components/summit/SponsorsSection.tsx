"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Handshake } from "lucide-react";
import type { Sponsor, SponsorTier } from "@/types/summit";

const TIER_ORDER: SponsorTier[] = [
  "Title Partner",
  "Platinum Sponsor",
  "Gold Sponsor",
  "Knowledge Partner",
  "Technology Partner",
  "Exhibitor",
  "Media Partner",
];

export function SponsorsSection({
  sponsors,
  onBecomeSponsor,
}: {
  sponsors: Sponsor[];
  onBecomeSponsor: () => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Sponsor[]>();
    TIER_ORDER.forEach((t) => map.set(t, []));
    sponsors.forEach((sp) => {
      const list = map.get(sp.tier) || [];
      list.push(sp);
      map.set(sp.tier, list);
    });
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [sponsors]);

  return (
    <section id="sponsors" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#318CE7]">
              <Award className="h-3.5 w-3.5" />
              Ecosystem Partners
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sponsors, Partners & <span className="text-gradient-aurora">Exhibitors</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Backed by global industry leaders, institutional associations, and next-gen solution providers.
            </p>
          </div>
          <button
            type="button"
            onClick={onBecomeSponsor}
            className="btn-aurora inline-flex items-center gap-2 self-start rounded-full px-6 py-3 text-sm font-bold cursor-pointer"
          >
            <Handshake className="h-4 w-4" />
            Become a Sponsor / Exhibitor
          </button>
        </div>

        <div className="mt-12 space-y-10">
          {grouped.map(([tier, items]) => (
            <div key={tier}>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest !text-[#318CE7]">
                  {tier}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-[#318CE7]/40 to-transparent" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((sp, idx) => (
                  <motion.a
                    key={sp.id}
                    href={sp.websiteUrl || "#sponsors"}
                    target={sp.websiteUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="glass-panel group flex flex-col justify-between rounded-3xl p-5 transition"
                  >
                    <div className="flex h-20 items-center justify-center rounded-2xl bg-[#EAF5FF] p-3 border border-[#E3EDF7]">
                      <img
                        src={sp.logoUrl || "/images/sponsor-1.svg"}
                        alt={sp.name}
                        className="max-h-14 max-w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-base font-bold truncate">
                          {sp.name}
                        </h4>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 transition group-hover:text-cyan-400 group-hover:opacity-100" />
                      </div>
                      {sp.description && (
                        <p
                          className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {sp.description}
                        </p>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
