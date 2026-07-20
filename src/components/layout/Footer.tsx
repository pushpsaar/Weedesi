import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent();

  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <span className="font-heading text-2xl text-dark">{content.footer.logo}</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-dark/60">
              {content.footer.text}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/shop" className="hover:text-gold-dark transition-colors">All Products</Link></li>
              <li><Link href="/shop?tag=new-arrival" className="hover:text-gold-dark transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?tag=best-seller" className="hover:text-gold-dark transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop?tag=sale" className="hover:text-gold-dark transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/contact" className="hover:text-gold-dark transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-gold-dark transition-colors">Track Order</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-gold-dark transition-colors">Shipping &amp; Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-dark/50">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/about" className="hover:text-gold-dark transition-colors">About</Link></li>
              <li><Link href="/admin/login" className="hover:text-gold-dark transition-colors">Admin Login</Link></li>
              <li><a href={`mailto:${content.footer.email}`} className="hover:text-gold-dark transition-colors">{content.footer.email}</a></li>
              <li><a href={`tel:${content.footer.phone}`} className="hover:text-gold-dark transition-colors">{content.footer.phone}</a></li>
              <li><a href={`https://instagram.com/${content.footer.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:text-gold-dark transition-colors">{content.footer.instagram}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-dark/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {content.footer.logo}. All rights reserved.</p>
          <p>Crafted with care, in India.</p>
        </div>
      </div>
    </footer>
  );
}
