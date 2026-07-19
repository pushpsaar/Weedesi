import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminPasswordChangeForm from "@/components/admin/AdminPasswordChangeForm";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 md:px-8">
      <aside className="w-52 shrink-0">
        <div className="mb-8">
          <p className="font-heading text-xl text-dark">Weदेसी</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-dark/40">
            Admin
          </p>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-dark/70 hover:bg-white hover:text-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-border pt-4">
          <AdminPasswordChangeForm />
          <div className="mt-3">
            <AdminLogoutButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
