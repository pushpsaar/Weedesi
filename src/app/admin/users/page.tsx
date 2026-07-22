"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserRoundX } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isBlocked?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?q=" + encodeURIComponent(query));
      const data = await res.json();
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [query]);

  async function toggleBlocked(user: UserRecord) {
    await fetch(`/api/admin/users?id=${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !user.isBlocked }),
    });
    loadUsers();
  }

  async function deleteUser(user: UserRecord) {
    await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
    loadUsers();
  }

  const filtered = useMemo(() => users.filter((user) => [user.name, user.email].some((value) => value.toLowerCase().includes(query.toLowerCase()))), [query, users]);

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-border bg-white/80 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-2xl text-dark">Customer Users</h1>
            <p className="mt-1 text-sm text-dark/55">Manage registered customers and their status.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-2">
            <Search size={16} className="text-dark/50" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="bg-transparent text-sm outline-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-border bg-white/80 shadow-sm">
        {loading ? (
          <div className="p-8 text-sm text-dark/55">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-sm text-dark/55">No users found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((user) => (
              <div key={user.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-dark">{user.name}</p>
                  <p className="text-sm text-dark/60">{user.email}</p>
                  <p className="mt-1 text-xs text-dark/45">Registered {new Date(user.createdAt).toLocaleDateString()} • Last login {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleBlocked(user)} className={`rounded-full px-3 py-2 text-sm ${user.isBlocked ? "bg-red-50 text-red-700" : "bg-dark text-white"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </button>
                  <button onClick={() => deleteUser(user)} className="rounded-full border border-border p-2 text-dark/60 hover:bg-red-50 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
