import { NextRequest, NextResponse } from "next/server";
import { getOrderById, saveOrder } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderId = body?.orderId as string | undefined;
  const reason = body?.reason as string | undefined;

  if (!orderId) {
    return NextResponse.json({ error: "Order ID required." }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  order.payment.status = "failed";
  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();
  if (reason) {
    order.payment.razorpaySignature = reason;
  }
  await saveOrder(order);

  return NextResponse.json({ ok: true });
}
