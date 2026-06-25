"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCart, Product } from "@/context/CartContext";

interface ScrollytellingProps {
  onLearnMore?: (product: Product) => void;
}

const fallbackProducts: Product[] = [
  {
    id: "hair-rollers",
    name: "Hair Roller Medium",
    tagline: "Heatless Blowout Volume",
    category: "Hair",
    price: 182,
    description: "Medium-sized self-grip velcro rollers to create bouncy blowouts and root lift without thermal damage.",
    image: "/images/hair-rollers-slider.png",
    images: ["/images/hair-rollers-slider.png", "/images/hair-rollers-thumb.png"],
    ingredients: ["Premium self-grip velcro material", "Lightweight hollow inner core"],
    benefits: ["Adds dramatic root lift and volume", "Gentle heatless styling for daily curls"]
  },
  {
    id: "makeup-bag",
    name: "Makeup Organiser Bag Brown",
    tagline: "Luxury Vegan Leather Organizer",
    category: "Makeup",
    price: 697,
    description: "Sleek, double-compartment vanity travel organizer bag crafted from premium brown textured vegan leather.",
    image: "/images/makeup-bag-slider.png",
    images: ["/images/makeup-bag-slider.png", "/images/makeup-bag-thumb.png"],
    ingredients: ["Waterproof saffiano vegan leather", "Premium gold metallic zip hardware"],
    benefits: ["Double zipper compartments for layout organization", "Spacious layout with compact exterior shape"]
  },
  {
    id: "paddle-brush",
    name: "Tropical Bloom Paddle Hair Brush",
    tagline: "Detangle and Style in Style",
    category: "Hair",
    price: 244,
    description: "Gently detangles and styles hair, featuring high-quality flexible bristles and a premium tropical bloom pattern.",
    image: "/images/paddle-brush-slider.png",
    images: ["/images/paddle-brush-slider.png", "/images/paddle-brush-thumb.png"],
    ingredients: ["Anti-static ionic bristles", "Comfortable pneumatic cushion base"],
    benefits: ["Seamlessly detangles wet or dry hair", "Gentle on sensitive scalps", "Frizz-free finish"]
  },
  {
    id: "ice-globes",
    name: "Facial Ice Globes",
    tagline: "Calm and Cool Facial Massage",
    category: "Makeup",
    price: 839,
    description: "Premium glass facial ice globes to soothe skin, reduce puffiness, stimulate blood circulation, and enhance your daily skincare routine.",
    image: "/images/ice-globes-slider.png",
    images: ["/images/ice-globes-slider.png", "/images/ice-globes-thumb.png"],
    ingredients: ["High-borosilicate glass globes", "Non-freezing cosmetic fluid inside"],
    benefits: ["Soothes redness and calms skin", "Reduces morning under-eye puffiness", "Improves serum absorption"]
  },
  {
    id: "vanity-pouch",
    name: "Marshmallow Vanity Pouch",
    tagline: "Soft and Cute Storage Pouch",
    category: "Makeup",
    price: 665,
    description: "A soft, puffy marshmallow-style vanity storage pouch designed with a wide opening and travel-friendly handle.",
    image: "/images/vanity-pouch-slider.png",
    images: ["/images/vanity-pouch-slider.png", "/images/vanity-pouch-thumb.png"],
    ingredients: ["Premium soft quilted cotton outer", "Water-resistant interior lining"],
    benefits: ["Wide opening design for quick access", "Convenient carry handle", "Compact yet spacious"]
  }
];

const productBgColors: Record<string, string> = {
  "hair-rollers": "#ffffff",
  "makeup-bag": "#faf5eb",
  "paddle-brush": "#fceef0",
  "ice-globes": "#ebf5fb",
  "vanity-pouch": "#fcf0f2"
};

