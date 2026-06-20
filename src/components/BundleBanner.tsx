"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function BundleBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(bannerRef);

  return (
    <section 
      ref={bannerRef}
      style={{
        padding: "120px 0",
        backgroundColor: "#ffffff"
      }}
    >
      <div className="container">
        {/* Banner Frame */}
        <div style={{
          background: "linear-gradient(135deg, #f2f1f6 0%, #faf9fc 100%)",
          border: "1px solid var(--border-color)",
          borderRadius: "24px",
          padding: "72px 90px",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          alignItems: "center",
          gap: "64px",
          position: "relative",
          overflow: "hidden"
        }} className="bundle-banner-grid">
          
          {/* Left info column */}
          <div style={{ zIndex: 2 }}>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              color: "var(--text-primary)",
              lineHeight: "1.1",
              marginBottom: "16px",
              fontFamily: "var(--font-serif)"
            }}>
              Build Your <br /> Own Bundle!
            </h2>

            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "24px",
              maxWidth: "380px"
            }}>
              Get Additional Discount <strong style={{ color: "var(--text-primary)" }}>UPTO 15%</strong> on custom kit + <strong style={{ color: "var(--accent-pink)" }}>5% Cashback</strong> as MAHQEE Cash.
            </p>

            <Link href="/shop" className="btn-primary" style={{
              borderRadius: "6px",
              padding: "12px 28px",
              fontSize: "14px"
            }}>
              Shop The Bundle
            </Link>
          </div>

          {/* Right graphics column - Absolute-positioned bottles */}
          <div style={{
            position: "relative",
            height: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }} className="bundle-graphics">
            {/* Visual background element */}
            <div style={{
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              backgroundColor: "rgba(38, 209, 240, 0.04)",
              position: "absolute",
              zIndex: 0,
              transform: `translateY(${(progress - 0.5) * -30}px)`,
              transition: "transform 0.1s ease-out"
            }} />

            {/* Dropper vial */}
            <div className="bundle-asset asset-1 floating-element-1" style={{ 
              transform: `rotate(-10deg) translate(-50px, 10px) translateY(${(progress - 0.5) * -50}px)`,
              transition: "transform 0.1s ease-out"
            }}>
              <div className="mini-serum-dropper-bottle" />
            </div>

            {/* Cream Pot */}
            <div className="bundle-asset asset-2 floating-element-2" style={{ 
              transform: `translate(0px, 20px) translateY(${(progress - 0.5) * 35}px)`,
              transition: "transform 0.1s ease-out"
            }}>
              <div className="mini-cream-tub" />
            </div>

            {/* Cleanser Jar */}
            <div className="bundle-asset asset-3 floating-element-1" style={{ 
              transform: `rotate(15deg) translate(55px, 0px) translateY(${(progress - 0.5) * -65}px)`,
              transition: "transform 0.1s ease-out"
            }}>
              <div className="mini-cleanser-jar" />
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .bundle-asset {
          position: absolute;
          z-index: 2;
          filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.05));
        }

        @media (max-width: 768px) {
          .bundle-banner-grid {
            grid-template-columns: 1fr !important;
            padding: 32px !important;
            text-align: center !important;
          }
          .bundle-graphics {
            margin-top: 32px;
          }
          :global(.bundle-banner-grid .btn-primary) {
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
