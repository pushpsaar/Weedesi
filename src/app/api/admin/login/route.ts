import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, createAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 }
    );
  }

  const valid = await verifyAdminPassword("wedesi", password);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid password." },
      { status: 401 }
    );
  }

  await createAdminSession("wedesi");
  return NextResponse.json({ ok: true });
}
