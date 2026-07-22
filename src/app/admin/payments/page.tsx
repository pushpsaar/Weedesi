import Link from "next/link";
import { getOrders } from "@/lib/data";

const STATUS_STYLES: Record<string, string> = {
  created: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;
  const orders = (await getOrders()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filtered = orders.filter((order) => {
    const query = q.trim().toLowerCase();
    const matchesQuery =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email?.toLowerCase().includes(query) ||
      order.payment.razorpayPaymentId?.toLowerCase().includes(query) ||
      order.payment.razorpayOrderId?.toLowerCase().includes(query);

    const matchesStatus =
      status === "all" ||
      (status === "paid" && order.payment.status === "paid") ||
      (status === "failed" && order.payment.status === "failed") ||
      (status === "pending" && order.payment.status === "pending") ||
      (status === "created" && order.payment.status === "created");

    return matchesQuery && matchesStatus;
  });

  const stats = [
    { label: "Total", value: orders.length },
    { label: "Paid", value: orders.filter((order) => order.payment.status === "paid").length },
    { label: "Failed", value: orders.filter((order) => order.payment.status === "failed").length },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-dark">Payments</h1>
          <p className="mt-1 text-sm text-dark/50">Search and review Razorpay payments and order status.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-dark/40">{item.label}</p>
            <p className="mt-2 font-heading text-2xl text-dark">{item.value}</p>
          </div>
        ))}
      </div>

      <form className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-white p-4 md:flex-row" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by order, customer, payment ID..."
          className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-full border border-border px-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="all">All statuses</option>
          <option value="created">Created</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
        <button type="submit" className="rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white">
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-dark/50">
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Razorpay Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-dark/40">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-xs text-dark/60">
                      {order.payment.razorpayPaymentId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-dark/60">
                      {order.payment.razorpayOrderId ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-dark">{order.customer.name}</div>
                      <div className="text-xs text-dark/40">{order.customer.email || "No email"}</div>
                    </td>
                    <td className="px-4 py-3">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 capitalize">{order.payment.method ?? "razorpay"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[order.payment.status] ?? "bg-slate-100 text-slate-700"}`}>
                        {order.payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-gold-dark hover:underline">
                        {order.status}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-dark/50">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
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
