"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, Product } from "@/context/CartContext";

interface ScrollytellingProps {
  onLearnMore?: (product: Product) => void;
}

const fallbackProducts: Product[] = [
  {
    id: "makeup-wedges",
    name: "MAKEUP WEDGES",
    tagline: "Streak-Free Application",
    category: "Tools",
    price: 199,
    description: "Premium cosmetic wedges designed for smooth, streak-free liquid and cream foundation application.",
    image: "/images/makeup-wedges.png",
    images: ["/images/makeup-wedges.png"],
    ingredients: ["Latex-free premium polymer", "Soft-touch blending surface"],
    benefits: ["Precise and even cosmetic blending", "Minimal product absorption and waste"]
  },
  {
    id: "pink-scrunchie",
    name: "Light Pink Satin Scrunchie",
    tagline: "Gentle Crease-Free Hold",
    category: "Tools",
    price: 128,
    description: "Luxury light pink satin scrunchie designed to hold hair comfortably without causing pulling, snagging, or creasing.",
    image: "/images/pink-scrunchie.png",
    images: ["/images/pink-scrunchie.png"],
    ingredients: ["100% Premium satin silk wrapper", "High-elastic inner core band"],
    benefits: ["Frizz-free and crease-free styling", "Prevents hair breakage and pulling split ends"]
  },
  {
    id: "face-roller",
    name: "Rose Quartz Face Roller",
    tagline: "Lymphatic Drainage & Contouring",
    category: "Tools",
    price: 1870,
    description: "Authentic rose quartz facial roller designed to reduce morning puffiness, stimulate lymphatic drainage, and assist product absorption.",
    image: "/images/face-roller.png",
    images: ["/images/face-roller.png"],
    ingredients: ["100% Natural certified rose quartz stone", "Noise-free smooth silicone inserts"],
    benefits: ["Reduces inflammation and morning puffiness", "Improves blood circulation and skin elasticity"]
  },
  {
    id: "hair-rollers",
    name: "Hair Roller Medium",
    tagline: "Heatless Blowout Volume",
    category: "Tools",
    price: 182,
    description: "Medium-sized self-grip velcro rollers to create bouncy blowouts and root lift without thermal damage.",
    image: "/images/hair-rollers.png",
    images: ["/images/hair-rollers.png"],
    ingredients: ["Premium self-grip velcro material", "Lightweight hollow inner core"],
    benefits: ["Adds dramatic root lift and volume", "Gentle heatless styling for daily curls"]
  },
  {
    id: "makeup-bag",
    name: "Makeup Organiser Bag Brown",
    tagline: "Luxury Vegan Leather Organizer",
    category: "Tools",
    price: 697,
    description: "Sleek, double-compartment vanity travel organizer bag crafted from premium brown textured vegan leather.",
    image: "/images/makeup-bag.png",
    images: ["/images/makeup-bag.png"],
    ingredients: ["Waterproof saffiano vegan leather", "Premium gold metallic zip hardware"],
    benefits: ["Double zipper compartments for layout organization", "Spacious layout with compact exterior shape"]
  }
];

const productBgColors: Record<string, string> = {
  "makeup-wedges": "#ebdccb",
  "pink-scrunchie": "#f7dbdb",
  "face-roller": "#ebebeb",
  "hair-rollers": "#ffffff",
  "makeup-bag": "#faf5eb"
};

