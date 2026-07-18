export default function ProfilePage() {
  const sections = ["Orders", "Wishlist", "Addresses", "Account Settings"];
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-dark">My Account</h1>
      <p className="mt-2 text-sm text-dark/50">
        Customer accounts are coming soon. In the meantime, use Track Order with your order ID and phone number.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s} className="rounded-xl border border-border bg-white p-6">
            <p className="font-heading text-lg text-dark">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
