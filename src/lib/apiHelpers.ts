import { NextResponse } from "next/server";
import { getAdminSession } from "./auth";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Unauthorized. Please log in to Admin Panel." }, { status: 401 }),
    };
  }
  return { session, errorResponse: null };
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
