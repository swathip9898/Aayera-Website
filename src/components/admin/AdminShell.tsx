"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Menu,
  Settings,
  Sliders,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { FullSiteData, MediaAsset, Registration } from "@/types/summit";
import { AmbientBackdrop } from "../AmbientBackdrop";
import { ThemeToggleButton } from "../GlassPrimitives";
import { BannersManager } from "./BannersManager";
import { SpeakersManager } from "./SpeakersManager";
import { AgendaManager } from "./AgendaManager";
import { SponsorsManager } from "./SponsorsManager";
import { ContentManager } from "./ContentManager";
import { BulkImportManager } from "./BulkImportManager";
import { MediaLibraryManager } from "./MediaLibraryManager";
import { RegistrationsManager } from "./RegistrationsManager";
import { SiteSettingsManager } from "./SiteSettingsManager";

type TabKey =
  | "overview"
  | "banners"
  | "speakers"
  | "agenda"
  | "sponsors"
  | "content"
  | "import"
  | "media"
  | "registrations"
  | "settings";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

const NAV_ITEMS: {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "banners", label: "Hero Banners", icon: Sparkles },
  { key: "speakers", label: "Speakers", icon: Users },
  { key: "agenda", label: "Agenda / Schedule", icon: CalendarDays },
  { key: "sponsors", label: "Sponsors & Partners", icon: Award },
  { key: "content", label: "Themes, Gallery & FAQ", icon: Layers },
  { key: "import", label: "Bulk Data Upload", icon: FileSpreadsheet },
  { key: "media", label: "Media & Images", icon: ImageIcon },
  { key: "registrations", label: "Registrations", icon: UserCheck },
  { key: "settings", label: "Site Settings", icon: Settings },
];

