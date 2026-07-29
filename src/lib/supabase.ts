import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { Pool } from "pg";
import type { Database } from "./database.types";

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type SupabaseRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type SupabaseTable<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: SupabaseRelationship[];
};

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  collection: string | null;
  description: string;
  fabric: string | null;
  wash_care: string | null;
  mrp: number;
  sale_price: number;
  variants: Json;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface OrderRow {
  id: string;
  user_id: string | null;
  items: Json;
  customer: Json;
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  status: string;
  payment: Json;
  created_at: string;
  updated_at: string;
}

export interface CouponRow {
  code: string;
  type: string;
  value: number;
  active: boolean;
  min_order_value: number | null;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_blocked: boolean;
}

export interface AdminCredsRow {
  id: string;
  username: string;
  salt: string;
  hash: string;
}

export interface SiteContentRow {
  id: string;
  content: Json;
}

let pool: Pool | null = null;
let schemaInitialized = false;

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  {
    auth: { persistSession: false },
    global: { fetch },
    db: { schema: "public" },
  }
);

function getDatabaseUrl(): string {
  const DATABASE_URL = process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL or SUPABASE_DATABASE_URL to your Supabase Postgres connection string."
    );
  }
  return DATABASE_URL;
}

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const databaseUrl = getDatabaseUrl();
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  return pool;
}

function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "public";
}

// Removed local JSON seed file dependencies to avoid filesystem reads in runtime.

export async function ensureSupabaseSchema(): Promise<void> {
  if (schemaInitialized) return;

  // Check required environment variables and provide clear diagnostics.
  const dbUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missingVars: string[] = [];
  if (!dbUrl) missingVars.push("DATABASE_URL or SUPABASE_DATABASE_URL");
  if (!supabaseUrl) missingVars.push("SUPABASE_URL");
  if (!supabaseServiceKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missingVars.length > 0) {
    console.error(
      "Supabase schema initialization skipped: missing environment variables:",
      missingVars.join(", ")
    );
    // Mark initialized to avoid repeated noisy checks during runtime when DB is absent.
    schemaInitialized = true;
    return;
  }

  const client = getPool();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT,
      is_blocked BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      category TEXT NOT NULL,
      collection TEXT,
      description TEXT NOT NULL,
      fabric TEXT,
      wash_care TEXT,
      mrp INTEGER NOT NULL,
      sale_price INTEGER NOT NULL,
      variants JSONB NOT NULL,
      tags TEXT[] NOT NULL,
      is_active BOOLEAN NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items JSONB NOT NULL,
      customer JSONB NOT NULL,
      subtotal INTEGER NOT NULL,
      gst INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      total INTEGER NOT NULL,
      coupon_code TEXT,
      status TEXT NOT NULL,
      payment JSONB NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      value INTEGER NOT NULL,
      active BOOLEAN NOT NULL,
      min_order_value INTEGER
    );

    CREATE TABLE IF NOT EXISTS admin_credentials (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      content JSONB NOT NULL
    );
  `);

  await migrateAdminCredentials();
  await migrateSiteContent();
  await migrateJsonUsers();
  await ensureStorageBucket();

  schemaInitialized = true;
}

async function migrateAdminCredentials(): Promise<void> {
  console.log("Starting migrateAdminCredentials");

  console.log("Checking existing admin");
  const check = await supabaseAdmin
    .from("admin_credentials")
    .select("id")
    .eq("id", "default")
    .maybeSingle();

  if (check.error) {
    console.error("Checking existing admin failed:", check.error);
    throw check.error;
  }

  if (check.data) {
    console.log("Existing admin found");

    // Verify the stored hash matches the expected hash for the seed password.
    console.log("Verifying stored hash against expected seed password");
    const stored = await supabaseAdmin
      .from("admin_credentials")
      .select("username, salt, hash")
      .eq("id", "default")
      .maybeSingle();

    if (stored.error) {
      console.error("Failed to fetch stored admin for verification:", stored.error);
      throw stored.error;
    }

    if (stored.data) {
      const storedSalt = stored.data.salt;
      const storedHash = stored.data.hash;
      // Compute expected hash for exact password 'wedesi@123' using scryptSync.
      const expected = crypto.scryptSync("wedesi@123", storedSalt, 64).toString("hex");
      if (expected !== storedHash) {
        console.error("Hash mismatch during verification.");

        // Recreate the admin_credentials row using a fresh salt and the exact password.
        console.log("Recreating default admin with expected seed password");
        const newSalt = crypto.randomBytes(16).toString("hex");
        const newHash = crypto.scryptSync("wedesi@123", newSalt, 64).toString("hex");

        const replace = await supabaseAdmin
          .from("admin_credentials")
          .upsert({ id: "default", username: stored.data.username || "WEदेसी", salt: newSalt, hash: newHash });

        if (replace.error) {
          console.error("Failed to recreate default admin:", replace.error);
          throw replace.error;
        }

        // Verify replacement
        const verify = await supabaseAdmin
          .from("admin_credentials")
          .select("salt, hash")
          .eq("id", "default")
          .maybeSingle();

        if (verify.error) {
          console.error("Verification after recreate failed:", verify.error);
          throw verify.error;
        }

        const reloadedSalt = verify.data?.salt;
        const reloadedHash = verify.data?.hash;
        const expected2 = crypto.scryptSync("wedesi@123", reloadedSalt, 64).toString("hex");
        if (expected2 !== reloadedHash) {
          console.error("Recreated hash does not match expected value after write.");
          throw new Error("Recreated admin hash mismatch");
        }

        console.log("Recreated default admin successfully; stored hash now matches expected seed password.");
      } else {
        console.log("Stored hash matches expected seed password");
      }
    }

    return;
  }

  console.log("Creating default admin");
  const defaultUsername = process.env.ADMIN_USERNAME || "WEदेसी";
  const defaultPassword = process.env.ADMIN_PASSWORD || "wedesi@123";

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(defaultPassword, salt, 64).toString("hex");

  // Try upsert first, fall back to insert on specific errors. Retry until the row is visible.
  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Attempt ${attempt}: performing upsert for default admin`);
    const upsertResult = await supabaseAdmin
      .from("admin_credentials")
      .upsert({ id: "default", username: defaultUsername, salt, hash });

    if (upsertResult.error) {
      console.error("Insert failed:", upsertResult.error);

      // If the error suggests ON CONFLICT/primary key issues, try a plain insert.
      const msg = String(upsertResult.error.message || "").toLowerCase();
      if (msg.includes("on conflict") || msg.includes("syntax") || msg.includes("column \"id\"")) {
        console.log("Upsert failed due to schema/primary-key issue; attempting insert instead");
        const insertResult = await supabaseAdmin.from("admin_credentials").insert([
          { id: "default", username: defaultUsername, salt, hash },
        ]);

        if (insertResult.error) {
          console.error("Insert failed:", insertResult.error);
          // If this was the last attempt, throw the error.
          if (attempt === maxAttempts) throw insertResult.error;
        } else {
          console.log("Insert successful");
        }
      } else {
        // For other errors, don't silently swallow them. Throw so they appear in logs.
        if (attempt === maxAttempts) throw upsertResult.error;
      }
    } else {
      console.log("Insert successful");
    }

    // Verify the row exists now.
    console.log("Verifying default admin exists after write");
    const verify = await supabaseAdmin
      .from("admin_credentials")
      .select("id")
      .eq("id", "default")
      .maybeSingle();

    if (verify.error) {
      console.error("Verification query failed:", verify.error);
      if (attempt === maxAttempts) throw verify.error;
    }

    if (verify.data) {
      console.log("Default admin is present in admin_credentials");

      // Ensure there is exactly one row with id='default'.
      const countCheck = await supabaseAdmin
        .from("admin_credentials")
        .select("id", { count: "exact", head: false })
        .eq("id", "default");

      if (countCheck.error) {
        console.error("Count check failed:", countCheck.error);
        if (attempt === maxAttempts) throw countCheck.error;
      } else {
        // countCheck.data will be an array; length should be 1
        const rows = Array.isArray(countCheck.data) ? countCheck.data.length : 0;
        console.log(`Rows with id='default': ${rows}`);
      }

      return;
    }

    // Wait before retrying.
    const delayMs = Math.min(1000 * attempt, 5000);
    console.log(`Row not visible yet, retrying after ${delayMs}ms`);
    await new Promise((res) => setTimeout(res, delayMs));
  }

  throw new Error("migrateAdminCredentials: failed to ensure default admin after retries");
}

