"use client";

import { useState } from "react";

export default function AdminPasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Unable to change password.");
        return;
      }

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-dark/50">Change Password</p>
      <input
        type="password"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current password"
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      <input
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
      {success && <p className="text-xs text-green-700">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-dark px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
      >
        {loading ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
