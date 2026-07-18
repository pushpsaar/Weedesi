import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getOrders } from "@/lib/data";

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
