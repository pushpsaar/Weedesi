import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminSession } from "@/lib/auth";
import { getProducts, saveProduct } from "@/lib/data";
import { Product } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.sku || !body.salePrice) {
    return NextResponse.json(
      { error: "name, sku, and salePrice are required." },
      { status: 400 }
    );
  }

  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const product: Product = {
    id: randomUUID(),
    slug,
    name: body.name,
    sku: body.sku,
    category: body.category ?? "uncategorized",
    collection: body.collection ?? undefined,
    description: body.description ?? "",
    fabric: body.fabric ?? "",
    washCare: body.washCare ?? "",
    mrp: Number(body.mrp) || Number(body.salePrice),
    salePrice: Number(body.salePrice),
    variants: body.variants ?? [
      {
        color: "Default",
        colorHex: "#C8A96A",
        images: body.images ?? [],
        sizes: (body.sizes ?? ["S", "M", "L"]).map((s: string) => ({
          size: s,
          stock: Number(body.stock) || 0,
        })),
      },
    ],
    tags: body.tags ?? [],
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
  };

  await saveProduct(product);
  return NextResponse.json(product, { status: 201 });
}
