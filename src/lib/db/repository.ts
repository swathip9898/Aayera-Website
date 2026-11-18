import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import type { Model } from "mongoose";
import { connectMongo } from "./mongodb";
import {
  SiteConfigModel,
  BannerModel,
  SpeakerModel,
  SessionModel,
  SponsorModel,
  ThemeTrackModel,
  GalleryItemModel,
  FaqModel,
  RegistrationModel,
  MediaAssetModel,
  AdminUserModel,
} from "./models";
import {
  SEED_CONFIG,
  SEED_BANNERS,
  SEED_SPEAKERS,
  SEED_SESSIONS,
  SEED_SPONSORS,
  SEED_THEMES,
  SEED_GALLERY,
  SEED_FAQS,
  SEED_REGISTRATIONS,
  SEED_MEDIA,
} from "./seedData";
import { hashPassword, verifyPassword } from "../auth";
import type {
  SiteConfig,
  Banner,
  Speaker,
  Session,
  Sponsor,
  ThemeTrack,
  GalleryItem,
  Faq,
  Registration,
  MediaAsset,
  FullSiteData,
} from "@/types/summit";

type CollectionKey =
  | "banners"
  | "speakers"
  | "sessions"
  | "sponsors"
  | "themes"
  | "gallery"
  | "faqs"
  | "registrations"
  | "media";

interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
}

interface LocalStore {
  config: SiteConfig;
  banners: Banner[];
  speakers: Speaker[];
  sessions: Session[];
  sponsors: Sponsor[];
  themes: ThemeTrack[];
  gallery: GalleryItem[];
  faqs: Faq[];
  registrations: Registration[];
  media: MediaAsset[];
  admins: AdminUserRecord[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function makeId(): string {
  return crypto.randomBytes(12).toString("hex");
}

function defaultAdmin(): AdminUserRecord {
  const email = process.env.ADMIN_EMAIL || "admin@summit.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  return {
    id: makeId(),
    email: email.toLowerCase(),
    name: "Summit Super Admin",
    passwordHash: hashPassword(password),
    role: "superadmin",
  };
}

function buildSeedStore(): LocalStore {
  return {
    config: { id: "primary", ...SEED_CONFIG, updatedAt: new Date().toISOString() },
    banners: SEED_BANNERS.map((b) => ({ id: makeId(), ...b, createdAt: new Date().toISOString() })),
    speakers: SEED_SPEAKERS.map((s) => ({ id: makeId(), ...s, createdAt: new Date().toISOString() })),
    sessions: SEED_SESSIONS.map((s) => ({ id: makeId(), ...s, createdAt: new Date().toISOString() })),
    sponsors: SEED_SPONSORS.map((s) => ({ id: makeId(), ...s, createdAt: new Date().toISOString() })),
    themes: SEED_THEMES.map((t) => ({ id: makeId(), ...t })),
    gallery: SEED_GALLERY.map((g) => ({ id: makeId(), ...g, createdAt: new Date().toISOString() })),
    faqs: SEED_FAQS.map((f) => ({ id: makeId(), ...f })),
    registrations: SEED_REGISTRATIONS.map((r) => ({ id: makeId(), ...r })),
    media: SEED_MEDIA.map((m) => ({ id: makeId(), ...m })),
    admins: [defaultAdmin()],
  };
}

async function readLocalStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    const seeded = buildSeedStore();
    await writeLocalStore(seeded);
    return seeded;
  }
}

async function writeLocalStore(store: LocalStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDoc<T>(doc: any): T {
  const obj = typeof doc?.toObject === "function" ? doc.toObject() : { ...doc };
  const id = obj._id ? String(obj._id) : obj.id || makeId();
  delete obj._id;
  delete obj.__v;
  return { ...obj, id } as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODEL_MAP: Record<CollectionKey, Model<any>> = {
  banners: BannerModel,
  speakers: SpeakerModel,
  sessions: SessionModel,
  sponsors: SponsorModel,
  themes: ThemeTrackModel,
  gallery: GalleryItemModel,
  faqs: FaqModel,
  registrations: RegistrationModel,
  media: MediaAssetModel,
};

let mongoSeeded = false;

async function ensureMongoSeeded() {
  if (mongoSeeded) return;
  const conn = await connectMongo();
  if (!conn) return;

  const existingConfig = await SiteConfigModel.findOne({ key: "primary" });
  if (!existingConfig) {
    await SiteConfigModel.create({ key: "primary", ...SEED_CONFIG });
  }
  if ((await BannerModel.countDocuments()) === 0) {
    await BannerModel.insertMany(SEED_BANNERS);
  }
  if ((await SpeakerModel.countDocuments()) === 0) {
    await SpeakerModel.insertMany(SEED_SPEAKERS);
  }
  if ((await SessionModel.countDocuments()) === 0) {
    await SessionModel.insertMany(SEED_SESSIONS);
  }
  if ((await SponsorModel.countDocuments()) === 0) {
    await SponsorModel.insertMany(SEED_SPONSORS);
  }
  if ((await ThemeTrackModel.countDocuments()) === 0) {
    await ThemeTrackModel.insertMany(SEED_THEMES);
  }
  if ((await GalleryItemModel.countDocuments()) === 0) {
    await GalleryItemModel.insertMany(SEED_GALLERY);
  }
  if ((await FaqModel.countDocuments()) === 0) {
    await FaqModel.insertMany(SEED_FAQS);
  }
  if ((await RegistrationModel.countDocuments()) === 0) {
    await RegistrationModel.insertMany(SEED_REGISTRATIONS);
  }
  if ((await MediaAssetModel.countDocuments()) === 0) {
    await MediaAssetModel.insertMany(SEED_MEDIA);
  }
  if ((await AdminUserModel.countDocuments()) === 0) {
    const admin = defaultAdmin();
    await AdminUserModel.create({
      email: admin.email,
      name: admin.name,
      passwordHash: admin.passwordHash,
      role: admin.role,
    });
  }
  mongoSeeded = true;
}

export async function getStorageMode(): Promise<"mongodb" | "local-fallback"> {
  const conn = await connectMongo();
  return conn ? "mongodb" : "local-fallback";
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ email: string; name: string; role: string } | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const user = await AdminUserModel.findOne({ email: normalizedEmail }).lean();
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = user as any;
    if (!verifyPassword(password, u.passwordHash)) return null;
    return { email: u.email, name: u.name, role: u.role };
  }

  const store = await readLocalStore();
  const user = store.admins.find((a) => a.email.toLowerCase() === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return { email: user.email, name: user.name, role: user.role };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const doc = await SiteConfigModel.findOne({ key: "primary" }).lean();
    return normalizeDoc<SiteConfig>(doc);
  }
  const store = await readLocalStore();
  return store.config;
}

