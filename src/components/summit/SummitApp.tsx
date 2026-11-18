"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Globe,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import type { FullSiteData, GalleryItem, RegistrationType } from "@/types/summit";
import { AmbientBackdrop } from "../AmbientBackdrop";
import { GlassModal, ThemeToggleButton } from "../GlassPrimitives";
import { HeroCarousel } from "./HeroCarousel";
import { SpeakersSection } from "./SpeakersSection";
import { AgendaSection } from "./AgendaSection";
import { SponsorsSection } from "./SponsorsSection";
import { RegistrationModal } from "./RegistrationModal";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Handshake,
  Cpu,
  ShieldCheck,
  Layers,
  Globe,
  Rocket,
  Sparkles,
};

const ACCENT_RING: Record<string, string> = {
  cyan: "from-[#318CE7] to-[#70B7FF] text-[#318CE7]",
  violet: "from-[#2478CC] to-[#70B7FF] text-[#2478CC]",
  emerald: "from-[#318CE7] to-[#2478CC] text-[#318CE7]",
  amber: "from-[#70B7FF] to-[#318CE7] text-[#318CE7]",
  rose: "from-[#2478CC] to-[#318CE7] text-[#2478CC]",
  blue: "from-[#318CE7] to-[#70B7FF] text-[#318CE7]",
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Themes", href: "#themes" },
  { label: "Speakers", href: "#speakers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Venue", href: "#venue" },
  { label: "FAQ", href: "#faq" },
];

