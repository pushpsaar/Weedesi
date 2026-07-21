import fs from "fs/promises";
import path from "path";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content-config";

const SITE_CONTENT_FILE = path.join(process.cwd(), "data", "site-content.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(SITE_CONTENT_FILE);
  } catch {
    await fs.mkdir(path.dirname(SITE_CONTENT_FILE), { recursive: true });
    await fs.writeFile(SITE_CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf-8");
  }
}

async function readJson(): Promise<SiteContent> {
  await ensureFile();
  const raw = await fs.readFile(SITE_CONTENT_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
      banners: parsed.banners ?? DEFAULT_SITE_CONTENT.banners,
      collections: parsed.collections ?? DEFAULT_SITE_CONTENT.collections,
      categoryImages: parsed.categoryImages ?? DEFAULT_SITE_CONTENT.categoryImages,
      promoSections: parsed.promoSections ?? DEFAULT_SITE_CONTENT.promoSections,
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...parsed.footer },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  return readJson();
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await ensureFile();
  await fs.writeFile(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
  return content;
}