export async function updateSiteConfig(patch: Partial<SiteConfig>): Promise<SiteConfig> {
  const safePatch = { ...patch };
  delete safePatch.id;

  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const updated = await SiteConfigModel.findOneAndUpdate(
      { key: "primary" },
      { $set: safePatch },
      { new: true, upsert: true }
    ).lean();
    return normalizeDoc<SiteConfig>(updated);
  }

  const store = await readLocalStore();
  store.config = {
    ...store.config,
    ...safePatch,
    id: "primary",
    updatedAt: new Date().toISOString(),
  };
  await writeLocalStore(store);
  return store.config;
}

export async function listCollection<T>(key: CollectionKey): Promise<T[]> {
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const ModelRef = MODEL_MAP[key];
    const sortObj: Record<string, 1 | -1> =
      key === "registrations" || key === "media"
        ? { createdAt: -1 }
        : { order: 1, createdAt: 1 };
    const docs = await ModelRef.find().sort(sortObj).lean();
    return docs.map((d) => normalizeDoc<T>(d));
  }

  const store = await readLocalStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = [...(store[key] as any[])];
  if (key === "registrations" || key === "media") {
    items.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  } else {
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  return items as T[];
}

export async function createItem<T extends { id?: string }>(
  key: CollectionKey,
  data: Omit<T, "id">
): Promise<T> {
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const ModelRef = MODEL_MAP[key];
    const created = await ModelRef.create(data);
    return normalizeDoc<T>(created);
  }

  const store = await readLocalStore();
  const item = {
    ...data,
    id: makeId(),
    createdAt: new Date().toISOString(),
  } as unknown as T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store[key] as any[]).push(item);
  await writeLocalStore(store);
  return item;
}

export async function bulkCreateItems<T>(
  key: CollectionKey,
  items: Omit<T, "id">[]
): Promise<T[]> {
  if (!items.length) return [];
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const ModelRef = MODEL_MAP[key];
    const inserted = await ModelRef.insertMany(items);
    return inserted.map((d) => normalizeDoc<T>(d));
  }

  const store = await readLocalStore();
  const created = items.map((item) => ({
    ...item,
    id: makeId(),
    createdAt: new Date().toISOString(),
  })) as unknown as T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store[key] as any[]).push(...created);
  await writeLocalStore(store);
  return created;
}

export async function updateItem<T>(
  key: CollectionKey,
  id: string,
  patch: Partial<T>
): Promise<T | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safePatch: any = { ...patch };
  delete safePatch.id;
  delete safePatch._id;

  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const ModelRef = MODEL_MAP[key];
    const updated = await ModelRef.findByIdAndUpdate(id, { $set: safePatch }, { new: true }).lean();
    return updated ? normalizeDoc<T>(updated) : null;
  }

  const store = await readLocalStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = store[key] as any[];
  const idx = list.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...safePatch, id };
  await writeLocalStore(store);
  return list[idx] as T;
}

export async function deleteItem(key: CollectionKey, id: string): Promise<boolean> {
  const conn = await connectMongo();
  if (conn) {
    await ensureMongoSeeded();
    const ModelRef = MODEL_MAP[key];
    const res = await ModelRef.findByIdAndDelete(id);
    return Boolean(res);
  }

  const store = await readLocalStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = store[key] as any[];
  const before = list.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as any)[key] = list.filter((item) => item.id !== id);
  if (list.length !== before) {
    await writeLocalStore(store);
    return true;
  }
  return false;
}

export async function getFullSiteData(): Promise<FullSiteData> {
  const [config, banners, speakers, sessions, sponsors, themes, gallery, faqs, storageMode] =
    await Promise.all([
      getSiteConfig(),
      listCollection<Banner>("banners"),
      listCollection<Speaker>("speakers"),
      listCollection<Session>("sessions"),
      listCollection<Sponsor>("sponsors"),
      listCollection<ThemeTrack>("themes"),
      listCollection<GalleryItem>("gallery"),
      listCollection<Faq>("faqs"),
      getStorageMode(),
    ]);

  return {
    config,
    banners,
    speakers,
    sessions,
    sponsors,
    themes,
    gallery,
    faqs,
    storageMode,
  };
}
