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
  const razorpayOrderId =
    event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id;

  if (razorpayOrderId) {
    const orders = await getOrders();
    const order = orders.find((o) => o.payment.razorpayOrderId === razorpayOrderId);
    if (order) {
      if (event.event === "payment.captured") {
        order.payment.status = "paid";
        order.status = "confirmed";
      } else if (event.event === "payment.failed") {
        order.payment.status = "failed";
        order.status = "cancelled";
      } else if (event.event === "refund.processed") {
        order.payment.status = "refunded";
        order.status = "refunded";
      }
      order.updatedAt = new Date().toISOString();
      await saveOrder(order);
    }
  }

  return NextResponse.json({ received: true });
}
