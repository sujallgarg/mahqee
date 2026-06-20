"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main style={{
      minHeight: "100vh",
      padding: "160px 24px 120px 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            color: "var(--accent-pink)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px"
          }}>
            Our Philosophy
          </span>
          <h1 style={{
            fontSize: "44px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            marginBottom: "16px"
          }}>
            Conscious Biotechnology
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "15px",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            MAHQEE was born out of a desire to create a skincare lineup that combines pure botanical essences with clinical biotech formulations.
          </p>
        </div>

        {/* Narrative Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px", marginBottom: "60px" }}>
          
          {/* Section 1: The Bio-Tech Bridge */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "36px",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid var(--border-color)",
            padding: "36px",
            boxShadow: "var(--shadow-sm)"
          }} className="about-grid-row">
            <div>
              <h3 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                The Bio-Tech Bridge
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "12px" }}>
                Traditional organic skincare relies on crude plant extracts that degrade quickly and struggle to penetrate the lipid barrier.
              </p>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                At MAHQEE, we isolate active stem cell matrices from rare botanical specimens—like the high-altitude Orchid—and stabilize them with biocompatible peptides. This ensures targeted cellular activation.
              </p>
            </div>
            {/* Visual representation */}
            <div style={{
              height: "200px",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(16, 34, 77, 0.06)"
            }}>
              <Image 
                src="/images/about-biotech.png" 
                alt="Conscious Skincare Biotechnology" 
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Section 2: Clinical Efficacy */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "36px",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid var(--border-color)",
            padding: "36px",
            boxShadow: "var(--shadow-sm)"
          }} className="about-grid-row">
            {/* Visual representation */}
            <div style={{
              height: "200px",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(16, 34, 77, 0.06)",
              order: 2
            }} className="about-media-col">
              <Image 
                src="/images/about-clinical.png" 
                alt="Clinical Validation" 
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
              {/* Overlay card */}
              <div style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                width: "110px",
                height: "64px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                boxShadow: "var(--shadow-sm)",
                zIndex: 2
              }}>
                <div style={{ fontSize: "9px", fontWeight: "600", color: "var(--text-secondary)" }}>EFFICACY</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--accent-pink)" }}>+94%</div>
                <div style={{ fontSize: "8px", color: "var(--text-secondary)" }}>Cellular turnover</div>
              </div>
            </div>
            <div style={{ order: 1 }}>
              <h3 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                Clinically Validated
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "12px" }}>
                We do not believe in cosmetic placeholders. Every drop of serum is engineered to stimulate tissue synthesis and restore natural moisture balance.
              </p>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Our formulations go through rigorous multi-week clinical trials on voluntary human subjects, monitored by independent dermatologists to ensure certified, visible results.
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center",
          backgroundColor: "var(--text-primary)",
          color: "#ffffff",
          borderRadius: "24px",
          padding: "40px 30px"
        }}>
          <h2 style={{ fontSize: "26px", color: "#ffffff", marginBottom: "12px", fontFamily: "var(--font-serif)" }}>
            Discover the Difference
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: "1.5" }}>
            Take our AI skin consultation questionnaire or shop our bestselling organic botanical cell elixirs.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/skininsights" className="btn-primary" style={{ backgroundColor: "#ffffff", color: "var(--text-primary)", border: "none" }}>
              SkinInsights AI
            </Link>
            <Link href="/shop" className="btn-secondary" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
              Shop Catalog
            </Link>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes pulseAura {
          0% { transform: scale(0.9); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(0.9); opacity: 0.15; }
        }
        @media (max-width: 768px) {
          .about-grid-row {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 24px !important;
          }
          .about-media-col {
            order: -1 !important;
          }
        }
      `}</style>
    </main>
  );
}