async function migrateSiteContent(): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("id")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    console.error("Supabase site content check failed:", error);
    return;
  }

  // Do not read local site-content.json at runtime. Leave table empty if not present.
  if (data) return;
}

async function migrateJsonUsers(): Promise<void> {
  const { data, error } = await supabaseAdmin.from("users").select("id").limit(1);
  if (error) {
    console.error("Supabase users check failed:", error);
    return;
  }

  if (data && data.length > 0) {
    return;
  }
  // Do not seed users from local JSON files at runtime. User provisioning should
  // be performed through admin UI or migration scripts.
}

async function ensureStorageBucket(): Promise<void> {
  const bucket = getStorageBucket();

  const { data, error } = await supabaseAdmin.storage.listBuckets();
  if (error) {
    console.error("Supabase storage bucket list failed:", error);
    return;
  }

  const exists = data?.some((item) => item.name === bucket);
  if (!exists) {
    await supabaseAdmin.storage.createBucket(bucket, { public: true });
  }
}

export async function getSupabaseStorageBucketUrl(path: string): Promise<string> {
  const bucket = getStorageBucket();
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadSupabaseStorageFile(filePath: string, data: Buffer, contentType: string) {
  const bucket = getStorageBucket();
  await ensureStorageBucket();
  const { error } = await supabaseAdmin.storage.from(bucket).upload(filePath, data, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

export async function listSupabaseStorageFiles(prefix = ""): Promise<string[]> {
  const bucket = getStorageBucket();
  await ensureStorageBucket();

  const result: string[] = [];

  async function walk(folder: string) {
    const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder, {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error || !data) {
      return;
    }

for (const item of data) {
  result.push(folder ? `${folder}/${item.name}` : item.name);
}
} // <-- closes async function walk()

await walk(prefix);
return result;
} // <-- closes listSupabaseStorageFiles()