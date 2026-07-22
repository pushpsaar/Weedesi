import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { getCouponByCode, getOrders, saveOrder } from "@/lib/data";
import { Order, OrderItem } from "@/lib/types";
import { CartLine } from "@/context/store-context";

const GST_RATE = 0.05;
const SHIPPING_FLAT = 0;
const UPI_ID = "soniroshni410-1@okaxis";
const USER_COOKIE = "wedesi_user_session";

function unsign(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

async function getSignedInCustomer() {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) return null;

  const payload = unsign(token);
  if (!payload || payload.exp < Date.now()) {
    store.delete(USER_COOKIE);
    return null;
  }

  return {
    id: payload.userId as string,
    email: payload.email as string,
    name: payload.name as string,
  };
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  // most recent first
  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: CartLine[] = body.items ?? [];
  const customer = body.customer;
  const couponCode: string | undefined = body.couponCode;
  const paymentScreenshot: string | undefined = body.paymentScreenshot;
  const signedInCustomer = await getSignedInCustomer();

  if (!signedInCustomer) {
    return NextResponse.json(
      { error: "Please sign in before placing your order." },
      { status: 401 }
    );
  }

  if (!items.length || !customer) {
    return NextResponse.json(
      { error: "Cart items and customer details are required." },
      { status: 400 }
    );
  }

  if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.state || !customer.pincode) {
    return NextResponse.json(
      { error: "Please fill in your name, phone number, and address details." },
      { status: 400 }
    );
  }

  if (!paymentScreenshot) {
    return NextResponse.json(
      { error: "Please upload the payment screenshot after paying to the UPI ID shown below." },
      { status: 400 }
    );
  }

  const normalizedCustomer = {
    ...customer,
    email: customer.email?.trim() ? customer.email.trim() : signedInCustomer.email,
  };

  const subtotal = items.reduce((sum, l) => sum + l.qty * l.price, 0);

  let discount = 0;
  if (couponCode) {
    const coupon = await getCouponByCode(couponCode);
    if (coupon && coupon.active) {
      if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
        discount =
          coupon.type === "percent"
            ? Math.round((subtotal * coupon.value) / 100)
            : coupon.value;
      }
    }
  }

  const gst = Math.round((subtotal - discount) * GST_RATE);
  const total = subtotal - discount + gst + SHIPPING_FLAT;

  const orderItems: OrderItem[] = items.map((l) => ({
    productId: l.productId,
    name: l.name,
    slug: l.slug,
    image: l.image,
    color: l.color,
    size: l.size,
    qty: l.qty,
    price: l.price,
  }));

  const order: Order = {
    id: randomUUID(),
    userId: signedInCustomer.id,
    items: orderItems,
    customer: normalizedCustomer,
    subtotal,
    gst,
    shipping: SHIPPING_FLAT,
    discount,
    total,
    couponCode,
    status: "pending",
    payment: {
      status: "pending",
      method: "upi",
      upiId: UPI_ID,
      paymentScreenshot,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    upiId: UPI_ID,
    message: "Order placed successfully. Your payment proof has been saved and the admin can review it.",
  });
}
