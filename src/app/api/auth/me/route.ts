import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { getUserById } from "@/lib/user-db";

export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    store.delete(SESSION_COOKIE);
    return NextResponse.json({ user: null });
  }

  const user = getUserById(payload.userId);
  if (!user || user.isBlocked) {
    store.delete(SESSION_COOKIE);
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
