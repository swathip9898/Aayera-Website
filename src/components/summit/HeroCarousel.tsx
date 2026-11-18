"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Banner, RegistrationType, SiteConfig } from "@/types/summit";
import { CountdownTimer } from "../GlassPrimitives";

export function HeroCarousel({
  banners,
  config,
  onOpenRegister,
}: {
  banners: Banner[];
  config: SiteConfig;
  onOpenRegister: (type?: RegistrationType) => void;
}) {
  const activeBanners = banners.filter((b) => b.active);
  const slides = activeBanners.length > 0 ? activeBanners : banners;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  const current = slides[index % Math.max(1, slides.length)];
  if (!current) return null;

  const handleAction = (
    action: Banner["ctaPrimaryAction"],
    customUrl?: string
  ) => {
    if (action === "register") return onOpenRegister("Delegate");
    if (action === "sponsor") return onOpenRegister("Sponsor");
    if (action === "agenda") {
      document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (action === "speakers") {
      document.getElementById("speakers")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (customUrl) {
      window.open(customUrl, "_blank", "noopener,noreferrer");
    }
  };

  const overlayGradient =
    current.overlayStyle === "prism"
      ? "linear-gradient(125deg, rgba(37, 54, 74, 0.88) 0%, rgba(36, 120, 204, 0.68) 55%, rgba(49, 140, 231, 0.58) 100%)"
      : current.overlayStyle === "obsidian"
      ? "linear-gradient(125deg, rgba(20, 34, 52, 0.90) 0%, rgba(37, 54, 74, 0.72) 55%, rgba(36, 120, 204, 0.62) 100%)"
      : "linear-gradient(125deg, rgba(26, 44, 66, 0.86) 0%, rgba(36, 120, 204, 0.62) 52%, rgba(49, 140, 231, 0.54) 100%)";

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] pt-28 pb-16 flex items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Animated Background Banner Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          {current.imageUrl && (
            <img
              src={current.imageUrl}
              alt={current.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0" style={{ background: overlayGradient }} />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Translucent Hero Text Screen */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="rounded-3xl border border-[#E3EDF7]/30 bg-[#25364A]/45 p-7 sm:p-10 backdrop-blur-2xl shadow-2xl"
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#70B7FF]/45 bg-[#318CE7]/25 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#EAF5FF]">
                  <Sparkles className="h-3.5 w-3.5 text-[#70B7FF]" />
                  <span>{current.badge || config.editionBadge}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight !text-white">
                  {current.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#EAF5FF]/90">
                  {current.subtitle}
                </p>

                {/* Date & Venue Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-md">
                    <Calendar className="h-4 w-4 text-[#70B7FF]" />
                    {config.eventDates}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-md">
                    <MapPin className="h-4 w-4 text-[#70B7FF]" />
                    {config.venueName}, {config.venueCity}
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleAction(current.ctaPrimaryAction, current.ctaPrimaryUrl)}
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold tracking-wide cursor-pointer"
                  >
                    {current.ctaPrimaryText || "Register Now"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAction(current.ctaSecondaryAction, current.ctaSecondaryUrl)
                    }
                    className="btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold cursor-pointer"
                  >
                    {current.ctaSecondaryText || "Explore Agenda"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Translucent Floating Event Pulse / Countdown Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-4"
          >
            <div className="rounded-3xl border border-[#E3EDF7]/30 bg-[#25364A]/52 p-6 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#70B7FF]">
                  Summit Countdown
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#318CE7]/25 border border-[#70B7FF]/40 px-2.5 py-1 text-[11px] font-semibold text-[#EAF5FF]">
                  <span className="h-2 w-2 rounded-full bg-[#70B7FF] animate-pulse" />
                  Live Registration
                </span>
              </div>

              <h2 className="mt-2 font-display text-lg font-bold !text-white">
                {config.eventName}
              </h2>
              <p className="mt-1 text-xs text-[#EAF5FF]/80">{config.industry}</p>

              <div className="mt-5">
                <CountdownTimer targetIso={config.countdownTarget} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenRegister("Delegate")}
                  className="rounded-xl border border-white/20 bg-white/12 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#318CE7] cursor-pointer"
                >
                  Delegate Pass
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRegister("Sponsor")}
                  className="rounded-xl border border-[#70B7FF]/50 bg-[#70B7FF]/25 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#318CE7] cursor-pointer"
                >
                  Sponsor / Exhibit
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRegister("Speaker")}
                  className="rounded-xl border border-white/20 bg-white/12 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#318CE7] cursor-pointer"
                >
                  Apply to Speak
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRegister("Media")}
                  className="rounded-xl border border-white/20 bg-white/12 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#318CE7] cursor-pointer"
                >
                  Media Pass
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators & Controls */}
        {slides.length > 1 && (
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  aria-label={`Banner slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === index % slides.length
                      ? "w-10 bg-[#70B7FF] shadow-[0_0_16px_rgba(112,183,255,0.85)]"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                aria-label="Previous banner"
                className="rounded-full border border-white/20 bg-slate-950/40 p-2.5 text-white backdrop-blur-xl transition hover:bg-white/20 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
                aria-label="Next banner"
                className="rounded-full border border-white/20 bg-slate-950/40 p-2.5 text-white backdrop-blur-xl transition hover:bg-white/20 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
