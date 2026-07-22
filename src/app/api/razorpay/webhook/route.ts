import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrders, saveOrder } from "@/lib/data";

// Configure this exact URL in Razorpay Dashboard > Settings > Webhooks:
//   https://yourdomain.com/api/razorpay/webhook
// and set the same secret as RAZORPAY_WEBHOOK_SECRET in your env.
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "RAZORPAY_WEBHOOK_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const entity = event.payload?.payment?.entity ?? event.payload?.order?.entity;
  const razorpayOrderId = entity?.order_id ?? event.payload?.order?.entity?.id;
  const razorpayPaymentId = entity?.id;
  const eventType = event.event;

  if (razorpayOrderId) {
    const orders = await getOrders();
    const order = orders.find((o) => o.payment.razorpayOrderId === razorpayOrderId);
    if (order) {
      if (eventType === "payment.captured" || eventType === "order.paid") {
        order.payment.status = "paid";
        order.payment.razorpayPaymentId = razorpayPaymentId ?? order.payment.razorpayPaymentId;
        order.status = "paid";
      } else if (eventType === "payment.failed") {
        order.payment.status = "failed";
        order.status = "cancelled";
      } else if (eventType === "refund.processed") {
        order.payment.status = "refunded";
        order.status = "refunded";
      }
      order.updatedAt = new Date().toISOString();
      await saveOrder(order);
    }
  }

  return NextResponse.json({ received: true });
}
