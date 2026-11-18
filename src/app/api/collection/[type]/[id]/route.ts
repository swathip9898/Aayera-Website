import { NextRequest, NextResponse } from "next/server";
import { updateItem, deleteItem } from "@/lib/db/repository";
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { type, id } = await context.params;
  if (!VALID_TYPES.has(type)) {
    return apiError(`Invalid collection type: ${type}`, 404);
  }

  try {
    const body = await req.json();
    const updated = await updateItem(type as ValidType, id, body);
    if (!updated) {
      return apiError("Item not found", 404);
    }
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error(`Update ${type}/${id} error:`, err);
    return apiError("Failed to update item", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { type, id } = await context.params;
  if (!VALID_TYPES.has(type)) {
    return apiError(`Invalid collection type: ${type}`, 404);
  }

  try {
    const deleted = await deleteItem(type as ValidType, id);
    if (!deleted) {
      return apiError("Item not found", 404);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`Delete ${type}/${id} error:`, err);
    return apiError("Failed to delete item", 500);
  }
}
