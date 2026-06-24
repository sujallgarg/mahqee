"use client";

import React, { useRef } from "react";
import { Product, useCart } from "@/context/CartContext";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import ProductCard from "@/components/ProductCard";

interface BestSellersProps {
  onLearnMore: (product: Product) => void;
  isSubpage?: boolean;
}

export default function BestSellers({ onLearnMore, isSubpage = false }: BestSellersProps) {
  const { products } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);

  // Curate products to show (marked as best seller)
  const bestSellerProducts = products.filter(p => p.isBestSeller);

  return (
    <section 
      ref={sectionRef}
      style={{
        padding: isSubpage ? "20px 0 var(--section-padding-y) 0" : "var(--section-padding-y) 0",
        backgroundColor: isSubpage ? "transparent" : "#ffffff",
        borderTop: isSubpage ? "none" : "1px solid var(--border-color)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Parallax background aura */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(237, 116, 178, 0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: `translateY(${(progress - 0.5) * -80}px)`,
        transition: "transform 0.1s ease-out",
        zIndex: 0
      }} />
      <div className="container">
        <h2 style={{
          fontSize: "32px",
          color: "var(--text-primary)",
          marginBottom: "40px",
          fontFamily: "var(--font-serif)"
        }}>
          Our Best Sellers
        </h2>

        <div 
          className="best-sellers-grid"
        >
          {bestSellerProducts.map((prod, idx) => {
            if (!prod) return null;
            return (
              <div 
                key={prod.id} 
              >
                <ProductCard
                  product={prod}
                  onClick={() => onLearnMore(prod)}
                  showSwatches={false}
                  showBuyNow={true}
                  showBestSellerBadge={prod.isBestSeller}
                  layoutVariant="best-seller"
                />
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .best-sellers-grid {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 32px;
            width: 100%;
          }
          @media (min-width: 576px) {
            .best-sellers-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
          }
          @media (min-width: 992px) {
            .best-sellers-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
