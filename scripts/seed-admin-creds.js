const crypto = require("crypto");
const { Pool } = require("pg");

function getDatabaseUrl() {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL or SUPABASE_DATABASE_URL env var.");
    process.exit(1);
  }
  return DATABASE_URL;
}

async function main() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl, ssl: databaseUrl.includes("supabase.co") ? { rejectUnauthorized: false } : undefined });

  const password = process.env.ADMIN_PASSWORD || "wedesi@123";
  const username = process.env.ADMIN_USERNAME || "WEदेसी";

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO admin_credentials (id, username, salt, hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, salt = EXCLUDED.salt, hash = EXCLUDED.hash;
    `, ["default", username, salt, hash]);

    console.log("Admin credentials upserted for id=default.");
  } catch (err) {
    console.error("Failed to upsert admin credentials:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
