import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-3xl text-dark">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
