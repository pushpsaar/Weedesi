import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ success: true, content });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await getSiteContent();
    const next = {
      ...current,
      ...body,
      hero: {
        ...current.hero,
        ...(body.hero ?? {}),
      },
      footer: {
        ...current.footer,
        ...(body.footer ?? {}),
      },
    };

    const saved = await saveSiteContent(next);
    return NextResponse.json({ success: true, content: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[site-content] Save failed:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
