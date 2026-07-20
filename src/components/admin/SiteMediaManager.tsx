"use client";

import { useEffect, useState } from "react";

const DEFAULT_EXAMPLES = [
  "/slider/Slider image 1.jpeg",
  "/slider/Slider image 2.jpeg",
  "/products/your-image.jpg",
];

export default function SiteMediaManager() {
  const [targetPath, setTargetPath] = useState("/slider/Slider image 1.jpeg");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/api/admin/list-images");
        const data = await res.json();
        setImages(data.images ?? []);
      } catch {
        setImages([]);
      } finally {
        setLoadingImages(false);
      }
    }

    loadImages();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setError("Please choose an image file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("files", file);
      fd.append("targetPath", targetPath.trim());
      fd.append("replace", "true");

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Image replacement failed.");
        return;
      }

      setSuccess(`Updated ${data.path ?? targetPath} successfully.`);
      setFile(null);
    } catch {
      setError("Image replacement failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl text-dark">Site Media Manager</h2>
        <p className="text-sm text-dark/60">
          Replace any image asset used across the site by pointing to its public image path and uploading a new file.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-dark/60">
            Image path to replace
          </label>
          <input
            required
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            placeholder="/slider/Slider image 1.jpeg"
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
          <p className="mt-2 text-[11px] text-dark/45">
            Use a path like <span className="font-semibold">/slider/...</span> or <span className="font-semibold">/products/...</span>.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-dark/60">
            New image file
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-dark file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />

          {previewUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-bg">
              <img src={previewUrl} alt="Selected preview" className="max-h-48 w-full object-cover" />
            </div>
          )}
        </div>

        <div className="rounded-xl bg-bg px-3 py-2 text-xs text-dark/60">
          <p className="font-medium text-dark/70">Popular paths</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEFAULT_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setTargetPath(example)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-dark/70 hover:border-dark/40"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <p className="font-medium text-dark/70">Available public images</p>
            <div className="mt-2 max-h-32 overflow-auto rounded-lg border border-border bg-white p-2">
              {loadingImages ? (
                <p className="text-[11px] text-dark/45">Loading image list…</p>
              ) : images.length === 0 ? (
                <p className="text-[11px] text-dark/45">No public image assets found.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {images.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setTargetPath(image)}
                      className="rounded-md px-2 py-1 text-left text-[11px] text-dark/70 transition-colors hover:bg-bg"
                    >
                      {image}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">{success}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-full bg-dark px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {uploading ? "Replacing image…" : "Replace image"}
        </button>
      </form>
    </div>
  );
}
