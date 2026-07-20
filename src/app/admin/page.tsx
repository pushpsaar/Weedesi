import Link from "next/link";
import { getProducts, getOrders } from "@/lib/data";

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.payment.status === "paid");
  const revenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Total Orders", value: orders.length },
    { label: "Confirmed Orders", value: confirmedOrders.length },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Revenue (Confirmed)", value: `₹${revenue.toLocaleString("en-IN")}` },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl text-dark">Dashboard</h1>
        <Link href="/admin/orders" className="text-xs font-medium uppercase tracking-wide text-gold-dark">
          View all
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-4 sm:p-5">
            <p className="text-xs text-dark/50">{s.label}</p>
            <p className="mt-2 font-heading text-2xl text-dark">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-heading text-xl text-dark">Recent Orders</h2>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-dark/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-dark/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-gold-dark hover:underline">
                      #{o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.customer.name}</td>
                  <td className="px-4 py-3">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 capitalize">{o.payment.status}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-dark px-6 py-2.5 text-sm font-medium text-white hover:scale-[1.02] transition-transform"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-full border border-dark/20 px-6 py-2.5 text-sm font-medium text-dark hover:border-dark transition-colors"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
