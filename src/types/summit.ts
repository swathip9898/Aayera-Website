export type ThemeMode = "dark" | "light";

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface SiteConfig {
  id: string;
  eventName: string;
  shortName: string;
  editionBadge: string;
  industry: string;
  tagline: string;
  eventDates: string;
  countdownTarget: string; // ISO date string
  venueName: string;
  venueCity: string;
  venueAddress: string;
  venueDescription: string;
  venueImage: string;
  logoUrl: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutHighlights: string[];
  aboutImage: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  defaultTheme: ThemeMode;
  stats: StatItem[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  ctaPrimaryText: string;
  ctaPrimaryAction: "register" | "sponsor" | "agenda" | "speakers" | "custom";
  ctaPrimaryUrl?: string;
  ctaSecondaryText: string;
  ctaSecondaryAction: "register" | "sponsor" | "agenda" | "speakers" | "custom";
  ctaSecondaryUrl?: string;
  overlayStyle: "aurora" | "obsidian" | "prism";
  order: number;
  active: boolean;
  createdAt?: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

export interface Session {
  id: string;
  day: string; // e.g., "Day 1"
  dateLabel: string; // e.g., "Nov 18, 2026"
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  track: string;
  sessionType: "Keynote" | "Panel" | "Fireside Chat" | "Workshop" | "Networking" | "Exhibition";
  hall: string;
  speakers: string[];
  order: number;
  createdAt?: string;
}

export type SponsorTier =
  | "Title Partner"
  | "Platinum Sponsor"
  | "Gold Sponsor"
  | "Knowledge Partner"
  | "Technology Partner"
  | "Exhibitor"
  | "Media Partner";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  order: number;
  createdAt?: string;
}

export interface ThemeTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // lucide icon name
  accent: "cyan" | "violet" | "emerald" | "amber" | "rose" | "blue";
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  order: number;
  createdAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export type RegistrationType = "Delegate" | "Sponsor" | "Speaker" | "Exhibitor" | "Media";
export type RegistrationStatus = "New" | "Reviewed" | "Approved" | "Archived";

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  inquiryType: RegistrationType;
  message: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string;
  createdAt: string;
}

export interface FullSiteData {
  config: SiteConfig;
  banners: Banner[];
  speakers: Speaker[];
  sessions: Session[];
  sponsors: Sponsor[];
  themes: ThemeTrack[];
  gallery: GalleryItem[];
  faqs: Faq[];
  storageMode: "mongodb" | "local-fallback";
}
