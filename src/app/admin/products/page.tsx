import Link from "next/link";
import { getProducts } from "@/lib/data";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl text-dark">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.02] transition-transform"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-dark/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-dark/40">
                  No products yet. Click &ldquo;Add Product&rdquo; to create your first one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-dark/60">{p.sku}</td>
                  <td className="px-4 py-3 text-dark/60">{p.category}</td>
                  <td className="px-4 py-3">₹{p.salePrice.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.isActive ? "bg-green-100 text-green-700" : "bg-dark/10 text-dark/50"
                      }`}
                    >
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-xs font-medium text-gold-dark hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
