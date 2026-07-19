import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-dark">Order #{order.id.slice(0, 8)}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>
      <p className="mt-1 text-sm text-dark/50">
        Placed {new Date(order.createdAt).toLocaleString("en-IN")}
      </p>
      {order.status === "pending" && (
        <p className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          Awaiting Admin Confirmation
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark/50">
            Customer
          </h2>
          <p className="text-sm">{order.customer.name}</p>
          <p className="text-sm text-dark/60">{order.customer.phone}</p>
          {order.customer.email && <p className="text-sm text-dark/60">{order.customer.email}</p>}
          <p className="mt-2 text-sm text-dark/60">
            {order.customer.address}, {order.customer.city}, {order.customer.state} —{" "}
            {order.customer.pincode}, {order.customer.country}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark/50">
            Payment
          </h2>
          <p className="text-sm capitalize">Payment Status: {order.payment.status}</p>
          <p className="mt-1 text-sm capitalize">Order Status: {order.status}</p>
          {order.payment.method && (
            <p className="mt-1 text-xs text-dark/50">Method: {order.payment.method}</p>
          )}
          {order.payment.upiId && (
            <p className="mt-1 text-xs text-dark/50">UPI ID: {order.payment.upiId}</p>
          )}
          {order.payment.razorpayOrderId && (
            <p className="mt-1 text-xs text-dark/50">
              Razorpay Order: {order.payment.razorpayOrderId}
            </p>
          )}
          {order.payment.razorpayPaymentId && (
            <p className="text-xs text-dark/50">
              Payment ID: {order.payment.razorpayPaymentId}
            </p>
          )}
          {order.payment.paymentScreenshot && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-dark/60">Payment Screenshot</p>
              <img
                src={order.payment.paymentScreenshot}
                alt="Payment proof"
                className="max-h-64 rounded-lg border border-border object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-dark/50">
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.size}</td>
                <td className="px-4 py-3">{item.color}</td>
                <td className="px-4 py-3">{item.qty}</td>
                <td className="px-4 py-3">₹{item.price.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 ml-auto max-w-xs space-y-1.5 rounded-xl border border-border bg-white p-5 text-sm">
        <div className="flex justify-between text-dark/60">
          <span>Subtotal</span>
          <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-dark/60">
            <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
            <span>-₹{order.discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between text-dark/60">
          <span>GST</span>
          <span>₹{order.gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-dark/60">
          <span>Shipping</span>
          <span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-medium text-dark">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
