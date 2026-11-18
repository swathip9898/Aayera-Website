import { NextRequest, NextResponse } from "next/server";
import { listCollection, createItem } from "@/lib/db/repository";
import { requireAdmin, apiError } from "@/lib/apiHelpers";

const VALID_TYPES = new Set([
  "banners",
  "speakers",
  "sessions",
  "sponsors",
  "themes",
  "gallery",
  "faqs",
  "registrations",
  "media",
]);

type ValidType =
  | "banners"
  | "speakers"
  | "sessions"
  | "sponsors"
  | "themes"
  | "gallery"
  | "faqs"
  | "registrations"
  | "media";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  if (!VALID_TYPES.has(type)) {
    return apiError(`Invalid collection type: ${type}`, 404);
  }

  // Registrations & media library listing require admin auth
  if (type === "registrations" || type === "media") {
    const { errorResponse } = await requireAdmin();
    if (errorResponse) return errorResponse;
  }

  try {
    const items = await listCollection(type as ValidType);
    return NextResponse.json({ items });
  } catch (err) {
    console.error(`List ${type} error:`, err);
    return apiError(`Failed to list ${type}`, 500);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  if (!VALID_TYPES.has(type)) {
    return apiError(`Invalid collection type: ${type}`, 404);
  }

  // Public visitors can submit registrations; all other creates require admin
  if (type !== "registrations") {
    const { errorResponse } = await requireAdmin();
    if (errorResponse) return errorResponse;
  }

  try {
    const body = await req.json();
    if (type === "registrations") {
      if (!body.fullName || !body.email || !body.company) {
        return apiError("Full name, email, and company are required.");
      }
      body.status = "New";
    }
    const created = await createItem(type as ValidType, body);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err) {
    console.error(`Create ${type} error:`, err);
    return apiError(`Failed to create ${type} item`, 500);
  }
}
