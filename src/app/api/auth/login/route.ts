import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/db/repository";
import { signSessionToken, setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signSessionToken(user);
    await setAdminSessionCookie(token);

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
