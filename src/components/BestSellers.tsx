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

  // Curate products to show (marked as best seller, fallback to original best sellers)
  const bestSellerProducts = [
    ...products.filter(p => p.isBestSeller),
    products.find(p => p.id === "makeup-wedges") || products[1],
    products.find(p => p.id === "pink-scrunchie") || products[2],
    products.find(p => p.id === "face-roller") || products[3],
    products.find(p => p.id === "floral-comb") || products[0]
  ].filter((prod, index, self) => prod && self.findIndex(p => p?.id === prod.id) === index).slice(0, 4);

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
          className="best-sellers-track" 
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "24px",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {bestSellerProducts.map((prod, idx) => {
            if (!prod) return null;
            const cardOffset = (progress - 0.5) * (idx % 2 === 0 ? -12 : 12);
            return (
              <div 
                key={prod.id} 
                style={{ 
                  scrollSnapAlign: "start",
                  flex: "0 0 280px"
                }}
              >
                <ProductCard
                  product={prod}
                  onClick={() => onLearnMore(prod)}
                  showSwatches={false}
                  showBuyNow={true}
                  showBestSellerBadge={true}
                  cardOffset={cardOffset}
                  layoutVariant="best-seller"
                />
              </div>
            );
          })}
        </div>

        {/* Pagination Pills */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px"
        }}>
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                width: idx === 0 ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === 0 ? "var(--text-primary)" : "rgba(16, 34, 77, 0.15)",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>

        <style jsx>{`
          .best-sellers-track::-webkit-scrollbar {
            display: none;
          }
          @media (min-width: 992px) {
            .best-sellers-track {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr);
              overflow-x: visible !important;
            }
            .best-sellers-track > div {
              flex: auto !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
