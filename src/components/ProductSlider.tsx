"use client";

import React, { useState, useRef } from "react";
import { Product, useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

interface ProductSliderProps {
  onLearnMore: (product: Product) => void;
}

export default function ProductSlider({ onLearnMore }: ProductSliderProps) {
  const { products } = useCart();
  const [activeCategory, setActiveCategory] = useState("All Products");
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const categories = ["All Products", "Nail Accessory", "Hair", "Foot", "Bath", "Makeup"];

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All Products") return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="lineup" style={{
      padding: "100px 0",
      backgroundColor: "var(--bg-secondary)",
      overflow: "hidden"
    }}>
      <div className="container">
        <h2 style={{
          fontSize: "clamp(36px, 6vw, 56px)",
          color: "var(--text-primary)",
          marginBottom: "36px",
          textAlign: "left"
        }}>
          Explore the line-up.
        </h2>

        {/* Category Pill Filters */}
        <div className="category-tabs" style={{
          display: "flex",
          gap: "12px",
          marginBottom: "48px",
          flexWrap: "wrap"
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Slider Area */}
        <div 
          ref={sliderRef}
          className="product-slider-track"
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingBottom: "32px",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onLearnMore(product)}
              showSwatches={true}
              showBuyNow={true}
              showNewBadge={true}
              layoutVariant="slider"
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* Category Pill Buttons styling */
        .category-pill {
          background-color: rgba(0, 0, 0, 0.04);
          color: var(--text-primary);
          padding: 8px 18px;
          border-radius: 980px;
          font-size: 13px;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        .category-pill.active {
          background-color: var(--text-primary);
          color: var(--bg-card);
        }

        /* Product Cards Drag Track styling */
        .product-slider-track::-webkit-scrollbar {
          height: 6px;
        }
      `}</style>
    </section>
  );
}
