"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
// import CurlerBanner from "@/components/CurlerBanner";
import Scrollytelling from "@/components/Scrollytelling";
import BundleBanner from "@/components/BundleBanner";
import CategoryGrid from "@/components/CategoryGrid";
import Testimonials from "@/components/Testimonials";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import { Product } from "@/context/CartContext";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* 1. Hero Carousel (Screenshot 1 matching) */}
      <Hero />

      {/* 2. Curated Best Sellers Grid (Screenshot 2 matching) */}
      <BestSellers onLearnMore={(prod) => setSelectedProduct(prod)} />

      {/* 2.5. Eyelash Curler Banner */}
      {/* <CurlerBanner /> */}

      {/* 3. Apple-style Scrollytelling Section */}
      <Scrollytelling onLearnMore={(prod) => setSelectedProduct(prod)} />

      {/* 5. Shop by Category Grid (Screenshot 4 matching) */}
      <CategoryGrid />

      {/* 4. Build Your Own Bundle Banner (Screenshot 3 matching) */}
      <BundleBanner />

      {/* 6. Customer Testimonials Slide deck (Screenshot 5 matching) */}
      <Testimonials />

      {/* 7. Product Specs Details Modal overlay */}
      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </main>
  );
}
