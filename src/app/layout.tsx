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
  title: "MAHQEE | Premium Beauty & Styling Accessories",
  description: "Explore MAHQEE's curated collections of premium beauty, styling, nail accessories, hair, foot, and bath essentials designed to elevate your grooming routine.",
  keywords: ["beauty", "nail accessory", "hair styling", "foot care", "bath body", "makeup blenders", "MAHQEE"],
  openGraph: {
    title: "MAHQEE | Premium Beauty & Styling Accessories",
    description: "Explore MAHQEE's curated collections of premium beauty, styling, and grooming essentials.",
    type: "website",
    images: "/favicon.ico",
  },
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
