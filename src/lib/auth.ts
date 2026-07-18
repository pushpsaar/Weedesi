import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSION_COOKIE = "vedesi_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface AdminCreds {
  username: string;
  salt: string;
  hash: string;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your .env.local file."
    );
  }
  return secret;
}

async function getAdminCreds(): Promise<AdminCreds> {
  const raw = await fs.readFile(path.join(DATA_DIR, "admin.json"), "utf-8");
  return JSON.parse(raw) as AdminCreds;
}

export async function verifyAdminPassword(
  username: string,
  password: string
): Promise<boolean> {
  const creds = await getAdminCreds();
  if (username !== creds.username) return false;
  const hash = crypto.scryptSync(password, creds.salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(creds.hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sign(value: string): string {
  const secret = getSessionSecret();
  const sig = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const secret = getSessionSecret();
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

export async function createAdminSession(username: string): Promise<void> {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const token = sign(Buffer.from(payload).toString("base64url"));
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const value = unsign(token);
  if (!value) return null;
  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}
