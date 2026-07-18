import Link from "next/link";
import { getOrders } from "@/lib/data";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  delivered: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-dark/10 text-dark/60",
};

export default async function AdminOrdersPage() {
  const orders = (await getOrders()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="font-heading text-3xl text-dark">Orders</h1>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-dark/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-dark/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-gold-dark hover:underline">
                      #{o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customer.name}</div>
                    <div className="text-xs text-dark/40">{o.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-4 py-3">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 capitalize">{o.payment.status}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${STATUS_COLORS[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark/50">
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
