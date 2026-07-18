# WEदेसी — Luxury Indian Fashion E-commerce

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev
```

## Environment variables (.env.local)

| Variable | Where to get it |
|---|---|
| `SESSION_SECRET` | Generate with `openssl rand -hex 32` — signs the admin login cookie |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Same page — **never commit this** |
| `RAZORPAY_WEBHOOK_SECRET` | Set when you create the webhook (see below) |

## Admin panel

- URL: `/admin/login`
- Default username: `admin`
- Default password: `vedesi@admin123`
- **Change this immediately** — the hash lives in `data/admin.json`. To generate a new one:
  ```bash
  node -e "
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync('YOUR_NEW_PASSWORD', salt, 64).toString('hex');
  console.log(JSON.stringify({ username: 'admin', salt, hash }, null, 2));
  "
  ```
  Paste the output into `data/admin.json`.

From the admin panel you can:
- **Dashboard** — revenue, order counts, recent orders at a glance
- **Products** — add, edit, delete products (name, SKU, price, sizes, stock, images, tags)
- **Orders** — see every order with customer details, items, and Razorpay payment status; update fulfilment status

## Adding product images

Images are never fetched from the internet. Drop image files into `public/products/` and reference
them by path (e.g. `/products/saree-red-1.jpg`) in the product form's image field.

## Razorpay setup

1. Get your Key ID and Key Secret from the Razorpay Dashboard and add them to `.env.local`.
2. In the Dashboard, go to Settings → Webhooks and add: `https://yourdomain.com/api/razorpay/webhook`,
   subscribing to `payment.captured`, `payment.failed`, and `refund.processed`. Use the same secret
   you set in `RAZORPAY_WEBHOOK_SECRET`.
3. Payment flow: `/checkout` → `/api/razorpay/create-order` → Razorpay checkout widget →
   `/api/razorpay/verify` (validates the signature server-side) → `/order/success` or `/order/failure`.

## Data storage

Products, orders, and coupons are stored as JSON files in `/data`. This is intentional for a fast
start — swap in a real database (Postgres, MongoDB, etc.) by replacing the functions in `src/lib/data.ts`
without touching any page or API route.
