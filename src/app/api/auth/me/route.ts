import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

const DATA_DIR = path.join(process.cwd(), "data");
const USER_COOKIE = "wedesi_user_session";
const USER_FILE = path.join(DATA_DIR, "users.json");

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isBlocked?: boolean;
}

function unsign(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

async function readUsers(): Promise<UserRecord[]> {
  const raw = await fs.readFile(USER_FILE, "utf-8");
  return JSON.parse(raw) as UserRecord[];
}

export async function GET() {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = unsign(token);
  if (!payload || payload.exp < Date.now()) {
    store.delete(USER_COOKIE);
    return NextResponse.json({ user: null });
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.id === payload.userId);
  if (!user || user.isBlocked) {
    store.delete(USER_COOKIE);
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