export default function Scrollytelling({ onLearnMore }: ScrollytellingProps) {
  const { products } = useCart();
  
  // Find display products from active catalog, otherwise fall back to fallback data
  const lovedProducts = products.filter(p => p.isLovedByMahqee);
  const displayProducts = lovedProducts.length > 0 ? lovedProducts : fallbackProducts;

  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, Math.min(2, Math.floor(displayProducts.length / 2))));
  const [isAutoplay, setIsAutoplay] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Safe clamp activeIndex if products list changes size dynamically
  const clampedActiveIndex = Math.min(activeIndex, Math.max(0, displayProducts.length - 1));

  // Set up autoplay timer
  useEffect(() => {
    if (!isAutoplay || displayProducts.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoplay, displayProducts.length]);

  const isLongCarousel = displayProducts.length > 4;
  const [isIntersecting, setIsIntersecting] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Setup Intersection Observer to only scroll active elements when in viewport (prevents initial page jump)
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }
    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  // Scroll active item into view horizontally without scrolling the parent page scroll window
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 900;
    if ((isMobile || isLongCarousel) && isIntersecting) {
      const card = cardRefs.current[clampedActiveIndex];
      const container = card?.parentElement;
      if (card && container) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2,
          behavior: "smooth"
        });
      }
    }
  }, [clampedActiveIndex, isLongCarousel, isIntersecting]);

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
          <div 
            ref={containerRef}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: "16px",
              justifyContent: isLongCarousel ? "flex-start" : "space-between",
              alignItems: "center",
              minHeight: "420px",
              position: "relative",
              overflowX: isLongCarousel ? "auto" : "visible",
              padding: isLongCarousel ? "12px 10px" : "0px",
              msOverflowStyle: "none",
              scrollbarWidth: "none"
            }} 
            className="showcase-columns-row"
          >
            {displayProducts.map((prod, idx) => {
              const isActive = clampedActiveIndex === idx;
              const thumbPath = prod.images && prod.images[1] ? prod.images[1] : prod.image;

              return (
                <div
                  key={prod.id}
                  ref={el => { cardRefs.current[idx] = el; }}
                  onMouseEnter={() => {
                    setActiveIndex(idx);
                    setIsAutoplay(false);
                  }}
                  onMouseLeave={() => {
                    setIsAutoplay(true);
                  }}
                  onClick={() => onLearnMore?.(prod)}
                  style={{
                    flex: isLongCarousel ? (isActive ? "0 0 280px" : "0 0 240px") : (isActive ? "1.15" : "0.95"),
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                    transform: isActive ? "translateY(-8px)" : "translateY(0px)",
                    position: "relative"
                  }}
                  className="showcase-card"
                >
                  {/* Image card wrapper */}
                  <div style={{
                    width: "100%",
                    height: isActive ? "330px" : "250px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: productBgColors[prod.id] || "#ffffff",
                    position: "relative",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: isActive ? "0 12px 24px rgba(16, 34, 77, 0.14)" : "0 2px 8px rgba(0,0,0,0.02)",
                    transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}>
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 20vw"
                      style={{
                        objectFit: "cover",
                        transform: isActive ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
                      }}
                      unoptimized
                    />
                  </div>

                  {/* Info box header styled box */}
                  <div style={{
                    marginTop: "12px",
                    backgroundColor: "#ffffff",
                    border: isActive ? "1px solid #10224d" : "1px solid var(--border-color)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: isActive ? "0 4px 12px rgba(16, 34, 77, 0.08)" : "none",
                    transition: "all 0.4s ease"
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
                        src={thumbPath}
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
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#10224d",
                        letterSpacing: "0.2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {prod.name}
                      </span>
                      <span style={{
                        fontSize: "12px",
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
                        transform: isActive ? "translateY(2px)" : "translateY(0px)",
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
        .showcase-columns-row::-webkit-scrollbar {
          display: none;
        }
        .showcase-columns-row {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .showcase-cta-btn:hover {
          background-color: var(--accent-pink) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .showcase-columns-row {
            flex-direction: row !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            padding: 16px 8px !important;
            gap: 16px !important;
            min-height: auto !important;
            align-items: center !important;
            -webkit-overflow-scrolling: touch;
          }
          .showcase-columns-row::-webkit-scrollbar {
            display: none;
          }
          .showcase-card {
            flex: 0 0 75% !important;
            max-width: 280px !important;
            scroll-snap-align: center !important;
            transform: none !important;
          }
          .showcase-card :global(.showcase-info-box) {
            margin-top: 8px !important;
          }
          .showcase-card > div:first-child {
            height: 250px !important;
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
