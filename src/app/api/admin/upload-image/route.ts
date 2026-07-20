import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";

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

    const filePath = path.join(process.cwd(), "public", relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const bytes = Buffer.from(await item.arrayBuffer());
    await fs.writeFile(filePath, bytes);

    uploaded.push(`/${relativePath}`);
  }

  return NextResponse.json({
    images: uploaded,
    path: replaceMode ? uploaded[0] : undefined,
  });
}
