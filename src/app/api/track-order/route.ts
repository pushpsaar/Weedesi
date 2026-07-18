import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/data";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Order ID required." }, { status: 400 });
  }
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Return only what's safe to expose to a customer, not the full internal record.
  return NextResponse.json({
    id: order.id,
    status: order.status,
    items: order.items,
    total: order.total,
    createdAt: order.createdAt,
  });
}
