import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { StoreProvider } from "@/context/store-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NavDrawer from "@/components/layout/NavDrawer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vedesi.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WEदेसी — Timeless Indian Craftsmanship",
    template: "%s | WEदेसी",
  },
  description:
    "WEदेसी is a luxury Indian fashion house offering considered, handcrafted pieces for the modern wardrobe.",
  openGraph: {
    title: "WEदेसी — Timeless Indian Craftsmanship",
    description:
      "Luxury, minimal, Indian. Considered pieces for a considered life.",
    url: siteUrl,
    siteName: "WEदेसी",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEदेसी — Timeless Indian Craftsmanship",
    description:
      "Luxury, minimal, Indian. Considered pieces for a considered life.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme'); if(t==='dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')} else {document.documentElement.classList.remove('dark')}}catch(e){}})()`,
        }}
      />
      <body className="min-h-full flex flex-col bg-bg text-dark">
        <StoreProvider>
          <Navbar />
          <NavDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
