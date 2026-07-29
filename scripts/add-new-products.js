const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");

function parseEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  return lines.reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return env;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=");
    return env;
  }, {});
}

const envPath = path.resolve(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Could not find .env.local at", envPath);
  process.exit(1);
}

const env = parseEnv(envPath);
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch },
});

const products = [
  {
    id: randomUUID(),
    slug: "nandini-rose-kurti",
    name: "Nandini Rose Kurti",
    sku: "NAND-01",
    category: "kurtas",
    collection: "Anugrah",
    description: "A red printed cotton kurti with delicate motifs and modern cut details.",
    fabric: "cotton",
    wash_care: "gentle wash",
    mrp: 2399,
    sale_price: 1499,
    variants: [
      {
        color: "Ruby",
        colorHex: "#8b1a1a",
        images: ["/products/product-13.jpeg", "/products/product-14.jpeg"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 14 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 8 },
        ],
      },
    ],
    tags: ["sale", "new"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    slug: "noir-ikat-kurti",
    name: "Noir Ikat Kurti",
    sku: "NOIR-02",
    category: "kurtas",
    collection: "Anugrah",
    description: "A sophisticated black printed kurti with modern block printing and refined silhouette.",
    fabric: "cotton",
    wash_care: "cold wash",
    mrp: 2499,
    sale_price: 1599,
    variants: [
      {
        color: "Noir",
        colorHex: "#121212",
        images: ["/products/product-15.jpeg", "/products/product-16.jpeg"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 },
        ],
      },
    ],
    tags: ["sale", "new"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    slug: "saffron-muse-kurti",
    name: "Saffron Muse Kurti",
    sku: "SAFF-03",
    category: "kurtas",
    collection: "Anugrah",
    description: "A warm yellow-green printed kurti with a graceful neckline and soft cotton finish.",
    fabric: "cotton",
    wash_care: "gentle wash",
    mrp: 2299,
    sale_price: 1399,
    variants: [
      {
        color: "Saffron",
        colorHex: "#b78f37",
        images: ["/products/product-17.jpeg", "/products/product-18.jpeg"],
        sizes: [
          { size: "S", stock: 11 },
          { size: "M", stock: 12 },
          { size: "L", stock: 11 },
          { size: "XL", stock: 7 },
        ],
      },
    ],
    tags: ["sale", "new"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    slug: "crimson-blossom-kurti",
    name: "Crimson Blossom Kurti",
    sku: "CRIM-04",
    category: "kurtas",
    collection: "Anugrah",
    description: "A vivid crimson cotton kurti with elegant florals and a flattering fit for occasions.",
    fabric: "cotton",
    wash_care: "cold wash",
    mrp: 2499,
    sale_price: 1499,
    variants: [
      {
        color: "Crimson",
        colorHex: "#9c1a24",
        images: ["/products/product-19.jpeg", "/products/product-20.jpeg"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 11 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 8 },
        ],
      },
    ],
    tags: ["sale", "new"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

async function main() {
  for (const product of products) {
    const { data, error } = await supabase.from("products").upsert(product, {
      onConflict: "slug",
    });

    if (error) {
      console.error("Failed to save product", product.slug, error.message || error);
    } else {
      console.log("Saved product", product.slug, "id", product.id);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
