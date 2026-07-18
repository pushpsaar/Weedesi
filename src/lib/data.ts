import fs from "fs/promises";
import path from "path";
import { Product, Order, Coupon } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// ---------- Products ----------

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>("products.json");
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.isActive);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function saveProduct(product: Product): Promise<void> {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  await writeJson("products.json", products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  await writeJson(
    "products.json",
    products.filter((p) => p.id !== id)
  );
}

// ---------- Orders ----------

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json");
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.push(order);
  }
  await writeJson("orders.json", orders);
}

// ---------- Coupons ----------

export async function getCoupons(): Promise<Coupon[]> {
  return readJson<Coupon[]>("coupons.json");
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const coupons = await getCoupons();
  return (
    coupons.find((c) => c.code.toLowerCase() === code.toLowerCase()) ?? null
  );
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const coupons = await getCoupons();
  const idx = coupons.findIndex((c) => c.code === coupon.code);
  if (idx >= 0) {
    coupons[idx] = coupon;
  } else {
    coupons.push(coupon);
  }
  await writeJson("coupons.json", coupons);
}
