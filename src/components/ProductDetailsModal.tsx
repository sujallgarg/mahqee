"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, useCart } from "@/context/CartContext";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) return null;

  // Initialize selected color to first option if color options exist
  const activeColor = selectedColor || (product.colors && product.colors[0]);

  const handleBuy = () => {
    addToCart(product, 1, activeColor);
    onClose();
  };

  // Helper to render high fidelity CSS graphic of each product
  const renderModalProductGraphic = () => {
    let liquidBg = "linear-gradient(180deg, rgba(237, 116, 178, 0.25), rgba(38, 209, 240, 0.25))"; // default pink/blue
    
    if (activeColor) {
      if (activeColor.name.includes("Blue") || activeColor.name.includes("Electric")) {
        liquidBg = "linear-gradient(180deg, rgba(38, 209, 240, 0.35), rgba(38, 209, 240, 0.15))";
      } else if (activeColor.name.includes("Pink") || activeColor.name.includes("Orchid") || activeColor.name.includes("Petal")) {
        liquidBg = "linear-gradient(180deg, rgba(237, 116, 178, 0.35), rgba(237, 116, 178, 0.15))";
      } else if (activeColor.name.includes("Indigo") || activeColor.name.includes("Royal")) {
        liquidBg = "linear-gradient(180deg, rgba(16, 34, 77, 0.45), rgba(16, 34, 77, 0.15))";
      }
    } else if (product.id === "alchemists-oil") {
      liquidBg = "linear-gradient(180deg, rgba(255, 220, 150, 0.4), rgba(229, 168, 64, 0.2))";
    } else if (product.id === "cleansing-balm") {
      liquidBg = "linear-gradient(180deg, rgba(250, 235, 240, 0.8), rgba(237, 116, 178, 0.15))";
    } else if (product.id === "rose-hydrosol") {
      liquidBg = "linear-gradient(180deg, rgba(237, 116, 178, 0.2), rgba(237, 116, 178, 0.05))";
    } else if (product.id === "eye-nectar") {
      liquidBg = "linear-gradient(180deg, rgba(38, 209, 240, 0.2), rgba(38, 209, 240, 0.05))";
    }

    if (product.category === "Creams") {
      return (
        <div className="modal-cream-pot">
          <div className="modal-cream-lid" />
          <div className="modal-cream-jar" style={{ background: liquidBg }} />
          <div className="modal-jar-shine" />
          <div className="modal-jar-label">{product.name}</div>
        </div>
      );
    } else if (product.category === "Oils") {
      return (
        <div className="modal-oil-vial">
          <div className="modal-vial-cap" />
          <div className="modal-vial-glass" style={{ background: liquidBg }} />
          <div className="modal-vial-shine" />
          <div className="modal-vial-label">{product.name}</div>
        </div>
      );
    } else {
      return (
        <div className="modal-serum-bottle">
          <div className="modal-serum-dropper" />
          <div className="modal-serum-cap" />
          <div className="modal-serum-glass" style={{ background: liquidBg }} />
          <div className="modal-serum-shine" />
          <div className="modal-serum-label">{product.name}</div>
        </div>
      );
    }
  };



  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0, 0, 0.5)",
          backdropFilter: "blur(6px)",
          animation: "modalFadeIn 0.3s ease"
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "960px",
        maxHeight: "90vh",
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "28px",
        boxShadow: "var(--shadow-lg)",
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        zIndex: 2001,
        animation: "modalPopIn 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
      }} className="modal-grid">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            padding: "8px",
            borderRadius: "50%",
            backgroundColor: "var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
          }}
          aria-label="Close details"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1L13 13M1 13L13 1" />
          </svg>
        </button>

        {/* Left Panel - Visual presentation */}
        <div style={{
          backgroundColor: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 24px 32px 24px",
          position: "relative",
          minHeight: "450px"
        }}>
          {/* Main Visual */}
          <div 
            onClick={() => setIsZoomed(true)}
            style={{
              position: "relative",
              width: "100%",
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "white",
              border: "1px solid rgba(16, 34, 77, 0.04)",
              cursor: "zoom-in"
            }}
          >
            {(product.image.startsWith("/") || product.image.startsWith("data:image/")) ? (
              <Image 
                src={product.images && product.images[activeImageIndex % product.images.length] ? product.images[activeImageIndex % product.images.length] : product.image} 
                alt={product.name} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain" }} 
                priority
              />
            ) : (
              <div style={{ transform: "scale(1.2)" }}>
                {renderModalProductGraphic()}
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              {product.images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    position: "relative",
                    width: "54px",
                    height: "54px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: activeImageIndex === idx ? "2.5px solid var(--accent-pink)" : "1.5px solid var(--border-color)",
                    backgroundColor: "#eaeae8",
                    padding: 0,
                    cursor: "pointer",
                    transition: "var(--transition-fast)"
                  }}
                  className="gallery-thumb-btn"
                >
                  <Image 
                    src={imgSrc} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    fill
                    sizes="54px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
          
          <div style={{
            textAlign: "center",
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginTop: "12px"
          }}>
            {/* Rendered in 100% Recyclable Luxury Frosted Glass */}
          </div>
        </div>

        {/* Right Panel - Context detail lists */}
        <div style={{ padding: "48px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "1px",
            color: "var(--accent-pink)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px"
          }}>
            {product.category}
          </span>
          
          <h2 style={{ fontSize: "36px", color: "var(--text-primary)", marginBottom: "8px" }}>
            {product.name}
          </h2>

          <div style={{ fontSize: "20px", color: "var(--text-primary)", fontWeight: "500", marginBottom: "24px" }}>
            ₹{product.price}.00
          </div>

          <p style={{ fontSize: "14.5px", lineHeight: "1.6", color: "var(--text-secondary)", marginBottom: "28px" }}>
            {product.description}
          </p>

          {/* Swatches selector inside modal */}
          {product.colors && (
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                Select formulation tone:
              </span>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {product.colors.map((color) => {
                  const isSelected = activeColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "99px",
                        backgroundColor: isSelected ? "var(--text-primary)" : "var(--bg-primary)",
                        color: isSelected ? "#fff" : "var(--text-primary)",
                        border: "1px solid var(--border-color)",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: color.hex, display: "inline-block" }} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}



          {/* Active Ingredients list */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "12px" }}>
              Key Product Specifications
            </h4>
            <ul style={{ paddingLeft: "18px", color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
              {product.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </div>

          {/* Direct Buy Button */}
          <button 
            onClick={handleBuy} 
            className="btn-primary" 
            style={{ width: "100%", justifyContent: "center", padding: "14px" }}
          >
            Add to Bag — ₹{product.price}.00
          </button>
        </div>
      </div>

      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            cursor: "zoom-out",
            animation: "zoomFadeIn 0.3s ease"
          }}
        >
          {/* Close button in top-right */}
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3001,
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1L13 13M1 13L13 1" />
            </svg>
          </button>
          
          <div style={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            animation: "zoomPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <Image
              src={product.images && product.images[activeImageIndex % product.images.length] ? product.images[activeImageIndex % product.images.length] : product.image}
              alt={product.name}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes zoomFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomPopIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 800px) {
          .modal-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Large Modal custom CSS bottle mockups */
        .modal-serum-bottle {
          position: relative;
          width: 90px;
          height: 160px;
        }
        .modal-serum-dropper {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 12px;
          background: #fafafa;
          border-radius: 2px;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .modal-serum-cap {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 18px;
          background: linear-gradient(90deg, #d8d8d8, #ffffff, #b8b8b8);
          border-radius: 2px;
        }
        .modal-serum-glass {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 90px;
          height: 142px;
          border-radius: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 0 15px rgba(255,255,255,0.3);
        }
        .modal-serum-shine {
          position: absolute;
          top: 24px;
          left: 8px;
          width: 5px;
          height: 108px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 2.5px;
        }
        .modal-serum-label {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 48px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.05);
          font-size: 5.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          color: #000;
          text-align: center;
        }

        /* Large Modal Cream Pot */
        .modal-cream-pot {
          position: relative;
          width: 110px;
          height: 110px;
        }
        .modal-cream-lid {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 20px;
          background: linear-gradient(90deg, #d8d8d8, #ffffff, #b8b8b8);
          border-radius: 4px;
          z-index: 5;
        }
        .modal-cream-jar {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 90px;
          border-radius: 2px 2px 20px 20px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 0 15px rgba(255,255,255,0.3);
        }
        .modal-jar-shine {
          position: absolute;
          top: 24px;
          left: 12px;
          width: 5px;
          height: 60px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 2px;
        }
        .modal-jar-label {
          position: absolute;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          width: 72px;
          height: 34px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.05);
          font-size: 5.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          color: #000;
          z-index: 6;
          text-align: center;
        }

        /* Large Modal Oil Vial */
        .modal-oil-vial {
          position: relative;
          width: 75px;
          height: 180px;
        }
        .modal-vial-cap {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 44px;
          height: 32px;
          background: linear-gradient(90deg, #d8d8d8, #ffffff, #b8b8b8);
          border-radius: 4px;
        }
        .modal-vial-glass {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 75px;
          height: 148px;
          border-radius: 10px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 0 15px rgba(255,255,255,0.3);
        }
        .modal-vial-shine {
          position: absolute;
          top: 36px;
          left: 8px;
          width: 4px;
          height: 100px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 2px;
        }
        .modal-vial-label {
          position: absolute;
          top: 55px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 52px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.05);
          font-size: 5.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          color: #000;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
