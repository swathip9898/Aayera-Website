import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin, apiError } from "@/lib/apiHelpers";
import { createItem, listCollection } from "@/lib/db/repository";
import type { MediaAsset } from "@/types/summit";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;
  const items = await listCollection<MediaAsset>("media");
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "uploads").replace(/[^a-z0-9_-]/gi, "");

    if (!file || !(file instanceof File)) {
      return apiError("No image file uploaded.");
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return apiError(`Unsupported image type: ${file.type}. Use PNG, JPG, WebP, GIF, AVIF, or SVG.`);
    }

    if (file.size > MAX_BYTES) {
      return apiError("File exceeds 10MB limit.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extFromName = path.extname(file.name).toLowerCase();
    const safeExt = extFromName && /^\.[a-z0-9]{2,5}$/.test(extFromName) ? extFromName : ".png";
    const uniqueName = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${safeExt}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, uniqueName), buffer);

    const url = `/uploads/${uniqueName}`;
    const asset = await createItem<MediaAsset>("media", {
      filename: uniqueName,
      originalName: file.name,
      url,
      mimeType: file.type,
      size: file.size,
      folder: folder || "uploads",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ asset, url }, { status: 201 });
  } catch (err) {
    console.error("Image upload error:", err);
    return apiError("Failed to upload image.", 500);
  }
}
