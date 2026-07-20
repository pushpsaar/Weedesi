import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminPasswordChangeForm from "@/components/admin/AdminPasswordChangeForm";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Website Content" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:gap-8 md:px-8 md:py-10">
      <aside className="glass rounded-[24px] border border-border p-4 shadow-sm md:w-72 md:shrink-0 md:p-5">
        <div className="flex items-center justify-between gap-3 md:block">
          <div>
            <p className="font-heading text-2xl text-dark">Weदेसी</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-dark/40">
              Admin
            </p>
          </div>
          <div className="rounded-full bg-dark px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:hidden">
            Panel
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:mt-6 md:flex-col md:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border bg-white/80 px-3 py-2 text-sm text-dark/70 transition-colors hover:bg-dark hover:text-white md:block md:rounded-lg md:border-0 md:bg-transparent md:px-3 md:py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 space-y-3 border-t border-border pt-4 md:mt-8">
          <AdminPasswordChangeForm />
          <div className="mt-1">
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
