import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent();

  return (
    <footer className="mt-24 border-t border-border/80 bg-surface text-dark">
      <div className="section-shell px-4 py-16 sm:px-6 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-5">
            <Image
              src="/logo.png"
              alt={content.footer.logo || "WEदेसी logo"}
              width={172}
              height={48}
              className="h-auto w-auto object-contain"
            />
            <p className="max-w-sm text-sm leading-7 text-dark/65">{content.footer.description}</p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Shop</p>
            <ul className="space-y-3 text-sm text-dark/70">
              <li><Link href="/shop" className="transition-colors hover:text-gold-dark">All Products</Link></li>
              <li><Link href="/shop?tag=new-arrival" className="transition-colors hover:text-gold-dark">New Arrivals</Link></li>
              <li><Link href="/shop?tag=best-seller" className="transition-colors hover:text-gold-dark">Best Sellers</Link></li>
              <li><Link href="/shop?tag=sale" className="transition-colors hover:text-gold-dark">Sale</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Support</p>
            <ul className="space-y-3 text-sm text-dark/70">
              <li><Link href="/contact" className="transition-colors hover:text-gold-dark">Contact Us</Link></li>
              <li><Link href="/track-order" className="transition-colors hover:text-gold-dark">Track Order</Link></li>
              <li><Link href="/shipping-returns" className="transition-colors hover:text-gold-dark">Shipping &amp; Returns</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-dark">Company</p>
            <ul className="space-y-3 text-sm text-dark/70">
              <li><Link href="/about" className="transition-colors hover:text-gold-dark">About</Link></li>
              <li><Link href="/admin/login" className="transition-colors hover:text-gold-dark">Admin Login</Link></li>
              <li><a href={`mailto:${content.footer.email}`} className="transition-colors hover:text-gold-dark">{content.footer.email}</a></li>
              <li><a href={`tel:${content.footer.phone}`} className="transition-colors hover:text-gold-dark">{content.footer.phone}</a></li>
              <li><a href={`https://instagram.com/${content.footer.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold-dark">{content.footer.instagram}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 text-xs text-dark/50 md:flex-row">
          <p>{content.footer.copyright}</p>
          <p className="font-medium text-dark/60">Crafted with care, in India.</p>
        </div>
      </div>
    </footer>
  );
}
