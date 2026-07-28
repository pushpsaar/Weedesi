import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getAdminSession } from "@/lib/auth";
import { uploadSupabaseStorageFile, getSupabaseStorageBucketUrl } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files");
  const replacementTarget = (formData.get("targetPath") ?? "")?.toString().trim();
  const replaceMode = (formData.get("replace") ?? "false")?.toString().toLowerCase() === "true";

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
  }

  const uploaded: string[] = [];

  for (const item of files) {
    if (!(item instanceof File)) {
      continue;
    }

    if (!item.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const ext = path.extname(item.name).toLowerCase() || ".jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const relativePath = replaceMode && replacementTarget
      ? replacementTarget.replace(/^\/+/, "")
      : `products/${fileName}`;

    const bytes = Buffer.from(await item.arrayBuffer());
    const publicUrl = await uploadSupabaseStorageFile(relativePath, bytes, item.type || "image/jpeg");

    // Supabase public storage returns URLs without leading slash; convert to existing app expectation
    const urlPath = publicUrl.startsWith("/") ? publicUrl : new URL(publicUrl).pathname;
    uploaded.push(urlPath);
  }

  return NextResponse.json({
    images: uploaded,
    path: replaceMode ? uploaded[0] : undefined,
  });
}