export function AdminShell() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [storageMode, setStorageMode] = useState<"mongodb" | "local-fallback">("local-fallback");

  // Login form state
  const [email, setEmail] = useState("admin@summit.com");
  const [password, setPassword] = useState("Admin@123");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin CMS data
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [siteData, setSiteData] = useState<FullSiteData | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [siteRes, regRes, mediaRes] = await Promise.all([
        fetch("/api/site-data", { cache: "no-store" }),
        fetch("/api/collection/registrations", { cache: "no-store" }),
        fetch("/api/upload", { cache: "no-store" }),
      ]);
      if (siteRes.ok) {
        const sData: FullSiteData = await siteRes.json();
        setSiteData(sData);
        setStorageMode(sData.storageMode);
      }
      if (regRes.ok) {
        const rData = await regRes.json();
        setRegistrations(rData.items || []);
      }
      if (mediaRes.ok) {
        const mData = await mediaRes.json();
        setMedia(mData.items || []);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setStorageMode(d.storageMode || "local-fallback");
        if (d.authenticated && d.user) {
          setUser(d.user);
          loadAdminData();
        }
      })
      .finally(() => setCheckingAuth(false));
  }, [loadAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setUser(data.user);
      await loadAdminData();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSiteData(null);
  };

  const handleMediaUploaded = (asset: MediaAsset) => {
    setMedia((prev) => [asset, ...prev]);
  };

  if (checkingAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <AmbientBackdrop />
        <div className="glass-panel flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          Loading Summit Admin Console...
        </div>
      </div>
    );
  }

  // Translucent Glassmorphic Login Screen
  if (!user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <AmbientBackdrop />
        <div className="fixed top-4 right-4 flex items-center gap-2">
          <ThemeToggleButton />
          <Link
            href="/"
            className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
          >
            <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            Live Website
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-panel-strong w-full max-w-md rounded-[2rem] p-8"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-cyan-400/30">
              <Lock className="h-6 w-6 text-cyan-400" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold">
              Summit <span className="text-gradient-aurora">Admin CMS</span>
            </h1>
            <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              Sign in to manage banners, images, speakers, agenda, sponsors, and MongoDB data.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold">Admin Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>

            {loginError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/15 px-3.5 py-2 text-xs text-rose-400">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="btn-aurora flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold cursor-pointer"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 rounded-2xl glass-subtle p-3.5 text-[11px] space-y-1">
            <div className="font-bold text-cyan-400">Default Local Credentials</div>
            <div>
              Email: <code>admin@summit.com</code>
            </div>
            <div>
              Password: <code>Admin@123</code>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop />

      {/* Top Glass Header */}
      <header className="sticky top-0 z-30 border-b backdrop-blur-2xl" style={{ borderColor: "var(--glass-border)", background: "var(--glass-bg)" }}>
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="glass-subtle rounded-xl p-2 lg:hidden cursor-pointer"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <Sliders className="h-5 w-5 text-cyan-400" />
              <span className="font-display text-base sm:text-lg font-extrabold">
                {siteData?.config.shortName || "Summit"} <span className="text-gradient-aurora">Admin</span>
              </span>
            </div>
            <span
              className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
                storageMode === "mongodb"
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-400"
                  : "border-amber-400/30 bg-amber-500/15 text-amber-400"
              }`}
              title={
                storageMode === "mongodb"
                  ? "Connected to live MongoDB via Mongoose"
                  : "Running in local JSON preview storage. Add MONGODB_URI in .env.local to connect MongoDB."
              }
            >
              <Database className="h-3.5 w-3.5" />
              {storageMode === "mongodb" ? "MongoDB Live" : "Local Preview (Set MONGODB_URI)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Link
              href="/"
              target="_blank"
              className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold hover:text-cyan-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold hover:text-rose-400 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileNavOpen ? "fixed inset-y-16 left-4 z-40 block w-64" : "hidden"
          } lg:static lg:block lg:w-64 shrink-0`}
        >
          <div className="glass-panel-strong sticky top-20 rounded-3xl p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileNavOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition cursor-pointer ${
                    active ? "btn-aurora text-white" : "hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.key === "registrations" && registrations.length > 0 && (
                    <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                      {registrations.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Translucent CMS Workspace */}
        <main className="min-w-0 flex-1">
          {!siteData || loadingData && !siteData ? (
            <div className="glass-panel flex items-center justify-center rounded-3xl py-24">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                          Control Center
                        </span>
                        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold">
                          {siteData.config.eventName}
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                          {siteData.config.eventDates} • {siteData.config.venueName}, {siteData.config.venueCity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("banners")}
                        className="btn-aurora self-start rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
                      >
                        Manage Hero Banners →
                      </button>
                    </div>

                    {/* Quick KPI Grid */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                      {[
                        { label: "Active Banners", val: siteData.banners.filter((b) => b.active).length, tab: "banners" as TabKey },
                        { label: "Speakers", val: siteData.speakers.length, tab: "speakers" as TabKey },
                        { label: "Agenda Sessions", val: siteData.sessions.length, tab: "agenda" as TabKey },
                        { label: "Sponsors", val: siteData.sponsors.length, tab: "sponsors" as TabKey },
                        { label: "Registrations", val: registrations.length, tab: "registrations" as TabKey },
                      ].map((kpi) => (
                        <button
                          key={kpi.label}
                          type="button"
                          onClick={() => setActiveTab(kpi.tab)}
                          className="glass-panel rounded-3xl p-5 text-left transition hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="font-display text-3xl font-extrabold text-gradient-aurora">
                            {kpi.val}
                          </div>
                          <div className="mt-1 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                            {kpi.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* MongoDB Connection Guide Card */}
                    {storageMode !== "mongodb" && (
                      <div className="glass-panel rounded-3xl border border-amber-400/30 p-5 text-xs space-y-2">
                        <div className="font-display text-sm font-bold text-amber-400 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Connect Your Live MongoDB Database
                        </div>
                        <p style={{ color: "var(--text-secondary)" }}>
                          Right now you are in zero-config <strong>Local Preview Mode</strong> (all changes are saved to <code>.data/store.json</code>). To switch to live MongoDB Atlas or local MongoDB, simply set <code>MONGODB_URI</code> in <code>.env.local</code> and restart the server — Mongoose schemas auto-seed automatically!
                        </p>
                      </div>
                    )}

                    {/* Quick Launchers */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("media")}
                        className="glass-panel rounded-3xl p-5 text-left transition hover:border-cyan-400/40 cursor-pointer"
                      >
                        <ImageIcon className="h-6 w-6 text-cyan-400" />
                        <div className="mt-3 font-display text-base font-bold">Upload Images</div>
                        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          Upload banners, portraits, venue photos, and sponsor logos ({media.length} assets).
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("import")}
                        className="glass-panel rounded-3xl p-5 text-left transition hover:border-cyan-400/40 cursor-pointer"
                      >
                        <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
                        <div className="mt-3 font-display text-base font-bold">Bulk Data Upload</div>
                        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          Import spreadsheets (CSV/JSON) for Speakers, Agenda, Sponsors, or FAQs in one click.
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("settings")}
                        className="glass-panel rounded-3xl p-5 text-left transition hover:border-cyan-400/40 cursor-pointer"
                      >
                        <Settings className="h-6 w-6 text-indigo-400" />
                        <div className="mt-3 font-display text-base font-bold">Rebrand Summit</div>
                        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          Change event name, logo, dates, countdown target, stats, and Dark/Light glass theme.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "banners" && (
                  <BannersManager
                    banners={siteData.banners}
                    mediaLibrary={media}
                    onRefresh={loadAdminData}
                    onMediaUploaded={handleMediaUploaded}
                  />
                )}
                {activeTab === "speakers" && (
                  <SpeakersManager
                    speakers={siteData.speakers}
                    mediaLibrary={media}
                    onRefresh={loadAdminData}
                    onMediaUploaded={handleMediaUploaded}
                  />
                )}
                {activeTab === "agenda" && (
                  <AgendaManager sessions={siteData.sessions} onRefresh={loadAdminData} />
                )}
                {activeTab === "sponsors" && (
                  <SponsorsManager
                    sponsors={siteData.sponsors}
                    mediaLibrary={media}
                    onRefresh={loadAdminData}
                    onMediaUploaded={handleMediaUploaded}
                  />
                )}
                {activeTab === "content" && (
                  <ContentManager
                    themes={siteData.themes}
                    gallery={siteData.gallery}
                    faqs={siteData.faqs}
                    mediaLibrary={media}
                    onRefresh={loadAdminData}
                    onMediaUploaded={handleMediaUploaded}
                  />
                )}
                {activeTab === "import" && <BulkImportManager onRefresh={loadAdminData} />}
                {activeTab === "media" && (
                  <MediaLibraryManager media={media} onRefresh={loadAdminData} />
                )}
                {activeTab === "registrations" && (
                  <RegistrationsManager
                    registrations={registrations}
                    onRefresh={loadAdminData}
                  />
                )}
                {activeTab === "settings" && (
                  <SiteSettingsManager
                    config={siteData.config}
                    mediaLibrary={media}
                    onRefresh={loadAdminData}
                    onMediaUploaded={handleMediaUploaded}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
