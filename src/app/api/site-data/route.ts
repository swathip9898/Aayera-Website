import { NextResponse } from "next/server";
import { getFullSiteData } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getFullSiteData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch site data:", err);
    return NextResponse.json({ error: "Failed to load site data" }, { status: 500 });
  }
}
