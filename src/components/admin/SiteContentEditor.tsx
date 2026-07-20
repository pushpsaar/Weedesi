"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content-config";

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none";

export default function SiteContentEditor() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/site-content");
        const data = await res.json();
        if (data.success && data.content) {
          setContent(data.content);
        }
      } catch {
        setError("Unable to load website content.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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

      setContent(data.content);
      setMessage("Website content updated successfully.");
    } catch {
      setError("Unable to save website content.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-border bg-white p-6 text-sm text-dark/60">Loading content editor…</div>;
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl text-dark">Website Content</h2>
        <p className="text-sm text-dark/60">Update the homepage and footer content without touching the code.</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-bg p-4">
          <h3 className="font-heading text-xl text-dark">Hero</h3>
          <label className="block text-xs font-medium text-dark/60">Hero image path</label>
          <input
            value={content.hero.image}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, image: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Hero title</label>
          <input
            value={content.hero.title}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Hero subtitle</label>
          <textarea
            rows={3}
            value={content.hero.subtitle}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Hero button text</label>
          <input
            value={content.hero.buttonText}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, buttonText: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Hero button link</label>
          <input
            value={content.hero.buttonLink}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, buttonLink: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-bg p-4">
          <h3 className="font-heading text-xl text-dark">Footer</h3>
          <label className="block text-xs font-medium text-dark/60">Footer logo</label>
          <input
            value={content.footer.logo}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, logo: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Footer text</label>
          <textarea
            rows={3}
            value={content.footer.text}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, text: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Email</label>
          <input
            value={content.footer.email}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Phone</label>
          <input
            value={content.footer.phone}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, phone: e.target.value } })}
            className={inputClass}
          />
          <label className="block text-xs font-medium text-dark/60">Instagram</label>
          <input
            value={content.footer.instagram}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, instagram: e.target.value } })}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      {message && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">{message}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Website Content"}
        </button>
      </div>
    </div>
  );
}
