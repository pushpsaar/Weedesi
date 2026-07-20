import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
]);

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
      continue;
    }

    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }

  return results;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const files = await walk(publicDir);

  const images = files
    .map((fullPath) => {
      const relative = path.relative(publicDir, fullPath).split(path.sep).join("/");
      return `/${relative}`;
    })
    .sort();

  return NextResponse.json({ images });
}
