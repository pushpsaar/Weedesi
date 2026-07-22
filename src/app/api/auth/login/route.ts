import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sign(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function readUsers(): Promise<UserRecord[]> {
  const raw = await fs.readFile(USER_FILE, "utf-8");
  return JSON.parse(raw) as UserRecord[];
}

async function writeUsers(users: UserRecord[]) {
  await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === email);

    if (!user) {
      return NextResponse.json({ error: "Account does not exist." }, { status: 404 });
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: "This account has been blocked." }, { status: 403 });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const updated = users.map((entry) => entry.id === user.id ? { ...entry, lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : entry);
    await writeUsers(updated);

    const payload = JSON.stringify({ userId: user.id, email: user.email, name: user.name, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
    const token = sign(payload);
    const store = await cookies();
    store.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
