import crypto from "crypto";
import { supabaseAdmin, ensureSupabaseSchema } from "./supabase";
import { cookies } from "next/headers";

const SESSION_COOKIE = "wedesi_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface AdminCreds {
  username: string;
  salt: string;
  hash: string;
}

const DEFAULT_ADMIN_USERNAME = "WEदेसी";

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
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("admin_credentials")
    .select("username, salt, hash")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Admin credentials not configured.");
  }

  return data;
}

async function writeAdminCreds(creds: AdminCreds): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin
    .from("admin_credentials")
    .upsert({ id: "default", ...creds });

  if (error) {
    throw error;
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export async function verifyAdminPassword(
  _username: string,
  password: string
): Promise<boolean> {
  const creds = await getAdminCreds();
  const salt = creds.salt;
  const storedHashRaw = creds.hash;

  if (!salt || !storedHashRaw) {
    // Defensive: getAdminCreds should guarantee these, but fail safe.
    throw new Error("Admin credentials are not properly configured.");
  }

  // Compute expected hash (hex) using the same algorithm used during seeding.
  const expectedHex = crypto.scryptSync(password, salt, 64).toString("hex");

  // Direct hex comparison (case-insensitive to tolerate hex casing differences).
  if (expectedHex === storedHashRaw || expectedHex === storedHashRaw.toLowerCase() || expectedHex === storedHashRaw.toUpperCase()) {
    const a = Buffer.from(expectedHex, "hex");
    const b = Buffer.from(storedHashRaw.replace(/^0x/, ""), "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  // Fallback: stored hash may be base64-encoded. Try decoding stored hash from base64
  // and compare the resulting hex to the expected hex.
  try {
    const decoded = Buffer.from(storedHashRaw, "base64").toString("hex");
    if (decoded === expectedHex) {
      const a = Buffer.from(expectedHex, "hex");
      const b = Buffer.from(decoded, "hex");
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    }
  } catch {
    // ignore decode errors and fall through to final false
  }

  // No match
  return false;
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
