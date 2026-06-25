"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  showSwatches?: boolean;
  showBuyNow?: boolean;
  showBestSellerBadge?: boolean;
  showNewBadge?: boolean;
  cardOffset?: number;
  layoutVariant?: "shop" | "best-seller" | "slider";
}

export default function ProductCard({
  product,
  onClick,
  showSwatches = true,
  showBuyNow = true,
  showBestSellerBadge = false,
  showNewBadge = false,
  cardOffset,
  layoutVariant = "shop"
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [activeVisual, setActiveVisual] = useState(0);

  const activeColor = selectedColor || (product.colors && product.colors[0]);

  // Color selection click handler
  const handleColorSelect = (e: React.MouseEvent, color: { name: string; hex: string }) => {
    e.stopPropagation();
    setSelectedColor(color);
  };

  // Add to cart click handler
  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, activeColor);
  };

  const renderStars = () => {
    const starsCount = product.id.includes("balm") ? 4 : 5;
    const hasHalf = product.id.includes("balm");
    return (
      <div className="product-card-stars" style={{ display: "flex", gap: "2px", color: "var(--text-primary)", margin: "4px 0", justifyContent: "flex-start" }}>
        {[...Array(starsCount)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        {hasHalf && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" opacity="0.3" />
            <path d="M12 2v15.27l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2z" />
          </svg>
        )}
      </div>
    );
  };

  const renderProductVisual = (viewIndex: number) => {
    let liquidColor = "linear-gradient(180deg, rgba(237, 116, 178, 0.25), rgba(38, 209, 240, 0.25))";
    
    if (activeColor) {
      if (activeColor.name.includes("Blue") || activeColor.name.includes("Electric")) {
        liquidColor = "linear-gradient(180deg, rgba(38, 209, 240, 0.35), rgba(38, 209, 240, 0.15))";
      } else if (activeColor.name.includes("Pink") || activeColor.name.includes("Orchid") || activeColor.name.includes("Petal")) {
        liquidColor = "linear-gradient(180deg, rgba(237, 116, 178, 0.35), rgba(237, 116, 178, 0.15))";
      } else if (activeColor.name.includes("Indigo") || activeColor.name.includes("Royal")) {
        liquidColor = "linear-gradient(180deg, rgba(16, 34, 77, 0.45), rgba(16, 34, 77, 0.15))";
      }
    } else if (product.id === "alchemists-oil") {
      liquidColor = "linear-gradient(180deg, rgba(255, 220, 150, 0.4), rgba(229, 168, 64, 0.25))";
    }

    if (viewIndex === 1) {
      // Texture View (Liquid Droplet or Cream Swipe)
      if (product.category === "Creams") {
        return (
          <div className="mini-cream-swipe" style={{ width: "120px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: "70px",
              height: "22px",
              background: "linear-gradient(90deg, #ffffff 0%, #f2f1f6 80%, rgba(242, 241, 246, 0) 100%)",
              borderRadius: "30px 10px 30px 10px",
              boxShadow: "2px 4px 10px rgba(16, 34, 77, 0.08)",
              transform: "rotate(-10deg) scale(1.1)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "3px",
                left: "8px",
                width: "30px",
                height: "3px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%"
              }} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="mini-droplet-render" style={{ width: "80px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: "32px",
              height: "44px",
              background: liquidColor,
              borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
              transform: "rotate(45deg) scale(1.1)",
              boxShadow: "0 6px 15px rgba(16, 34, 77, 0.1), inset -2px -2px 8px rgba(0,0,0,0.05)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "5px",
                height: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                borderRadius: "50%",
                transform: "rotate(-15deg)"
              }} />
            </div>
          </div>
        );
      }
    } else if (viewIndex === 2) {
      // Science View (Bio-active Molecule)
      return (
        <div className="mini-molecule-render" style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "1px dashed var(--accent-pink)",
            borderRadius: "50%",
            position: "absolute",
            animation: "spin 12s linear infinite"
          }} />
          <div style={{
            width: "34px",
            height: "34px",
            border: "1px solid var(--accent-blue)",
            borderRadius: "50%",
            position: "absolute"
          }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--text-primary)", position: "absolute" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent-pink)", position: "absolute", transform: "translate(22px, -8px)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent-blue)", position: "absolute", transform: "translate(-20px, 15px)" }} />
        </div>
      );
    }

    // Default View 0 (Programmatic Product Graphic)
    if (product.category === "Creams") {
      return (
        <div className="mini-cream-tub" style={{ transform: "scale(1.2)" }}>
          <div className="mini-tub-lid" />
          <div className="mini-tub-pot" style={{ background: liquidColor }} />
        </div>
      );
    } else if (product.category === "Oils") {
      return (
        <div className="mini-squeeze-tube" style={{ transform: "scale(1.1)" }}>
          <div className="mini-tube-cap" />
          <div className="mini-tube-body" style={{ background: liquidColor }} />
        </div>
      );
    } else {
      return (
        <div className="mini-serum-dropper-bottle" style={{ transform: "scale(1.2)" }}>
          <div className="mini-dropper-top" />
          <div className="mini-dropper-cap" />
          <div className="mini-dropper-body" style={{ background: liquidColor }} />
        </div>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className="product-card-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        cursor: "pointer",
        position: "relative",
        transform: cardOffset ? `translateY(${cardOffset}px)` : "none",
        width: layoutVariant === "slider" ? "310px" : "100%",
        flex: layoutVariant === "slider" ? "0 0 310px" : "initial",
        scrollSnapAlign: layoutVariant === "slider" ? "start" : "initial",
        transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
    >
      {/* Visual Illustration Wrapper */}
      <div 
        className="card-visual-wrapper"
        style={{ 
          width: "100%", 
          height: "300px", 
          backgroundColor: "#eaeae8", 
          borderRadius: "12px", 
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: "16px",
          border: "1px solid rgba(16, 34, 77, 0.04)",
          transition: "var(--transition-smooth)"
        }}
      >
        {/* Best Seller Badge */}
        {(showBestSellerBadge || product.isBestSeller) && (
          <div style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "var(--text-primary)",
            color: "#ffffff",
            fontSize: "8.5px",
            fontWeight: "600",
            padding: "4px 10px",
            borderRadius: "99px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 5
          }}>
            Best Seller
          </div>
        )}

        {/* Dynamic Visual Content */}
        <div className="floating-element-1" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {(product.image.startsWith("/") || product.image.startsWith("data:image/")) ? (
            <Image 
              src={product.images && product.images[activeVisual % product.images.length] ? product.images[activeVisual % product.images.length] : product.image} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }} 
            />
          ) : (
            <div style={{ height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {renderProductVisual(activeVisual)}
            </div>
          )}
        </div>

        {/* Visual switcher indicator dots overlay */}
        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          zIndex: 5
        }}>
          {[...Array((product.image.startsWith("/") || product.image.startsWith("data:image/")) && product.images ? product.images.length : 3)].map((_, idx) => {
            const isActive = activeVisual % ((product.image.startsWith("/") || product.image.startsWith("data:image/")) && product.images ? product.images.length : 3) === idx;
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVisual(idx);
                }}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "var(--text-primary)" : "rgba(16, 34, 77, 0.15)",
                  padding: 0,
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.2s",
                  border: "none"
                }}
                aria-label={`View visual ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Option swatches (colors) if available */}
      {showSwatches && product.colors && (
        <div className="product-card-swatches" style={{ display: "flex", gap: "6px", marginBottom: "12px", width: "100%", justifyContent: "flex-start" }}>
          {product.colors.map((color) => {
            const isSelected = activeColor?.name === color.name;
            return (
              <button
                key={color.name}
                onClick={(e) => handleColorSelect(e, color)}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: color.hex,
                  border: isSelected ? "1.5px solid var(--text-primary)" : "1px solid rgba(0,0,0,0.1)",
                  padding: 0,
                  transform: isSelected ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.2s"
                }}
                aria-label={`Select ${color.name}`}
              />
            );
          })}
        </div>
      )}

      {/* Text Details Block (Left aligned) */}
      <div className="product-card-details" style={{ textAlign: "left", width: "100%", padding: "4px 0" }}>
        {showNewBadge && (
          <span style={{
            fontSize: "10px",
            color: "var(--accent-pink)",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "4px"
          }}>
            New
          </span>
        )}
        
        <h3 style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "4px",
          fontFamily: "var(--font-sans)",
          lineHeight: "1.3"
        }}>
          {product.name}
        </h3>
        
        <p style={{
          fontSize: "12.5px",
          color: "var(--text-secondary)",
          marginBottom: "6px",
          lineHeight: "1.4",
          minHeight: "34px"
        }}>
          {product.tagline}
        </p>

        {layoutVariant === "best-seller" && renderStars()}

        <div style={{ 
          fontSize: "14px", 
          fontWeight: "600", 
          color: "var(--text-primary)", 
          margin: "8px 0 16px 0" 
        }}>
          {layoutVariant === "best-seller" ? `On Sale from ₹${product.price}.00` : `From ₹${product.price}.00`}
        </div>
      </div>

      {/* Actions */}
      {showBuyNow && (
        <div style={{ width: "100%" }}>
          <button 
            onClick={handleBuyClick}
            className="card-cta-btn"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "13px",
              fontWeight: "600",
              backgroundColor: "var(--text-primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "var(--transition-fast)"
            }}
          >
            {layoutVariant === "best-seller" ? "Add to Bag" : "Buy Now"}
          </button>
        </div>
      )}

      <style jsx global>{`
        .product-card-container:hover .card-visual-wrapper {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .visual-nav-btn:hover {
          background-color: #ffffff !important;
        }
        .card-cta-btn:hover {
          background-color: var(--accent-pink) !important;
          transform: translateY(-1px);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .product-card-container {
            align-items: stretch !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .card-visual-wrapper {
            height: 160px !important;
            margin-bottom: 8px !important;
          }
          .product-card-details {
            text-align: left !important;
            padding: 2px 4px !important;
          }
          .product-card-swatches, .product-card-stars {
            justify-content: flex-start !important;
          }
          .product-card-details h3 {
            font-size: 13px !important;
            margin-bottom: 2px !important;
          }
          .product-card-details p {
            font-size: 10.5px !important;
            min-height: auto !important;
            margin-bottom: 4px !important;
          }
          .card-cta-btn {
            padding: 8px !important;
            font-size: 11px !important;
            letter-spacing: 0.02em !important;
            border-radius: 4px !important;
          }
        }
      `}</style>
    </div>
  );
}
