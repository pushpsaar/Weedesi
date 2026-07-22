import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent();

  return (
    <footer className="mt-20 border-t border-border/80 bg-white/70 backdrop-blur-sm">
      <div className="section-shell px-4 py-16 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <span className="font-heading text-2xl text-dark">{content.footer.logo}</span>
            <p className="mt-4 max-w-xs text-sm leading-7 text-dark/60">
              {content.footer.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/50">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/shop" className="transition-colors hover:text-gold-dark">All Products</Link></li>
              <li><Link href="/shop?tag=new-arrival" className="transition-colors hover:text-gold-dark">New Arrivals</Link></li>
              <li><Link href="/shop?tag=best-seller" className="transition-colors hover:text-gold-dark">Best Sellers</Link></li>
              <li><Link href="/shop?tag=sale" className="transition-colors hover:text-gold-dark">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/50">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/contact" className="transition-colors hover:text-gold-dark">Contact Us</Link></li>
              <li><Link href="/track-order" className="transition-colors hover:text-gold-dark">Track Order</Link></li>
              <li><Link href="/shipping-returns" className="transition-colors hover:text-gold-dark">Shipping &amp; Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/50">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-dark/70">
              <li><Link href="/about" className="transition-colors hover:text-gold-dark">About</Link></li>
              <li><Link href="/admin/login" className="transition-colors hover:text-gold-dark">Admin Login</Link></li>
              <li><a href={`mailto:${content.footer.email}`} className="transition-colors hover:text-gold-dark">{content.footer.email}</a></li>
              <li><a href={`tel:${content.footer.phone}`} className="transition-colors hover:text-gold-dark">{content.footer.phone}</a></li>
              <li><a href={`https://instagram.com/${content.footer.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold-dark">{content.footer.instagram}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 text-xs text-dark/50 md:flex-row">
          <p>{content.footer.copyright}</p>
          <p>Crafted with care, in India.</p>
        </div>
      </div>
    </footer>
  );
}
