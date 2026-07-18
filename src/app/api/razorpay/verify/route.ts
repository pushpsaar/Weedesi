import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrders, saveOrder } from "@/lib/data";

export async function POST(req: NextRequest) {
  const {
    orderId, // our internal order id
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = await req.json();

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing verification fields." }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "RAZORPAY_KEY_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (!isValid) {
    order.payment.status = "failed";
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    await saveOrder(order);
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  order.payment.status = "paid";
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.status = "paid";
  order.updatedAt = new Date().toISOString();
  await saveOrder(order);

  return NextResponse.json({ verified: true, orderId: order.id });
}
