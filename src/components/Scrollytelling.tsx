import React, { useRef, useState } from "react";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCart, Product } from "@/context/CartContext";

interface Step {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glow: string;
  label: string;
}

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

export default function Scrollytelling({ onLearnMore }: ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { products } = useCart();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Track scroll progress of this section (from 0 to 1)
  const progress = useScrollProgress(containerRef);

  // Find display products from active catalog, otherwise fall back to fallback data
  const displayIds = ["makeup-wedges", "pink-scrunchie", "face-roller", "hair-rollers", "makeup-bag"];
  const displayProducts = displayIds.map(id => {
    const found = products.find(p => p.id === id);
    if (found) return found;
    return fallbackProducts.find(p => p.id === id) || fallbackProducts[0];
  });

  // Normalize progress to the stuck phase [0.333, 0.667]
  const stickyProgress = Math.max(0, Math.min(1, (progress - 0.333) / 0.334));

  // Divide the stuck phase progress into 3 distinct active phases
  let activeIndex = 0;
  if (stickyProgress > 0.66) {
    activeIndex = 2;
  } else if (stickyProgress > 0.33) {
    activeIndex = 1;
  }

  // Animation values based on scroll progress
  // Scale the bottle slightly as we scroll deep
  const bottleScale = 1 + (progress * 0.15); 
  const bottleRotation = (progress - 0.5) * 15; // rotate between -7.5 and 7.5 deg

  const steps: Step[] = [
    {
      title: "Rare Orchid Stem Cells",
      subtitle: "Cellular Renewal & Lift",
      description: "Extracted from rare organic orchids. These cells activate skin longevity pathways, accelerating cellular regeneration and improving skin firmness by up to 34% in 4 weeks.",
      color: "linear-gradient(180deg, rgba(237, 116, 178, 0.35), rgba(237, 116, 178, 0.1))",
      glow: "0 0 40px rgba(237, 116, 178, 0.4)",
      label: "ORCHID STEM CELLS"
    },
    {
      title: "Copper Peptides Complex",
      subtitle: "Elasticity & Repair",
      description: "A high-performance peptide compound that promotes collagen and elastin synthesis. It repairs damaged skin barriers, tightens sagging areas, and gives a youthful bounce.",
      color: "linear-gradient(180deg, rgba(38, 209, 240, 0.35), rgba(38, 209, 240, 0.1))",
      glow: "0 0 40px rgba(38, 209, 240, 0.4)",
      label: "COPPER PEPTIDES"
    },
    {
      title: "Triple Weight Hyaluronic",
      subtitle: "Deep Multi-Layer Hydration",
      description: "Formulated with three distinct molecular weights to penetrate deeper skin layers. It binds up to 1,000 times its weight in water, instantly plumping wrinkles and smoothing textures.",
      color: "linear-gradient(180deg, rgba(16, 34, 77, 0.35), rgba(38, 209, 240, 0.1))",
      glow: "0 0 40px rgba(16, 34, 77, 0.3)",
      label: "HYALURONIC ACID"
    }
  ];

  return (
    <div 
      id="scrollytelling"
      ref={containerRef} 
      style={{
        position: "relative",
        height: "200vh", // Provides space for scroll events
        width: "100%",
        backgroundColor: "var(--bg-primary)"
      }}
    >
      {/* Sticky Screen holding the visual & active copy */}
      <div className="sticky-wrapper" style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <div className="container" style={{
          position: "relative",
          width: "100%",
          height: "100%",
          maxHeight: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Layout A: Step 0 Interactive 5-Column Product Showcase */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: activeIndex === 0 ? 1 : 0,
            pointerEvents: activeIndex === 0 ? "auto" : "none",
            transform: activeIndex === 0 ? "scale(1)" : "scale(0.95)",
            transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            zIndex: activeIndex === 0 ? 2 : 1
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "space-between",
              alignItems: "center"
            }} className="showcase-step-container">
              {/* Title */}
              <h2 style={{
                fontSize: "clamp(24px, 3.5vw, 32px)",
                color: "#10224d",
                fontWeight: "600",
                textAlign: "center",
                margin: "0 0 24px 0",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.5px"
              }}>
                Loved by the Gubb Gang
              </h2>

              {/* Columns container */}
              <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: "16px",
                justifyContent: "space-between",
                alignItems: "stretch",
                flex: 1,
                minHeight: "340px"
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
                        backgroundColor: "#f7f7f7",
                        position: "relative",
                        border: "1px solid var(--border-color)",
                        boxShadow: isHovered ? "0 10px 20px rgba(16, 34, 77, 0.12)" : "0 2px 8px rgba(0,0,0,0.02)",
                        transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
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
                  marginTop: "24px",
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

          {/* Layout B: Step 1 & 2 Two-Column Interactive Grid */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            alignItems: "center",
            gap: "48px",
            opacity: activeIndex !== 0 ? 1 : 0,
            pointerEvents: activeIndex !== 0 ? "auto" : "none",
            transform: activeIndex !== 0 ? "scale(1)" : "scale(1.05)",
            transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            zIndex: activeIndex !== 0 ? 2 : 1
          }} className="scrolly-split-grid">
            {/* Left Side: Descriptions that switch based on scroll index */}
            <div style={{ position: "relative", height: "350px" }}>
              {steps.map((step, idx) => {
                if (idx === 0) return null; // Step 0 is fully displayed in Layout A
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      transform: isActive 
                        ? "translateY(-50%) scale(1)" 
                        : `translateY(${idx < activeIndex ? "-120%" : "20%"}) scale(0.95)`,
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                      transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                      width: "100%"
                    }}
                  >
                    <span style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.15em",
                      color: "var(--accent-pink)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "12px"
                    }}>
                      Active Ingredient {idx + 1}
                    </span>
                    
                    <h2 style={{
                      fontSize: "clamp(32px, 5vw, 48px)",
                      lineHeight: "1.1",
                      color: "var(--text-primary)",
                      marginBottom: "16px"
                    }}>
                      {step.title}
                    </h2>
                    
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      marginBottom: "20px"
                    }}>
                      {step.subtitle}
                    </h3>
                    
                    <p style={{
                      fontSize: "15px",
                      lineHeight: "1.7",
                      color: "var(--text-secondary)",
                      maxWidth: "480px"
                    }}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Visual representation with dynamic properties */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}>
              <div style={{
                position: "relative",
                transform: `scale(${bottleScale}) rotate(${bottleRotation}deg)`,
                transition: "transform 0.15s ease-out, filter 0.5s ease",
                width: "180px",
                height: "310px",
                filter: `drop-shadow(${steps[activeIndex].glow})`
              }}>
                <div className="glass-bottle-scrolly">
                  <div className="scrolly-dropper" />
                  <div className="scrolly-cap" />
                  
                  {/* Liquid that changes color depending on active phase */}
                  <div 
                    className="scrolly-liquid" 
                    style={{
                      background: steps[activeIndex].color,
                      transition: "background 0.8s ease"
                    }}
                  />
                  
                  <div className="scrolly-shine" />
                  
                  {/* Dynamically changing labels */}
                  <div className="scrolly-label">
                    <span style={{ fontSize: "6px", letterSpacing: "1.5px", fontWeight: "600" }}>MAHQEE</span>
                    <div style={{ width: "10px", height: "0.5px", backgroundColor: "#000", margin: "3px 0" }} />
                    <span style={{ 
                      fontSize: "5px", 
                      letterSpacing: "0.5px", 
                      textAlign: "center",
                      transition: "opacity 0.3s ease",
                      fontWeight: "600"
                    }}>
                      {steps[activeIndex].label}
                    </span>
                  </div>
                </div>
                
                {/* Shadow */}
                <div className="scrolly-shadow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles local to the scrollytelling visual */}
      <style jsx>{`
        .glass-bottle-scrolly {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 35px 35px 12px 12px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
          box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.4),
            inset -5px -5px 15px rgba(0, 0, 0, 0.05),
            0 10px 25px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(8px);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scrolly-dropper {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 20px;
          background: #fafafa;
          border-radius: 6px 6px 0 0;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .scrolly-cap {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          height: 28px;
          background: linear-gradient(90deg, #d8d8d8, #ffffff, #b8b8b8);
          border-radius: 4px;
          border-bottom: 2px solid rgba(0,0,0,0.1);
          z-index: 5;
        }

        .scrolly-liquid {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 78%;
          border-radius: 0 0 16px 16px;
          filter: blur(0.5px);
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .scrolly-shine {
          position: absolute;
          top: 35px;
          left: 12px;
          width: 6px;
          height: 75%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), transparent);
          border-radius: 3px;
        }

        .scrolly-label {
          position: absolute;
          top: 52%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 80px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          color: #000;
          z-index: 10;
        }

        .scrolly-shadow {
          position: absolute;
          bottom: -15px;
          left: 5%;
          width: 90%;
          height: 15px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.05), transparent 70%);
          z-index: 0;
        }

        .showcase-cta-btn:hover {
          background-color: var(--accent-pink) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .sticky-wrapper {
            padding: 48px 0;
            height: auto !important;
            min-height: 100vh;
          }
          .scrolly-split-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            position: relative !important;
            height: auto !important;
          }
          .scrolly-shadow {
            display: none;
          }
          .sticky-wrapper :global(> .container) {
            height: auto !important;
            min-height: 500px;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center;
          }
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
            margin-top: 16px !important;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
