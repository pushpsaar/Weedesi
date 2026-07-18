import { NextRequest, NextResponse } from "next/server";
import { getCouponByCode } from "@/lib/data";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal") ?? 0);

  if (!code) {
    return NextResponse.json({ error: "Coupon code required." }, { status: 400 });
  }

  const coupon = await getCouponByCode(code);
  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Invalid or inactive coupon." }, { status: 404 });
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return NextResponse.json(
      { error: `Minimum order value ₹${coupon.minOrderValue} required.` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  return NextResponse.json({ discount });
}
