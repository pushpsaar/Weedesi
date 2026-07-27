import crypto from "crypto";

const SESSION_COOKIE = "wedesi_user_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Missing auth secret. Set SESSION_SECRET (or JWT_SECRET / NEXTAUTH_SECRET) in Vercel environment variables."
    );
  }

  return secret;
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

  const actual = Buffer.from(sig, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuf.length || !crypto.timingSafeEqual(actual, expectedBuf)) {
    return null;
  }

  return value;
}

export type UserSessionPayload = {
  userId: string;
  email: string;
  name: string;
  exp: number;
};

export function createSessionToken(payload: UserSessionPayload): string {
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return sign(value);
}

export function verifySessionToken(token: string): UserSessionPayload | null {
  const value = unsign(token);
  if (!value) return null;

  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf-8")) as UserSessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
