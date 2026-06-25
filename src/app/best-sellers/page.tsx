"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/context/CartContext";
import BestSellers from "@/components/BestSellers";
import ProductDetailsModal from "@/components/ProductDetailsModal";

export default function BestSellersPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main style={{
      minHeight: "100vh",
      padding: "var(--page-top-padding) 24px var(--page-bottom-padding) 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container">
        {/* Collections Header Banner */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "320px",
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: "48px",
          border: "1px solid rgba(16, 34, 77, 0.08)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          padding: "0 48px"
        }} className="shop-hero-banner">
          <Image 
            src="/images/banners/collection banner.png" 
            alt="MAHQEE Best Sellers Tools Collection" 
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            background: "rgba(16, 34, 77, 0.08)"
          }} />
          
          <div style={{
            position: "relative",
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "24px 32px",
            maxWidth: "480px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "var(--shadow-md)"
          }} className="glass-title-card">
            <h1 className="bestsellers-title" style={{
              fontSize: "36px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontFamily: "var(--font-serif)",
              lineHeight: "1.2"
            }}>
              Best Sellers
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: "1.5" }}>
              Our highest-rated, precision-engineered beauty tools and luxury grooming essentials, chosen and loved by our community.
            </p>
          </div>
        </div>

        {/* Reusing the BestSellers grid component */}
        <BestSellers onLearnMore={(prod) => setSelectedProduct(prod)} isSubpage={true} />

        {/* Details modal trigger */}
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
      <style jsx global>{`
        @media (max-width: 768px) {
          .shop-hero-banner {
            height: 180px !important;
            padding: 0 20px !important;
            margin-bottom: 24px !important;
          }
          .glass-title-card {
            padding: 16px 20px !important;
            max-width: 100% !important;
          }
          .bestsellers-title {
            font-size: 28px !important;
          }
        }
      `}</style>
    </main>
  );
}
