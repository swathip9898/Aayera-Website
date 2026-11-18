import { NextResponse } from "next/server";
import { getStorageMode } from "@/lib/db/repository";

export async function GET() {
  const storageMode = await getStorageMode();
  return NextResponse.json({
    ok: true,
    storageMode,
    timestamp: new Date().toISOString(),
  });
}
