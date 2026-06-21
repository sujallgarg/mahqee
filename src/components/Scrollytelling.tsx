"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface Step {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glow: string;
  label: string;
}

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this section (from 0 to 1)
  const progress = useScrollProgress(containerRef);

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
          {/* Layout A: Step 0 Full-Width Original Banner */}
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
              position: "relative",
              width: "100%",
              aspectRatio: "1024 / 436",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-md)",
              backgroundColor: "#ffffff"
            }} className="scrolly-full-banner">
              <Image
                src="/images/orchid-stem-cells.png"
                alt="MAHQEE Orchid Stem Cells Banner"
                fill
                priority
                style={{ objectFit: "cover" }}
                unoptimized
              />
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
        }
      `}</style>
    </div>
  );
}