export default function Scrollytelling({ onLearnMore }: ScrollytellingProps) {
  const { products } = useCart();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find display products from active catalog, otherwise fall back to fallback data
  const displayIds = ["makeup-wedges", "pink-scrunchie", "face-roller", "hair-rollers", "makeup-bag"];
  const displayProducts = displayIds.map(id => {
    const found = products.find(p => p.id === id);
    if (found) return found;
    return fallbackProducts.find(p => p.id === id) || fallbackProducts[0];
  });

  return (
    <section 
      id="loved-by-mahqees"
      style={{
        width: "100%",
        backgroundColor: "var(--bg-primary)",
        padding: "var(--section-padding-y) 0"
      }}
    >
      <div className="container">
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center"
        }} className="showcase-step-container">
          {/* Title */}
          <h2 style={{
            fontSize: "clamp(24px, 3.5vw, 32px)",
            color: "#10224d",
            fontWeight: "600",
            textAlign: "center",
            margin: "0 0 40px 0",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.5px"
          }}>
            Loved by the MAHQEE&apos;S
          </h2>

          {/* Columns container */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "16px",
            justifyContent: "space-between",
            alignItems: "stretch",
            minHeight: "360px"
          }} className="showcase-columns-row">
            {displayProducts.map((prod, idx) => {
              const isHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;
              
              // Calculate dynamic flex basis
              let flexVal = 1;
              if (isAnyHovered) {
                flexVal = isHovered ? 1.6 : 0.85;
              }

              return (
                <div
                  key={prod.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onLearnMore?.(prod)}
                  style={{
                    flex: flexVal,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                    transform: isHovered ? "translateY(-12px)" : "translateY(0px)",
                    position: "relative"
                  }}
                  className="showcase-card"
                >
                  {/* Image card wrapper */}
                  <div style={{
                    width: "100%",
                    flex: 1,
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: productBgColors[prod.id] || "#ffffff",
                    position: "relative",
                    border: "1px solid var(--border-color)",
                    boxShadow: isHovered ? "0 10px 20px rgba(16, 34, 77, 0.12)" : "0 2px 8px rgba(0,0,0,0.02)",
                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                    aspectRatio: "1 / 1"
                  }}>
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 20vw"
                      style={{
                        objectFit: "cover",
                        transform: isHovered ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
                      }}
                      unoptimized
                    />
                  </div>

                  {/* Info box header styled box */}
                  <div style={{
                    marginTop: "12px",
                    backgroundColor: "#ffffff",
                    border: isHovered ? "1px solid #10224d" : "1px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: isHovered ? "0 4px 12px rgba(16, 34, 77, 0.08)" : "none",
                    transition: "all 0.3s ease"
                  }} className="showcase-info-box">
                    {/* Tiny Thumbnail */}
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      backgroundColor: productBgColors[prod.id] || "#ffffff",
                      border: "1px solid var(--border-color)"
                    }}>
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="36px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>

                    {/* Title & Price */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      overflow: "hidden"
                    }}>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#10224d",
                        textTransform: "uppercase",
                        letterSpacing: "0.2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {prod.name}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#10224d",
                        marginTop: "1px"
                      }}>
                        RS. {prod.price.toLocaleString("en-IN")}.00
                      </span>
                    </div>

                    {/* Arrow */}
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      stroke="#10224d" 
                      strokeWidth="1.5"
                      style={{
                        flexShrink: 0,
                        transform: isHovered ? "translateY(2px)" : "translateY(0px)",
                        transition: "transform 0.3s ease"
                      }}
                    >
                      <path d="M2 4L6 8L10 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Button */}
          <button 
            style={{
              backgroundColor: "#1c2b4d",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: "pointer",
              marginTop: "40px",
              boxShadow: "0 2px 6px rgba(28, 43, 77, 0.15)",
              transition: "background-color 0.2s ease, transform 0.2s ease"
            }}
            className="showcase-cta-btn"
            onClick={() => {
              const target = document.getElementById("category-grid");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            JOIN OUR COMMUNITY
          </button>
        </div>
      </div>

      <style jsx>{`
        .showcase-cta-btn:hover {
          background-color: var(--accent-pink) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .showcase-columns-row {
            flex-direction: column !important;
            gap: 12px !important;
            min-height: auto !important;
          }
          .showcase-card {
            flex: none !important;
            width: 100% !important;
            transform: none !important;
          }
          .showcase-card :global(.showcase-info-box) {
            margin-top: 8px !important;
          }
          .showcase-card > div:first-child {
            height: 180px !important;
            aspect-ratio: auto !important;
          }
          .showcase-cta-btn {
            margin-top: 24px !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
