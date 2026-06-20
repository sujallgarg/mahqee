"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { openCart, cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [shopHovered, setShopHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000
    }}>
      {/* Top Notification Banner (matching screenshot layout) */}
      <div style={{
        backgroundColor: "var(--accent-pink)",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "500",
        textAlign: "center",
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        width: "100%",
        letterSpacing: "0.05em",
        position: "relative"
      }}>
        <span>Get 10% OFF + Additional 10% Cashback on App Orders</span>
      </div>

      {/* Main Glassmorphic Header */}
      <header className="glass-header" style={{
        position: "relative",
        backgroundColor: scrolled ? "var(--glass-bg)" : "rgba(255, 255, 255, 0.9)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        borderBottom: "1px solid var(--border-color)",
        height: "56px"
      }}>
        <div className="container" style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Brand Logo with SVG Butterfly */}
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--text-primary)",
            fontWeight: "400",
            fontFamily: "var(--font-serif)"
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
              {/* Pink circle aura */}
              <circle 
                cx="16" 
                cy="16" 
                r="13" 
                stroke="var(--accent-pink)" 
                strokeWidth="1.8" 
                fill="none" 
                strokeDasharray="42 12 42 12" 
                transform="rotate(-45 16 16)" 
                opacity="0.85"
              />
              {/* Left Wing (royal blue outline, sky blue fill) */}
              <path 
                d="M 16 16 C 13 8, 4 9, 5 14 C 6 18, 14 17, 15.5 16 C 14 20, 9 23, 11 25 C 13 26, 15.5 20, 16 16" 
                fill="var(--accent-blue)" 
                stroke="var(--text-primary)" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              {/* Right Wing (symmetrical) */}
              <path 
                d="M 16 16 C 19 8, 28 9, 27 14 C 26 18, 18 17, 16.5 16 C 18 20, 23 23, 21 25 C 19 26, 16.5 20, 16 16" 
                fill="var(--accent-blue)" 
                stroke="var(--text-primary)" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              {/* Body */}
              <line x1="16" y1="10" x2="16" y2="22" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Antennas */}
              <path d="M 15 10 Q 13 6, 11 7" stroke="var(--text-primary)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              <path d="M 17 10 Q 19 6, 21 7" stroke="var(--text-primary)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{
              fontSize: "17px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "1px"
            }}>
              MAHQEE
            </span>
          </Link>

          {/* Desktop Nav Links (updated to match router specifications) */}
          <nav style={{
            display: "flex",
            gap: "24px",
            alignItems: "center"
          }} className="desktop-nav">
            <div 
              onMouseEnter={() => setShopHovered(true)}
              onMouseLeave={() => setShopHovered(false)}
              style={{ position: "relative" }}
            >
              <Link href="/shop" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 0" }}>
                Shop
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: shopHovered ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>
              
              {/* Mega Dropdown */}
              {shopHovered && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: "-120px",
                  width: "560px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "24px",
                  zIndex: 2000,
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr",
                  gap: "24px",
                  animation: "fadeIn 0.2s ease-out"
                }}>
                  {/* Column 1: Categories */}
                  <div>
                    <h4 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-pink)", marginBottom: "12px" }}>Categories</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link href="/shop?cat=serums" className="dropdown-item">Serums & Elixirs</Link>
                      <Link href="/shop?cat=creams" className="dropdown-item">Barrier Creams</Link>
                      <Link href="/shop?cat=oils" className="dropdown-item">Restorative Oils</Link>
                      <Link href="/shop" className="dropdown-item">Cleansing Balms</Link>
                      <Link href="/shop" className="dropdown-item">Toners & Hydrosols</Link>
                      <Link href="/shop" className="dropdown-item">Eye Nectars</Link>
                    </div>
                  </div>
                  
                  {/* Column 2: Concerns */}
                  <div>
                    <h4 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "12px" }}>Skin Concerns</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link href="/skininsights" className="dropdown-item">Acne & Breakouts</Link>
                      <Link href="/skininsights" className="dropdown-item">Aging & Wrinkles</Link>
                      <Link href="/skininsights" className="dropdown-item">Redness & Irritation</Link>
                      <Link href="/skininsights" className="dropdown-item">Dullness & Hydration</Link>
                    </div>
                  </div>
                  
                  {/* Column 3: Brand Info */}
                  <div>
                    <h4 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "12px" }}>MAHQEE Universe</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link href="/about" className="dropdown-item">About Our BioTech</Link>
                      <Link href="/contact" className="dropdown-item">Connect With Us</Link>
                      <Link href="/best-sellers" className="dropdown-item">Award Winners</Link>
                      <Link href="/track-order" className="dropdown-item">Track Delivery</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/best-sellers" className="nav-link">Best Sellers</Link>
            <Link href="/skininsights" className="nav-link">SkinInsights AI</Link>
            <Link href="/track-order" className="nav-link">Track Order</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact Us</Link>
          </nav>

          {/* Right Action Icons & Hamburger Trigger */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button 
              onClick={openCart}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "50%",
                transition: "background-color 0.2s"
              }}
              aria-label="Open Shopping Bag"
            >
              {/* Custom SVG Bag Icon */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 17 17" 
                fill="none" 
                stroke="var(--text-primary)" 
                strokeWidth="1.3"
              >
                <path d="M4.5 6V4.5C4.5 2.5 6 1 8.5 1C11 1 12.5 2.5 12.5 4.5V6" />
                <rect x="2" y="5.5" width="13" height="10.5" rx="2" />
              </svg>
              
              {/* Cart count bubble */}
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                  backgroundColor: "var(--accent-pink)",
                  color: "#ffffff",
                  fontSize: "9px",
                  fontWeight: "600",
                  height: "15px",
                  width: "15px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Trigger Button (mobile only) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                marginLeft: "6px",
                zIndex: 1100
              }}
              className="hamburger-button"
              aria-label="Toggle Navigation Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Panel */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(16, 34, 77, 0.3)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
          animation: "fadeIn 0.2s"
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "80%",
            maxWidth: "320px",
            height: "100%",
            backgroundColor: "#ffffff",
            boxShadow: "-8px 0 30px rgba(16, 34, 77, 0.15)",
            padding: "90px 24px 30px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-pink)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>Shop Categories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "8px" }}>
              <Link href="/shop?cat=serums" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Serums & Elixirs</Link>
              <Link href="/shop?cat=creams" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Barrier Creams</Link>
              <Link href="/shop?cat=oils" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Restorative Oils</Link>
              <Link href="/shop" className="nav-link" onClick={() => setMobileMenuOpen(false)}>All Formulations</Link>
            </div>

            <h3 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: "10px" }}>Discover</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "8px" }}>
              <Link href="/best-sellers" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Best Sellers</Link>
              <Link href="/skininsights" className="nav-link" onClick={() => setMobileMenuOpen(false)}>SkinInsights AI</Link>
              <Link href="/track-order" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
              <Link href="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </div>
          </div>
        </div>
      )}

      {/* Local Navbar styling */}
      <style jsx global>{`
        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          opacity: 0.85;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .nav-link:hover {
          opacity: 1;
          color: var(--accent-pink);
        }
        
        .dropdown-item {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-primary);
          opacity: 0.8;
          transition: all 0.2s ease;
          display: block;
          padding: 2px 0;
        }
        .dropdown-item:hover {
          opacity: 1;
          color: var(--accent-pink);
          transform: translateX(4px);
        }
        
        .hamburger-button {
          display: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-button {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
