import { supabaseAdmin, ensureSupabaseSchema } from "./supabase";
import { Coupon, Order, Product } from "./types";

interface ProductRow {
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
  variants: Product["variants"];
  tags: string[];
  is_active: boolean;
  created_at: string;
}

interface OrderRow {
  id: string;
  user_id: string | null;
  items: Order["items"];
  customer: Order["customer"];
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  status: string;
  payment: Order["payment"];
  created_at: string;
  updated_at: string;
}

interface CouponRow {
  code: string;
  type: string;
  value: number;
  active: boolean;
  min_order_value: number | null;
}

function parseProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    category: row.category,
    collection: row.collection ?? undefined,
    description: row.description,
    fabric: row.fabric ?? undefined,
    washCare: row.wash_care ?? undefined,
    mrp: row.mrp,
    salePrice: row.sale_price,
    variants: row.variants,
    tags: row.tags ?? [],
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function parseOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    items: row.items,
    customer: row.customer,
    subtotal: row.subtotal,
    gst: row.gst,
    shipping: row.shipping,
    discount: row.discount,
    total: row.total,
    couponCode: row.coupon_code ?? undefined,
    status: row.status as Order["status"],
    payment: row.payment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseCouponRow(row: CouponRow): Coupon {
  return {
    code: row.code,
    type: row.type as Coupon["type"],
    value: row.value,
    active: row.active,
    minOrderValue: row.min_order_value ?? undefined,
  };
}

function serializeProduct(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    category: product.category,
    collection: product.collection ?? null,
    description: product.description,
    fabric: product.fabric ?? null,
    wash_care: product.washCare ?? null,
    mrp: product.mrp,
    sale_price: product.salePrice,
    variants: product.variants,
    tags: product.tags,
    is_active: product.isActive,
    created_at: product.createdAt,
  };
}

function serializeOrder(order: Order) {
  return {
    id: order.id,
    user_id: order.userId ?? null,
    items: order.items,
    customer: order.customer,
    subtotal: order.subtotal,
    gst: order.gst,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    coupon_code: order.couponCode ?? null,
    status: order.status,
    payment: order.payment,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

function serializeCoupon(coupon: Coupon) {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    active: coupon.active,
    min_order_value: coupon.minOrderValue ?? null,
  };
}

// ---------- Products ----------

export async function getProducts(): Promise<Product[]> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(parseProductRow);
}

export async function getActiveProducts(): Promise<Product[]> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(parseProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .ilike("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? parseProductRow(data) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? parseProductRow(data) : null;
}

export async function saveProduct(product: Product): Promise<void> {
  await ensureSupabaseSchema();
  const serialized: ProductRow = serializeProduct(product);
  const { error } = await supabaseAdmin.from("products").upsert(serialized);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Orders ----------

export async function getOrders(): Promise<Order[]> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(parseOrderRow);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? parseOrderRow(data) : null;
}

export async function saveOrder(order: Order): Promise<void> {
  await ensureSupabaseSchema();
  const serialized: OrderRow = serializeOrder(order);
  const { error } = await supabaseAdmin.from("orders").upsert(serialized);
  if (error) throw error;
}

// ---------- Coupons ----------

export async function getCoupons(): Promise<Coupon[]> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .order("code", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(parseCouponRow);
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .maybeSingle();

  if (error) throw error;
  return data ? parseCouponRow(data) : null;
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  await ensureSupabaseSchema();
  const serialized: CouponRow = serializeCoupon(coupon);
  const { error } = await supabaseAdmin.from("coupons").upsert(serialized);
  if (error) throw error;
}
