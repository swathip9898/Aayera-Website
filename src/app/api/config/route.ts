import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateSiteConfig } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const updated = await updateSiteConfig(body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update config error:", err);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
