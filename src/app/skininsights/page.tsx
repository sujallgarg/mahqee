"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, productsData, useCart } from "@/context/CartContext";

export default function SkinInsightsPage() {
  const { addToCart } = useCart();
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [skinType, setSkinType] = useState("");
  const [skinConcern, setSkinConcern] = useState("");
  const [texturePref, setTexturePref] = useState("");
  const [recommendation, setRecommendation] = useState<Product | null>(null);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skinType || !skinConcern || !texturePref) return;

    setStep("loading");

    // Simulate AI synthesis diagnostic delay
    setTimeout(() => {
      // Logic to compute ideal recommendation
      let recommendedProduct: Product = productsData[0]; // fallback

      if (skinConcern === "Acne/Breakouts" || skinConcern === "Aging/Wrinkles") {
        recommendedProduct = productsData.find(p => p.id === "orchid-serum") || productsData[0];
      } else if (skinConcern === "Redness/Barrier Repair") {
        recommendedProduct = productsData.find(p => p.id === "cleansing-balm") || productsData[2];
      } else if (skinConcern === "Dehydration/Dullness") {
        if (texturePref === "Restorative Face Oil") {
          recommendedProduct = productsData.find(p => p.id === "alchemists-oil") || productsData[1];
        } else if (texturePref === "Lightweight Serum") {
          recommendedProduct = productsData.find(p => p.id === "rose-hydrosol") || productsData[3];
        } else {
          recommendedProduct = productsData.find(p => p.id === "jasmine-cream") || productsData[4];
        }
      }

      setRecommendation(recommendedProduct);
      setStep("result");
    }, 2200);
  };

  const handleReset = () => {
    setSkinType("");
    setSkinConcern("");
    setTexturePref("");
    setRecommendation(null);
    setStep("form");
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "160px 24px 120px 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        
        {/* Hero Diagnostic Banner */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "280px",
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: "48px",
          border: "1px solid rgba(16, 34, 77, 0.08)",
          boxShadow: "var(--shadow-sm)"
        }} className="skininsights-hero-banner">
          <Image 
            src="/images/skininsights-banner.png" 
            alt="MAHQEE SkinInsights Diagnostic AI" 
            fill
            sizes="(max-width: 680px) 100vw, 680px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            background: "linear-gradient(180deg, rgba(16, 34, 77, 0.05) 0%, rgba(16, 34, 77, 0.3) 100%)"
          }} />
        </div>

        {/* Intro */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            color: "var(--accent-pink)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px"
          }}>
            MAHQEE Cellular Diagnostics
          </span>
          <h1 style={{
            fontSize: "36px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            marginBottom: "12px"
          }}>
            SkinInsights AI
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
            Answer three questions about your skin to receive a customized routine powered by cellular biotechnology.
          </p>
        </div>

        {/* STEP 1: QUESTIONNAIRE FORM */}
        {step === "form" && (
          <form onSubmit={handleStartAnalysis} style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "36px 30px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "28px"
          }}>
            {/* Q1: Skin Type */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "12px" }}>
                1. Select your Skin Type:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {["Oily", "Dry", "Combination", "Sensitive"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinType(type)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: skinType === type ? "1.5px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: skinType === type ? "rgba(237,116,178,0.04)" : "#ffffff",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Skin Concern */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "12px" }}>
                2. What is your primary Skin Concern?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {["Acne/Breakouts", "Aging/Wrinkles", "Redness/Barrier Repair", "Dehydration/Dullness"].map((concern) => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => setSkinConcern(concern)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: skinConcern === concern ? "1.5px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: skinConcern === concern ? "rgba(237,116,178,0.04)" : "#ffffff",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Texture Preference */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "12px" }}>
                3. What is your preferred product texture?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Lightweight Serum", "Rich Cream", "Restorative Face Oil"].map((texture) => (
                  <button
                    key={texture}
                    type="button"
                    onClick={() => setTexturePref(texture)}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: texturePref === texture ? "1.5px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: texturePref === texture ? "rgba(237,116,178,0.04)" : "#ffffff",
                      color: "var(--text-primary)",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      textAlign: "left",
                      paddingLeft: "20px",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {texture}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!skinType || !skinConcern || !texturePref}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px",
                borderRadius: "10px",
                opacity: (!skinType || !skinConcern || !texturePref) ? 0.5 : 1,
                cursor: (!skinType || !skinConcern || !texturePref) ? "not-allowed" : "pointer"
              }}
            >
              Start Skin Insights AI Analysis
            </button>
          </form>
        )}

        {/* STEP 2: LOADING DIAGNOSTIC SCREEN */}
        {step === "loading" && (
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "60px 40px",
            boxShadow: "var(--shadow-sm)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Moving scanning line */}
            <div className="scanning-laser-line" />

            {/* Glowing scanning target */}
            <div style={{
              position: "relative",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "2px dashed var(--accent-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px"
            }}>
              {/* Inner pulse */}
              <div className="pulse-glow-element" style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "rgba(237, 116, 178, 0.08)",
                border: "2px solid var(--accent-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* Center dot */}
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "var(--text-primary)"
                }} />
              </div>
            </div>

            <h3 style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>
              Analyzing Skin Microbiome...
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "380px", margin: "0 auto", lineHeight: "1.5" }}>
              Scanning selections against biotechnology clinical indices to isolate optimal bio-actives.
            </p>
          </div>
        )}

        {/* STEP 3: ANALYSIS RESULTS PAGE */}
        {step === "result" && recommendation && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Header Result Card */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "36px 30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--accent-pink)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                AI Recommendation Summary
              </span>
              <h2 style={{ fontSize: "28px", color: "var(--text-primary)", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                {recommendation.name}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "24px" }}>
                Based on your concern of <strong style={{ color: "var(--text-primary)" }}>{skinConcern}</strong> and preferred texture of <strong style={{ color: "var(--text-primary)" }}>{texturePref}</strong>, this bio-active elixir is computed to yield optimal epidermal restoration.
              </p>

              {/* Add to Cart CTA */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "24px"
              }}>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>Price</span>
                  <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-primary)" }}>₹{recommendation.price}.00</span>
                </div>
                <button
                  onClick={() => addToCart(recommendation, 1)}
                  className="btn-primary"
                  style={{ borderRadius: "8px", padding: "12px 24px" }}
                >
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Custom Skincare Routine Block */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "36px 30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h3 style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: "20px", fontFamily: "var(--font-serif)" }}>
                Your Recommended Morning/Night Routine
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Step 1: Cleanse */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(16, 34, 77, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>1</span>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>Cleanse: Alabaster Cleansing Balm</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Melt away impurities and makeup without stripping natural lipids.</p>
                  </div>
                </div>

                {/* Step 2: recommended product */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(237,116,178,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "var(--accent-pink)" }}>2</span>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>Treat: {recommendation.name}</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Gently pat 3-4 drops onto damp face. Focus on zones of concern.</p>
                  </div>
                </div>

                {/* Step 3: Moisturize */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(16, 34, 77, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>3</span>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>Hydrate: Jasmine Velvet Cream</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Lock in bio-actives with a velvet cashmere moisture seal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ alignSelf: "center", padding: "10px 24px", fontSize: "13px" }}
            >
              Retake Diagnostics
            </button>
          </div>
        )}

      </div>

      <style jsx global>{`
        .diagnostic-pulse {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid var(--accent-pink);
          animation: pulseDiag 1.5s ease-in-out infinite;
        }

        @keyframes pulseDiag {
          0% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 0 0 rgba(237, 116, 178, 0.4); }
          50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 20px 10px rgba(237, 116, 178, 0.15); }
          100% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 0 0 rgba(237, 116, 178, 0.4); }
        }
      `}</style>
    </main>
  );
}
