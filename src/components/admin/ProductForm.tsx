"use client";

import { useState } from "react";
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
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [washCare, setWashCare] = useState(initial?.washCare ?? "");
  const [mrp, setMrp] = useState(initial?.mrp?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initial?.salePrice?.toString() ?? "");
  const [color, setColor] = useState(initial?.variants[0]?.color ?? "Default");
  const [colorHex, setColorHex] = useState(initial?.variants[0]?.colorHex ?? "#C8A96A");
  const [images, setImages] = useState(
    initial?.variants[0]?.images.join(", ") ?? ""
  );
  const [sizes, setSizes] = useState<Size[]>(
    initial?.variants[0]?.sizes.map((s) => s.size) ?? ["S", "M", "L"]
  );
  const [stock, setStock] = useState(
    initial?.variants[0]?.sizes[0]?.stock?.toString() ?? "10"
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  function toggleSize(s: Size) {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError("");
    setUploadMessage("");

    try {
      const fd = new FormData();
      Array.from(files).forEach((file) => fd.append("files", file));

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Image upload failed.");
        return;
      }

      const uploaded = data.images ?? [];
      const existing = images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const merged = Array.from(new Set([...existing, ...uploaded]));
      setImages(merged.join(", "));
      setUploadMessage(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} added to the product.`);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
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
          images: images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          sizes: sizes.map((s) => ({ size: s, stock: Number(stock) || 0 })),
        },
      ],
    };

    try {
      const res = await fetch(
        initial ? `/api/products/${initial.id}` : "/api/products",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
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
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="SKU">
          <input required value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Category">
        <input
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. sarees, kurtas"
          className={inputClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fabric">
          <input value={fabric} onChange={(e) => setFabric(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Wash Care">
          <input value={washCare} onChange={(e) => setWashCare(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="MRP (₹)">
          <input type="number" min="0" value={mrp} onChange={(e) => setMrp(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Sale Price (₹)">
          <input
            required
            type="number"
            min="0"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Color Name">
          <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Color Swatch">
          <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="h-10 w-full rounded-lg border border-border" />
        </Field>
      </div>

      <Field label="Product Showcase Images">
        <div className="space-y-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-dark file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          <input
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className={inputClass}
            placeholder="/products/hero.jpg, /products/hero-2.jpg"
          />
        </div>
      </Field>
      <p className="-mt-4 text-xs text-dark/40">
        Upload images directly from this admin form. They will be saved under <code>/public/products/</code> and added to the product gallery paths.
      </p>
      {uploadingImages && <p className="-mt-4 text-xs text-gold-dark">Uploading images…</p>}
      {uploadMessage && <p className="-mt-4 text-xs text-gold-dark">{uploadMessage}</p>}

      <Field label="Available Sizes">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleSize(s)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                sizes.includes(s)
                  ? "border-dark bg-dark text-white"
                  : "border-border text-dark/60 hover:border-dark/40"
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
                tags.includes(t)
                  ? "border-gold bg-gold/15 text-gold-dark"
                  : "border-border text-dark/60 hover:border-dark/40"
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

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-dark px-7 py-3 text-sm font-medium text-white hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {saving ? "Saving…" : initial ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-dark/60">{label}</label>
      {children}
    </div>
  );
}
