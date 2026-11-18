import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getStorageMode } from "@/lib/db/repository";

export async function GET() {
  const [session, storageMode] = await Promise.all([getAdminSession(), getStorageMode()]);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null, storageMode });
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: session.email, name: session.name, role: session.role },
    storageMode,
  });
}
