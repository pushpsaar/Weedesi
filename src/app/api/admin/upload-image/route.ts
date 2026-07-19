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

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(uploadDir, { recursive: true });

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
    const filePath = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await item.arrayBuffer());

    await fs.writeFile(filePath, bytes);
    uploaded.push(`/products/${fileName}`);
  }

  return NextResponse.json({ images: uploaded });
}
