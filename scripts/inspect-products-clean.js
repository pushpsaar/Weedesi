const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const env = envText.split(/\r?\n/).reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const idx = trimmed.indexOf('=');
  if (idx < 0) return acc;
  acc[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  return acc;
}, {});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch },
});

(async () => {
  const { data, error } = await supabase.from('products').select('id,slug,name,variants');
  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  data.forEach((product) => {
    const images = product.variants?.[0]?.images ?? [];
    console.log(`${product.slug} | ${product.name} | ${images.join(', ')}`);
  });
})();
