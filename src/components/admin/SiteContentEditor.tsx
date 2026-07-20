"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content-config";

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none";

const cardClass = "rounded-2xl border border-border bg-bg p-4 shadow-sm";

export default function SiteContentEditor() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [originalContent, setOriginalContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasChanges = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(originalContent);
  }, [content, originalContent]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/site-content");
        const data = await res.json();
        if (data.success && data.content) {
          setContent(data.content);
          setOriginalContent(data.content);
        }
      } catch {
        setError("Unable to load website content.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const handler = () => {
      if (hasChanges) {
        window.confirm("You have unsaved changes. Leave this page?");
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Unable to save website content.");
        return;
      }

      setOriginalContent(data.content);
      setContent(data.content);
      setMessage("Website content updated successfully.");
    } catch {
      setError("Unable to save website content.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setContent(originalContent);
    setMessage("Changes reset.");
    setError("");
  }

  async function handleUpload(target: "hero" | "banner" | "collection" | "category" | "promo", index?: number) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "image/png,image/jpeg,image/webp,image/svg+xml";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(true);
      setUploadProgress(0);
      setError("");

      try {
        const compressed = await compressImage(file);
        const uploaded = await uploadWithProgress(compressed, (value) => setUploadProgress(value));

        const imagePath = uploaded.images[0];
        if (!imagePath) {
          throw new Error("No image returned from upload.");
        }

        if (target === "hero") {
          const images = [...content.hero.images, imagePath];
          setContent((current) => ({
            ...current,
            hero: { ...current.hero, images, primaryImage: current.hero.primaryImage || imagePath },
          }));
        }

        if (target === "banner" && typeof index === "number") {
          setContent((current) => ({
            ...current,
            banners: current.banners.map((item, itemIndex) =>
              itemIndex === index ? { ...item, image: imagePath } : item
            ),
          }));
        }

        if (target === "collection" && typeof index === "number") {
          setContent((current) => ({
            ...current,
            collections: current.collections.map((item, itemIndex) =>
              itemIndex === index ? { ...item, image: imagePath } : item
            ),
          }));
        }

        if (target === "category" && typeof index === "number") {
          setContent((current) => ({
            ...current,
            categoryImages: current.categoryImages.map((item, itemIndex) =>
              itemIndex === index ? { ...item, image: imagePath } : item
            ),
          }));
        }

        if (target === "promo" && typeof index === "number") {
          setContent((current) => ({
            ...current,
            promoSections: current.promoSections.map((item, itemIndex) =>
              itemIndex === index ? { ...item, image: imagePath } : item
            ),
          }));
        }

        setMessage("Image uploaded successfully.");
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };

    input.click();
  }

  function updateHeroImageOrder(direction: "up" | "down", index: number) {
    setContent((current) => {
      const nextImages = [...current.hero.images];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= nextImages.length) return current;
      [nextImages[index], nextImages[swapIndex]] = [nextImages[swapIndex], nextImages[index]];
      return { ...current, hero: { ...current.hero, images: nextImages } };
    });
  }

  function removeHeroImage(index: number) {
    setContent((current) => {
      const nextImages = current.hero.images.filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        hero: {
          ...current.hero,
          images: nextImages,
          primaryImage: current.hero.primaryImage === current.hero.images[index] ? nextImages[0] ?? "" : current.hero.primaryImage,
        },
      };
    });
  }

  function addBanner() {
    setContent((current) => ({
      ...current,
      banners: [
        ...current.banners,
        {
          id: `banner-${Date.now()}`,
          title: "New Banner",
          description: "Write a new homepage banner message.",
          image: "/slider/Slider image 2.jpeg",
          link: "/shop",
          enabled: true,
        },
      ],
    }));
  }

  function addCollection() {
    setContent((current) => ({
      ...current,
      collections: [
        ...current.collections,
        {
          id: `collection-${Date.now()}`,
          image: "/slider/Slider image 3.jpeg",
          name: "New Collection",
          description: "Describe this collection.",
          link: "/shop",
        },
      ],
    }));
  }

  function addCategory() {
    setContent((current) => ({
      ...current,
      categoryImages: [
        ...current.categoryImages,
        {
          id: `category-${Date.now()}`,
          name: "New Category",
          image: "/slider/Slider image 1.jpeg",
          link: "/shop",
        },
      ],
    }));
  }

  function addPromo() {
    setContent((current) => ({
      ...current,
      promoSections: [
        ...current.promoSections,
        {
          id: `promo-${Date.now()}`,
          title: "New Promo",
          description: "Write the promo description.",
          image: "/slider/Slider image 4.jpeg",
          buttonText: "Shop Now",
          buttonLink: "/shop",
          enabled: true,
        },
      ],
    }));
  }

  if (loading) {
    return <div className="rounded-2xl border border-border bg-white p-6 text-sm text-dark/60">Loading content editor…</div>;
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-2xl text-dark">Website Content Manager</h2>
          <p className="text-sm text-dark/60">
            Control hero, banners, collections, category images, promotions, and footer content from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-dark/20 px-4 py-2 text-sm text-dark transition-colors hover:border-dark"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-dark/70">
          Uploading image… {uploadProgress}%
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">{message}</p>}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className={cardClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">1. Hero Section</h3>
            <button type="button" onClick={() => handleUpload("hero")} className="rounded-full bg-dark px-3 py-1.5 text-xs text-white">Upload Hero Image</button>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-dark/60">Hero Title</label>
            <input value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Hero Subtitle</label>
            <textarea rows={3} value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Hero Button Text</label>
            <input value={content.hero.buttonText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, buttonText: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Hero Button Link</label>
            <input value={content.hero.buttonLink} onChange={(e) => setContent({ ...content, hero: { ...content.hero, buttonLink: e.target.value } })} className={inputClass} />

            <div className="rounded-xl border border-border bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">Hero Images</span>
              </div>
              <div className="space-y-2">
                {content.hero.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="flex flex-col gap-2 rounded-lg border border-border bg-bg p-2 md:flex-row md:items-center">
                    <img src={image} alt={`Hero preview ${index + 1}`} className="h-16 w-24 rounded-md object-cover" />
                    <div className="flex flex-1 flex-wrap gap-2">
                      <button type="button" onClick={() => setContent((current) => ({ ...current, hero: { ...current.hero, primaryImage: image } }))} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Set Primary</button>
                      <button type="button" onClick={() => updateHeroImageOrder("up", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Move Up</button>
                      <button type="button" onClick={() => updateHeroImageOrder("down", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Move Down</button>
                      <button type="button" onClick={() => removeHeroImage(index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Delete</button>
                    </div>
                    <span className="text-[11px] text-dark/50">{image}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">2. Homepage Banners</h3>
            <button type="button" onClick={addBanner} className="rounded-full bg-dark px-3 py-1.5 text-xs text-white">Add Banner</button>
          </div>
          <div className="space-y-3">
            {content.banners.map((banner, index) => (
              <div key={banner.id} className="rounded-xl border border-border bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">Banner {index + 1}</span>
                  <button type="button" onClick={() => handleUpload("banner", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Replace Image</button>
                </div>
                <img src={banner.image} alt={banner.title} className="mb-3 h-28 w-full rounded-lg object-cover" />
                <input value={banner.title} onChange={(e) => setContent((current) => ({ ...current, banners: current.banners.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item) }))} className={inputClass} />
                <textarea rows={2} value={banner.description} onChange={(e) => setContent((current) => ({ ...current, banners: current.banners.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <input value={banner.link} onChange={(e) => setContent((current) => ({ ...current, banners: current.banners.map((item, itemIndex) => itemIndex === index ? { ...item, link: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <label className="mt-3 flex items-center gap-2 text-xs text-dark/60">
                  <input type="checkbox" checked={banner.enabled} onChange={(e) => setContent((current) => ({ ...current, banners: current.banners.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: e.target.checked } : item) }))} />
                  Enable banner
                </label>
                <button type="button" onClick={() => setContent((current) => ({ ...current, banners: current.banners.filter((_, itemIndex) => itemIndex !== index) }))} className="mt-3 rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-700">Delete Banner</button>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">3. Collections</h3>
            <button type="button" onClick={addCollection} className="rounded-full bg-dark px-3 py-1.5 text-xs text-white">Add Collection</button>
          </div>
          <div className="space-y-3">
            {content.collections.map((collection, index) => (
              <div key={collection.id} className="rounded-xl border border-border bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">Collection {index + 1}</span>
                  <button type="button" onClick={() => handleUpload("collection", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Replace Image</button>
                </div>
                <img src={collection.image} alt={collection.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
                <input value={collection.name} onChange={(e) => setContent((current) => ({ ...current, collections: current.collections.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item) }))} className={inputClass} />
                <textarea rows={2} value={collection.description} onChange={(e) => setContent((current) => ({ ...current, collections: current.collections.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <input value={collection.link} onChange={(e) => setContent((current) => ({ ...current, collections: current.collections.map((item, itemIndex) => itemIndex === index ? { ...item, link: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <button type="button" onClick={() => setContent((current) => ({ ...current, collections: current.collections.filter((_, itemIndex) => itemIndex !== index) }))} className="mt-3 rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-700">Delete Collection</button>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">4. Category Images</h3>
            <button type="button" onClick={addCategory} className="rounded-full bg-dark px-3 py-1.5 text-xs text-white">Add Category Image</button>
          </div>
          <div className="space-y-3">
            {content.categoryImages.map((category, index) => (
              <div key={category.id} className="rounded-xl border border-border bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">Category {index + 1}</span>
                  <button type="button" onClick={() => handleUpload("category", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Replace Image</button>
                </div>
                <img src={category.image} alt={category.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
                <input value={category.name} onChange={(e) => setContent((current) => ({ ...current, categoryImages: current.categoryImages.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item) }))} className={inputClass} />
                <input value={category.link} onChange={(e) => setContent((current) => ({ ...current, categoryImages: current.categoryImages.map((item, itemIndex) => itemIndex === index ? { ...item, link: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <button type="button" onClick={() => setContent((current) => ({ ...current, categoryImages: current.categoryImages.filter((_, itemIndex) => itemIndex !== index) }))} className="mt-3 rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-700">Delete Category</button>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">5. Promotional Sections</h3>
            <button type="button" onClick={addPromo} className="rounded-full bg-dark px-3 py-1.5 text-xs text-white">Add Promo</button>
          </div>
          <div className="space-y-3">
            {content.promoSections.map((promo, index) => (
              <div key={promo.id} className="rounded-xl border border-border bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">Promo {index + 1}</span>
                  <button type="button" onClick={() => handleUpload("promo", index)} className="rounded-full border border-border px-2.5 py-1 text-[11px]">Replace Image</button>
                </div>
                <img src={promo.image} alt={promo.title} className="mb-3 h-28 w-full rounded-lg object-cover" />
                <input value={promo.title} onChange={(e) => setContent((current) => ({ ...current, promoSections: current.promoSections.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item) }))} className={inputClass} />
                <textarea rows={2} value={promo.description} onChange={(e) => setContent((current) => ({ ...current, promoSections: current.promoSections.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <input value={promo.buttonText} onChange={(e) => setContent((current) => ({ ...current, promoSections: current.promoSections.map((item, itemIndex) => itemIndex === index ? { ...item, buttonText: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <input value={promo.buttonLink} onChange={(e) => setContent((current) => ({ ...current, promoSections: current.promoSections.map((item, itemIndex) => itemIndex === index ? { ...item, buttonLink: e.target.value } : item) }))} className={`${inputClass} mt-3`} />
                <label className="mt-3 flex items-center gap-2 text-xs text-dark/60">
                  <input type="checkbox" checked={promo.enabled} onChange={(e) => setContent((current) => ({ ...current, promoSections: current.promoSections.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: e.target.checked } : item) }))} />
                  Enable promo section
                </label>
                <button type="button" onClick={() => setContent((current) => ({ ...current, promoSections: current.promoSections.filter((_, itemIndex) => itemIndex !== index) }))} className="mt-3 rounded-full border border-red-200 px-3 py-1 text-[11px] text-red-700">Delete Promo</button>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <h3 className="font-heading text-xl text-dark">6. Footer</h3>
          <div className="mt-3 space-y-3">
            <label className="block text-xs font-medium text-dark/60">Footer Logo</label>
            <input value={content.footer.logo} onChange={(e) => setContent({ ...content, footer: { ...content.footer, logo: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Footer Description</label>
            <textarea rows={3} value={content.footer.description} onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Email</label>
            <input value={content.footer.email} onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Phone</label>
            <input value={content.footer.phone} onChange={(e) => setContent({ ...content, footer: { ...content.footer, phone: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Instagram</label>
            <input value={content.footer.instagram} onChange={(e) => setContent({ ...content, footer: { ...content.footer, instagram: e.target.value } })} className={inputClass} />
            <label className="block text-xs font-medium text-dark/60">Copyright Text</label>
            <input value={content.footer.copyright} onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })} className={inputClass} />
          </div>
        </section>
      </div>
    </div>
  );
}

async function compressImage(file: File): Promise<File> {
  if (file.size < 400 * 1024) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, file.type === "image/svg+xml" ? "image/png" : file.type, 0.78)
  );

  if (!blob) {
    return file;
  }

  return new File([blob], file.name, { type: blob.type, lastModified: Date.now() });
}

async function uploadWithProgress(file: File, onProgress: (value: number) => void) {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("folder", "uploads");

  return new Promise<{ images: string[] }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload-image");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Upload response was invalid."));
        }
      } else {
        reject(new Error("Image upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Image upload failed."));
    xhr.send(formData);
  });
}
