import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrderById, getOrders } from "@/lib/data";

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
  };
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    });
  }

  const signedInCustomer = await getSignedInCustomer();
  if (!signedInCustomer) {
    return NextResponse.json({ error: "Please sign in to view your orders." }, { status: 401 });
  }

  const orders = await getOrders();
  const matchingOrders = orders
    .filter((order) => {
      if (order.userId && order.userId === signedInCustomer.id) {
        return true;
      }
      return !!order.customer?.email && order.customer.email.toLowerCase() === signedInCustomer.email.toLowerCase();
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((order) => ({
      id: order.id,
      status: order.status,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    }));

  return NextResponse.json({ orders: matchingOrders });
}
