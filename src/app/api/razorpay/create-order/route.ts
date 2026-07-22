import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Razorpay from "razorpay";
import { saveOrder, getCouponByCode } from "@/lib/data";
import { CartLine } from "@/context/store-context";
import { Order, OrderItem } from "@/lib/types";
import { cookies } from "next/headers";

const GST_RATE = 0.05;
const SHIPPING_FLAT = 0;
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

  return { id: payload.userId as string, email: payload.email as string, name: payload.name as string };
}

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return NextResponse.json(
      { error: "Razorpay keys are not configured on the server." },
      { status: 500 }
    );
  }
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "RAZORPAY_KEY_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const items: CartLine[] = body.items ?? [];
  const customer = body.customer;
  const couponCode: string | undefined = body.couponCode;
  const signedInCustomer = await getSignedInCustomer();

  if (!signedInCustomer) {
    return NextResponse.json({ error: "Please sign in before placing your order." }, { status: 401 });
  }

  if (!items.length || !customer) {
    return NextResponse.json(
      { error: "Cart items and customer details are required." },
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

  const razorpay = new Razorpay({
    key_id: (process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100, // paise
    currency: "INR",
    receipt: randomUUID(),
  });

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
      status: "created",
      razorpayOrderId: razorpayOrder.id,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
