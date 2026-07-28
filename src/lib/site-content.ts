import { supabaseAdmin, ensureSupabaseSchema } from "./supabase";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content-config";

export async function getSiteContent(): Promise<SiteContent> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin.from("site_content").select("content").eq("id", "default").maybeSingle();
  if (error) throw error;
  if (!data || !data.content) return DEFAULT_SITE_CONTENT;
  const parsed = data.content as Partial<SiteContent>;
  return {
    ...DEFAULT_SITE_CONTENT,
    ...parsed,
    hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero ?? {}) },
    banners: parsed.banners ?? DEFAULT_SITE_CONTENT.banners,
    collections: parsed.collections ?? DEFAULT_SITE_CONTENT.collections,
    categoryImages: parsed.categoryImages ?? DEFAULT_SITE_CONTENT.categoryImages,
    promoSections: parsed.promoSections ?? DEFAULT_SITE_CONTENT.promoSections,
    footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer ?? {}) },
  };
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin.from("site_content").upsert({ id: "default", content });
  if (error) throw error;
  return content;
}
