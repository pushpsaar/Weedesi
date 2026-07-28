import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listSupabaseStorageFiles } from "@/lib/supabase";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await listSupabaseStorageFiles();
  // normalize paths to start with /
  const images = files.map((p) => (p.startsWith("/") ? p : `/${p}`)).sort();
  return NextResponse.json({ images });
}
