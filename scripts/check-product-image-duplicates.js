const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.local at', envPath);
  process.exit(1);
}

const envText = fs.readFileSync(envPath, 'utf8');
const env = envText.split(/\r?\n/).reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const idx = trimmed.indexOf('=');
  if (idx < 0) return acc;
  acc[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  return acc;
}, {});

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch },
});

(async () => {
  const { data, error } = await supabase.from('products').select('id,slug,name,variants');
  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  const imageMap = new Map();
  const products = data.map((product) => {
    const images = (product.variants || []).flatMap((variant) => variant.images || []);
    return { id: product.id, slug: product.slug, name: product.name, images };
  });

  console.log(`Product count: ${products.length}`);
  products.forEach((product) => {
    console.log(`${product.slug} | ${product.name} | ${product.images.join(', ')}`);
    product.images.forEach((image) => {
      if (!imageMap.has(image)) imageMap.set(image, []);
      imageMap.get(image).push(product.slug);
    });
  });

  const duplicates = Array.from(imageMap.entries()).filter(([, slugs]) => slugs.length > 1);
  if (duplicates.length === 0) {
    console.log('No duplicate image paths found across products.');
    return;
  }

  console.log('\nDuplicate image usage:');
  duplicates.forEach(([image, slugs]) => {
    console.log(`${image}: ${slugs.join(', ')}`);
  });
})();
