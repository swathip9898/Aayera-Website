import mongoose, { Schema, Model } from "mongoose";

const StatSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    suffix: { type: String, default: "" },
  },
  { _id: false }
);

const SiteConfigSchema = new Schema(
  {
    key: { type: String, unique: true, default: "primary" },
    eventName: { type: String, required: true },
    shortName: { type: String, required: true },
    editionBadge: { type: String, default: "" },
    industry: { type: String, default: "" },
    tagline: { type: String, default: "" },
    eventDates: { type: String, default: "" },
    countdownTarget: { type: String, default: "" },
    venueName: { type: String, default: "" },
    venueCity: { type: String, default: "" },
    venueAddress: { type: String, default: "" },
    venueDescription: { type: String, default: "" },
    venueImage: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutDescription: { type: String, default: "" },
    aboutHighlights: { type: [String], default: [] },
    aboutImage: { type: String, default: "" },
    organizerName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    defaultTheme: { type: String, enum: ["dark", "light"], default: "dark" },
    stats: { type: [StatSchema], default: [] },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    ctaPrimaryText: { type: String, default: "Register Now" },
    ctaPrimaryAction: {
      type: String,
      enum: ["register", "sponsor", "agenda", "speakers", "custom"],
      default: "register",
    },
    ctaPrimaryUrl: { type: String, default: "" },
    ctaSecondaryText: { type: String, default: "Explore Agenda" },
    ctaSecondaryAction: {
      type: String,
      enum: ["register", "sponsor", "agenda", "speakers", "custom"],
      default: "agenda",
    },
    ctaSecondaryUrl: { type: String, default: "" },
    overlayStyle: {
      type: String,
      enum: ["aurora", "obsidian", "prism"],
      default: "aurora",
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SpeakerSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    category: { type: String, default: "Keynote" },
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SessionSchema = new Schema(
  {
    day: { type: String, required: true },
    dateLabel: { type: String, default: "" },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    track: { type: String, default: "Main Stage" },
    sessionType: {
      type: String,
      enum: ["Keynote", "Panel", "Fireside Chat", "Workshop", "Networking", "Exhibition"],
      default: "Keynote",
    },
    hall: { type: String, default: "Grand Ballroom" },
    speakers: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SponsorSchema = new Schema(
  {
    name: { type: String, required: true },
    tier: {
      type: String,
      enum: [
        "Title Partner",
        "Platinum Sponsor",
        "Gold Sponsor",
        "Knowledge Partner",
        "Technology Partner",
        "Exhibitor",
        "Media Partner",
      ],
      default: "Gold Sponsor",
    },
    logoUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ThemeTrackSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "Sparkles" },
    accent: {
      type: String,
      enum: ["cyan", "violet", "emerald", "amber", "rose", "blue"],
      default: "cyan",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryItemSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, default: "" },
    category: { type: String, default: "Highlights" },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RegistrationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    company: { type: String, required: true },
    jobTitle: { type: String, default: "" },
    country: { type: String, default: "" },
    inquiryType: {
      type: String,
      enum: ["Delegate", "Sponsor", "Speaker", "Exhibitor", "Media"],
      default: "Delegate",
    },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Reviewed", "Approved", "Archived"],
      default: "New",
    },
  },
  { timestamps: true }
);

const MediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    folder: { type: String, default: "uploads" },
  },
  { timestamps: true }
);

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "superadmin" },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(name: string, schema: Schema): Model<any> {
  return mongoose.models[name] || mongoose.model(name, schema);
}

export const SiteConfigModel = getModel("SiteConfig", SiteConfigSchema);
export const BannerModel = getModel("Banner", BannerSchema);
export const SpeakerModel = getModel("Speaker", SpeakerSchema);
export const SessionModel = getModel("Session", SessionSchema);
export const SponsorModel = getModel("Sponsor", SponsorSchema);
export const ThemeTrackModel = getModel("ThemeTrack", ThemeTrackSchema);
export const GalleryItemModel = getModel("GalleryItem", GalleryItemSchema);
export const FaqModel = getModel("Faq", FaqSchema);
export const RegistrationModel = getModel("Registration", RegistrationSchema);
export const MediaAssetModel = getModel("MediaAsset", MediaAssetSchema);
export const AdminUserModel = getModel("AdminUser", AdminUserSchema);
