"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, useCart } from "@/context/CartContext";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const { products } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Parse query parameters if loaded
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat) {
        setTimeout(() => {
          // Map cat query to clean text
          if (cat === "nail-accessory") setActiveCategory("Nail Accessory");
          else if (cat === "hair") setActiveCategory("Hair");
          else if (cat === "foot") setActiveCategory("Foot");
          else if (cat === "bath") setActiveCategory("Bath");
          else if (cat === "makeup") setActiveCategory("Makeup");
        }, 0);
      }
      const search = params.get("search");
      if (search) {
        setTimeout(() => {
          setSearchQuery(search);
        }, 0);
      }
    }
  }, []);

  const categories = ["All", "Nail Accessory", "Hair", "Foot", "Bath", "Makeup"];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main style={{
      minHeight: "100vh",
      padding: "160px 24px 120px 24px",
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
            alt="MAHQEE Beauty Tools Collection" 
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
            <h1 style={{
              fontSize: "36px",
              color: "var(--text-primary)",
              marginBottom: "8px",
              fontFamily: "var(--font-serif)",
              lineHeight: "1.2"
            }}>
              The Collection
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: "1.5" }}>
              Precision-engineered beauty tools and luxury essentials designed to elevate your daily grooming and styling routine.
            </p>
          </div>
        </div>

        {/* Filter Area (Search & Category pills) */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
          marginBottom: "48px",
          flexWrap: "wrap"
        }}>
          {/* Category pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "99px",
                  fontSize: "13px",
                  fontWeight: "500",
                  backgroundColor: activeCategory === cat ? "var(--text-primary)" : "rgba(16, 34, 77, 0.05)",
                  color: activeCategory === cat ? "#ffffff" : "var(--text-primary)",
                  transition: "var(--transition-fast)"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "320px"
          }}>
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 36px",
                borderRadius: "99px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                outline: "none",
                backgroundColor: "#ffffff",
                color: "var(--text-primary)"
              }}
            />
            {/* Search Icon */}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--text-secondary)" 
              strokeWidth="2"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
            </svg>
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <h3 style={{ fontSize: "18px", color: "var(--text-primary)" }}>No products found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "8px" }}>Try searching for another keyword or filter.</p>
          </div>
        ) : (
          <div className="grid-3" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "36px"
          }}>
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onClick={() => setSelectedProduct(prod)}
                layoutVariant="shop"
              />
            ))}
          </div>
        )}
      </div>

      {/* Details modal */}
      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </main>
  );
}
