import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedesi.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Weदेसी — Timeless Indian Craftsmanship",
    template: "%s | Weदेसी",
  },
  description:
    "Weदेसी is a luxury Indian fashion house offering considered, handcrafted pieces for the modern wardrobe.",
  openGraph: {
    title: "Weदेसी — Timeless Indian Craftsmanship",
    description:
      "Luxury, minimal, Indian. Considered pieces for a considered life.",
    url: siteUrl,
    siteName: "Weदेसी",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weदेसी — Timeless Indian Craftsmanship",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
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
