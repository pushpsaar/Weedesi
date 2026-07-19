import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, changeAdminPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current password and new password are required." },
      { status: 400 }
    );
  }

  if (newPassword.trim().length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters long." },
      { status: 400 }
    );
  }

  const changed = await changeAdminPassword(currentPassword, newPassword);
  if (!changed) {
    return NextResponse.json(
      { error: "Current password is incorrect or the request is invalid." },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
