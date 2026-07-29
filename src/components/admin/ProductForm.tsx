"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Size } from "@/lib/types";

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_TAGS = ["new-arrival", "best-seller", "sale"];

interface Props {
  initial?: Product;
}

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [washCare, setWashCare] = useState(initial?.washCare ?? "");
  const [mrp, setMrp] = useState(initial?.mrp?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initial?.salePrice?.toString() ?? "");
  const [color, setColor] = useState(initial?.variants[0]?.color ?? "Default");
  const [colorHex, setColorHex] = useState(initial?.variants[0]?.colorHex ?? "#C8A96A");
  const [imageEntries, setImageEntries] = useState<string[]>(initial?.variants[0]?.images ?? []);
  const [sizes, setSizes] = useState<Size[]>(initial?.variants[0]?.sizes.map((s) => s.size) ?? ["S", "M", "L"]);
  const [stock, setStock] = useState(initial?.variants[0]?.sizes[0]?.stock?.toString() ?? "10");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const previewImages = useMemo(() => imageEntries.filter(Boolean), [imageEntries]);

  function toggleSize(s: Size) {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function addImageSlot() {
    setImageEntries((prev) => [...prev, ""]);
  }

  function removeImageSlot(index: number) {
    setImageEntries((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function uploadImageForSlot(index: number, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImages(true);
    setError("");
    setUploadMessage("");

    try {
      const fd = new FormData();
      fd.append("files", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Image upload failed.");
        return;
      }

      const uploaded = data.images?.[0];
      if (!uploaded) {
        setError("The image could not be saved.");
        return;
      }

      setImageEntries((prev) => {
        const next = [...prev];
        next[index] = uploaded;
        return next;
      });
      setUploadMessage("Image uploaded and linked to the product.");
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      slug: slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      sku,
      category,
      description,
      fabric,
      washCare,
      mrp: Number(mrp) || Number(salePrice),
      salePrice: Number(salePrice),
      tags,
      isActive,
      variants: [
        {
          color,
          colorHex,
          images: imageEntries.filter(Boolean),
          sizes: sizes.map((s) => ({ size: s, stock: Number(stock) || 0 })),
        },
      ],
    };

    try {
      const res = await fetch(initial ? `/api/products/${initial.id}` : "/api/products", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-4xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product Name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} placeholder="e.g. crimson-silk-kurta" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SKU">
          <input required value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Category">
          <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. kurtas" className={inputClass} />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Fabric">
          <input value={fabric} onChange={(e) => setFabric(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Wash Care">
          <input value={washCare} onChange={(e) => setWashCare(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="MRP (₹)">
          <input type="number" min="0" value={mrp} onChange={(e) => setMrp(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Sale Price (₹)">
          <input required type="number" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Color Name">
          <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Color Swatch">
          <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="h-10 w-full rounded-lg border border-border" />
        </Field>
      </div>

      <Field label="Product Images">
        <div className="space-y-3 rounded-[1.4rem] border border-border/70 bg-[#7a0000] p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/80">Upload, replace, preview, and reorder images for this product.</p>
            <button type="button" onClick={addImageSlot} className="rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/15">
              Add image
            </button>
          </div>

          {previewImages.length === 0 && (
            <div className="rounded-[1rem] border border-dashed border-border/70 p-6 text-center text-sm text-dark/45">
              No images yet. Add a primary image to start.
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {imageEntries.map((image, index) => (
              <div
                key={`${image}-${index}`}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedIndex === null || draggedIndex === index) return;
                  const next = [...imageEntries];
                  const [moved] = next.splice(draggedIndex, 1);
                  next.splice(index, 0, moved);
                  setImageEntries(next);
                  setDraggedIndex(null);
                }}
                className="rounded-[1rem] border border-border/70 bg-white p-3 shadow-sm"
              >
                {image ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[0.8rem]">
                    <Image src={image} alt={`Product image ${index + 1}`} fill className="object-cover" sizes="240px" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center rounded-[0.8rem] border border-dashed border-border/70 text-sm text-dark/45">
                    Empty slot
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer rounded-full bg-[#7a0000] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    <span>Replace</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadImageForSlot(index, event)} />
                  </label>
                  <button type="button" onClick={() => removeImageSlot(index)} className="rounded-full border border-border/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark/70">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Field>

      {uploadingImages && <p className="-mt-4 text-xs text-[#7a0000]">Uploading images…</p>}
      {uploadMessage && <p className="-mt-4 text-xs text-[#7a0000]">{uploadMessage}</p>}

      <Field label="Available Sizes">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleSize(s)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                sizes.includes(s) ? "border-[#7a0000] bg-[#7a0000] text-white" : "border-border text-dark/60 hover:border-[#7a0000]/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Stock per size">
        <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Tags">
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleTag(t)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                tags.includes(t) ? "border-[#7a0000] bg-[#7a0000]/10 text-[#7a0000]" : "border-border text-dark/60 hover:border-[#7a0000]/40"
              }`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-2 text-sm text-dark/70">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Visible on storefront
      </label>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="rounded-full bg-dark px-7 py-3 text-sm font-medium text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-[#7a0000] focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-dark/60">{label}</label>
      {children}
    </div>
  );
}
