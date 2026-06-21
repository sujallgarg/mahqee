import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import DevProductAdder from "@/components/DevProductAdder";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAHQEE | Botanical Cellular Skincare",
  description: "Experience luxury organic skincare formulated with biotechnology. High-performance serums, nourishing oils, and restorative creams designed for cellular rejuvenation.",
  keywords: ["beauty", "luxury skincare", "botanical elixir", "organic serum", "MAHQEE"],
  openGraph: {
    title: "MAHQEE | Botanical Cellular Skincare",
    description: "Experience luxury organic skincare formulated with biotechnology.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          {children}
          {process.env.NODE_ENV !== "production" && <DevProductAdder />}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