export function SummitApp({ initialData }: { initialData: FullSiteData }) {
  const { config, banners, speakers, sessions, sponsors, themes, gallery, faqs } = initialData;
  const [regOpen, setRegOpen] = useState(false);
  const [regType, setRegType] = useState<RegistrationType>("Delegate");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const openRegister = (type: RegistrationType = "Delegate") => {
    setRegType(type);
    setRegOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop />

      {/* Floating Translucent Glass Navbar */}
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
        <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <a href="#hero" className="flex items-center gap-3">
            <img
              src={config.logoUrl || "/images/logo-mark.svg"}
              alt={config.shortName}
              className="h-9 w-9 rounded-xl object-contain"
            />
            <div className="leading-tight">
              <div className="font-display text-sm sm:text-base font-extrabold tracking-tight">
                {config.shortName}
              </div>
              <div
                className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {config.eventDates}
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-[#318CE7]"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Link
              href="/admin"
              title="Open Admin CMS Panel"
              className="btn-secondary hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold"
            >
              <Settings className="h-3.5 w-3.5" />
              Admin
            </Link>
            <button
              type="button"
              onClick={() => openRegister("Delegate")}
              className="btn-primary hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Register
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="glass-subtle rounded-full p-2 lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Translucent Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between p-6 lg:hidden"
            style={{
              background: "var(--glass-backdrop-overlay)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-white">
                {config.shortName}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-center">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-2xl font-bold text-white transition hover:text-cyan-300"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-lg font-semibold text-cyan-300 mt-2"
              >
                Admin Panel CMS →
              </Link>
            </div>
            <button
              type="button"
              onClick={() => openRegister("Delegate")}
              className="btn-aurora w-full rounded-full py-4 text-sm font-bold"
            >
              Register Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Animated Translucent Banner Carousel */}
      <HeroCarousel banners={banners} config={config} onOpenRegister={openRegister} />

      {/* Impact Metrics Floating Glass Bar */}
      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="glass-panel-strong grid grid-cols-2 gap-4 rounded-3xl p-6 sm:p-8 lg:grid-cols-4">
            {config.stats.map((stat, idx) => (
              <motion.div
                key={`${stat.label}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="text-center"
              >
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-gradient-aurora">
                  {stat.value}
                  {stat.suffix || ""}
                </div>
                <div
                  className="mt-1 text-xs sm:text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Strategic Value Section */}
      <section id="about" className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-6 space-y-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#318CE7]">
                <Sparkles className="h-3.5 w-3.5" />
                About The Summit
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {config.aboutTitle}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {config.aboutDescription}
              </p>

              <div className="space-y-3 pt-2">
                {config.aboutHighlights.map((point, idx) => (
                  <div
                    key={idx}
                    className="glass-subtle flex items-start gap-3 rounded-2xl p-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#318CE7]" />
                    <span className="text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => openRegister("Delegate")}
                  className="btn-primary rounded-full px-6 py-3 text-sm font-bold cursor-pointer"
                >
                  Reserve Delegate Pass
                </button>
                <button
                  type="button"
                  onClick={() => openRegister("Exhibitor")}
                  className="btn-secondary rounded-full px-6 py-3 text-sm font-bold cursor-pointer"
                >
                  Book Exhibition Booth
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-6"
            >
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-3">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem]">
                  <img
                    src={config.aboutImage || "/images/about-stage.svg"}
                    alt={config.aboutTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/55 p-4 backdrop-blur-xl text-white">
                    <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                      {config.industry}
                    </div>
                    <div className="mt-1 font-display text-base font-bold">
                      {config.eventDates} • {config.venueCity}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conference Themes / Pillars (Highlight Section #EAF5FF) */}
      <section id="themes" className="section-highlight relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full glass-panel px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#318CE7]">
              <Layers className="h-3.5 w-3.5" />
              Strategic Pillars
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Key Conference <span className="text-gradient-aurora">Themes & Tracks</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Curated thematic streams tackling high-impact innovation, strategic outsourcing, AI, and global compliance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme, idx) => {
              const IconComp = ICON_MAP[theme.icon] || Sparkles;
              const accentClass = ACCENT_RING[theme.accent] || ACCENT_RING.cyan;
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="glass-panel relative overflow-hidden rounded-3xl p-6"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`}
                  />
                  <div className="glass-subtle inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                    <IconComp className={`h-6 w-6 ${accentClass.split(" ").pop()}`} />
                  </div>
                  <div className="mt-4 text-xs font-bold uppercase tracking-wider text-[#318CE7]">
                    {theme.subtitle}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold">{theme.title}</h3>
                  <p
                    className="mt-2.5 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {theme.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Speakers Directory */}
      <SpeakersSection
        speakers={speakers}
        sessions={sessions}
        onApplySpeaker={() => openRegister("Speaker")}
      />

      {/* Multi-Day Agenda */}
      <AgendaSection sessions={sessions} />

      {/* Sponsors & Partners */}
      <SponsorsSection
        sponsors={sponsors}
        onBecomeSponsor={() => openRegister("Sponsor")}
      />

      {/* Venue & Translucent Gallery Lightbox (Highlight Section #EAF5FF) */}
      <section id="venue" className="section-highlight relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="glass-panel-strong overflow-hidden rounded-[2rem] p-6 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#318CE7]">
                  <Building2 className="h-3.5 w-3.5" />
                  Host Venue
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
                  {config.venueName}
                </h2>
                <p className="flex items-start gap-2 text-sm font-semibold text-[#318CE7]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {config.venueAddress} • {config.venueCity}
                  </span>
                </p>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {config.venueDescription}
                </p>
              </div>
              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl aspect-[16/10]">
                  <img
                    src={config.venueImage || "/images/venue-hall.svg"}
                    alt={config.venueName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Photo Gallery */}
          {gallery.length > 0 && (
            <div>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
                    Summit <span className="text-gradient-aurora">Experience Gallery</span>
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    Click any visual to inspect inside an animated translucent lightbox screen.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {gallery.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    className="glass-panel group relative overflow-hidden rounded-3xl text-left transition hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 opacity-0 transition group-hover:opacity-100">
                        <span className="rounded-full bg-white/20 p-3 text-white backdrop-blur-md">
                          <ZoomIn className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        {item.category}
                      </span>
                      <div className="mt-0.5 font-display text-sm font-bold">{item.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="relative py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
              Frequently Asked <span className="text-gradient-aurora">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="glass-panel overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-sm sm:text-base font-bold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-cyan-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="border-t px-6 py-4 text-sm leading-relaxed"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive CTA Glass Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="section-highlight relative overflow-hidden rounded-[2.2rem] border p-8 sm:p-12 text-center shadow-xl" style={{ borderColor: "var(--glass-border)" }}>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
              Ready to Join <span className="text-gradient-aurora">{config.shortName}</span>?
            </h2>
            <p
              className="mx-auto mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Secure your delegate seat, showcase your solutions in the Exhibition Arena, or partner with global leaders.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3.5">
              <button
                type="button"
                onClick={() => openRegister("Delegate")}
                className="btn-primary rounded-full px-7 py-3.5 text-sm font-bold cursor-pointer"
              >
                Register as Delegate
              </button>
              <button
                type="button"
                onClick={() => openRegister("Sponsor")}
                className="btn-secondary rounded-full px-7 py-3.5 text-sm font-bold cursor-pointer"
              >
                Sponsor / Exhibit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-10 border-t py-12" style={{ borderColor: "var(--glass-border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={config.logoUrl || "/images/logo-mark.svg"}
                  alt={config.shortName}
                  className="h-9 w-9 rounded-xl object-contain"
                />
                <span className="font-display text-lg font-extrabold">{config.eventName}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Organized by {config.organizerName}. Powered by MongoDB dynamic CMS with real-time admin control.
              </p>
            </div>

            <div className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <div className="font-display text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Contact Partnerships Desk
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                {config.contactEmail}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                {config.contactPhone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                {config.venueName}, {config.venueCity}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between gap-4">
              <Link
                href="/admin"
                className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition hover:scale-105"
              >
                <Settings className="h-4 w-4 text-cyan-400" />
                Open Admin Control Panel
              </Link>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                © {new Date().getFullYear()} {config.organizerName}. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Translucent Gallery Lightbox Screen */}
      <GlassModal
        open={Boolean(lightboxItem)}
        onClose={() => setLightboxItem(null)}
        title={lightboxItem?.title}
        subtitle={lightboxItem?.caption}
        maxWidth="max-w-4xl"
      >
        {lightboxItem && (
          <div className="overflow-hidden rounded-2xl border border-white/15">
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.title}
              className="max-h-[65vh] w-full object-contain bg-slate-950/60"
            />
          </div>
        )}
      </GlassModal>

      {/* Translucent Registration Modal */}
      <RegistrationModal
        open={regOpen}
        defaultType={regType}
        eventName={config.eventName}
        onClose={() => setRegOpen(false)}
      />
    </div>
  );
}
