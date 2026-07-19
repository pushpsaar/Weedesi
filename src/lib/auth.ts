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

const DEFAULT_ADMIN_USERNAME = "wedesi";

function getSessionSecret(): string {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Missing auth secret. Set SESSION_SECRET (or JWT_SECRET / NEXTAUTH_SECRET) in Vercel Environment Variables."
    );
  }

  return secret;
}

async function getAdminCreds(): Promise<AdminCreds> {
  const raw = await fs.readFile(path.join(DATA_DIR, "admin.json"), "utf-8");
  return JSON.parse(raw) as AdminCreds;
}

async function writeAdminCreds(creds: AdminCreds): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "admin.json"),
    JSON.stringify(creds, null, 2),
    "utf-8"
  );
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export async function verifyAdminPassword(
  _username: string,
  password: string
): Promise<boolean> {
  const creds = await getAdminCreds();
  const hash = hashPassword(password, creds.salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(creds.hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  if (!currentPassword || !newPassword || newPassword.trim().length < 6) {
    return false;
  }

  const creds = await getAdminCreds();
  const currentHash = hashPassword(currentPassword, creds.salt);
  const a = Buffer.from(currentHash, "hex");
  const b = Buffer.from(creds.hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return false;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const nextCreds: AdminCreds = {
    username: creds.username || DEFAULT_ADMIN_USERNAME,
    salt,
    hash: hashPassword(newPassword, salt),
  };

  await writeAdminCreds(nextCreds);
  return true;
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
    username: username || DEFAULT_ADMIN_USERNAME,
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
