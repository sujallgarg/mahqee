"use client";

import React from "react";
import Link from "next/link";

export default function BundleBanner() {
  return (
    <section 
      style={{
        padding: "var(--section-padding-y) 0",
        backgroundColor: "var(--bg-primary)"
      }}
    >
      <div className="container">
        {/* Banner Frame */}
        <div style={{
          backgroundImage: "url('/images/banners/Bundle-background3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid var(--border-color)",
          borderRadius: "24px",
          padding: "80px 90px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "40px",
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
          opacity:"0.9",
        }} className="bundle-banner-grid">
          
          {/* Left info column */}
          <div style={{ zIndex: 2, maxWidth: "440px" }}>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 46px)",
              color: "var(--text-primary)",
              lineHeight: "1.1",
              marginBottom: "16px",
              fontFamily: "var(--font-serif)"
            }}>
              Build Your <br /> Own Bundle!
            </h2>

            <p style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "28px",
            }}>
              Get Additional Discount <strong style={{ color: "var(--text-primary)" }}>UPTO 15%</strong> on custom kit + <strong style={{ color: "var(--accent-pink)" }}>5% Cashback</strong> as MAHQEE Cash.
            </p>

            <Link href="/shop" className="btn-primary" style={{
              borderRadius: "6px",
              padding: "14px 32px",
              fontSize: "14px",
              display: "inline-block"
            }}>
              Shop The Bundle
            </Link>
          </div>

          {/* Right graphics column - Empty to let the background image toolkit show */}
          <div className="bundle-spacer-col" />

        </div>
      </div>

      <style jsx global>{`
        .bundle-spacer-col {
          min-height: 240px;
        }
        @media (max-width: 768px) {
          .bundle-banner-grid {
            grid-template-columns: 1fr !important;
            padding: 48px 24px !important;
            text-align: center !important;
            background-image: none !important;
            background-color: #faf6f5 !important;
            min-height: min-content !important;
          }
          .bundle-spacer-col {
            display: none !important;
          }
          .bundle-banner-grid > div {
            margin: 0 auto;
          }
          :global(.bundle-banner-grid .btn-primary) {
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
