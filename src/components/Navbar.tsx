"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, Product } from "@/context/CartContext";
import ProductDetailsModal from "@/components/ProductDetailsModal";

export default function Navbar() {
  const { openCart, cartCount, products } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [shopHovered, setShopHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  const filteredProducts = searchQuery.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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
        <span>Get 10% OFF + Additional discounts</span>
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
          {/* Brand Logo with Custom Image */}
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            height: "100%"
          }}>
            <Image 
              src="/images/logo.png" 
              alt="MAHQEE Logo" 
              width={150} 
              height={48}
              style={{ 
                height: "48px", 
                width: "113px",
                // objectFit: "contain" 
              }}
              priority
            />
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
                  width: "420px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "24px",
                  zIndex: 2000,
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "24px",
                  animation: "fadeIn 0.2s ease-out"
                }}>
                  {/* Column 1: Categories */}
                  <div>
                    <h4 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-pink)", marginBottom: "12px" }}>Categories</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link href="/shop?cat=nail-accessory" className="dropdown-item">Nail Accessory</Link>
                      <Link href="/shop?cat=hair" className="dropdown-item">Hair</Link>
                      <Link href="/shop?cat=foot" className="dropdown-item">Foot</Link>
                      <Link href="/shop?cat=bath" className="dropdown-item">Bath</Link>
                      <Link href="/shop?cat=makeup" className="dropdown-item">Makeup</Link>
                      <Link href="/shop" className="dropdown-item">All Categories</Link>
                    </div>
                  </div>
                  
                  {/* Column 2: Brand Info */}
                  <div>
                    <h4 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "12px" }}>MAHQEE Universe</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link href="/about" className="dropdown-item">About Us</Link>
                      <Link href="/contact" className="dropdown-item">Connect With Us</Link>
                      <Link href="/best-sellers" className="dropdown-item">Award Winners</Link>
                      <Link href="/track-order" className="dropdown-item">Track Delivery</Link>
                      <Link href="/payment-done" className="dropdown-item">My Orders</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/best-sellers" className="nav-link">Best Sellers</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact Us</Link>
            <Link href="/payment-done" className="nav-link">My Orders</Link>
          </nav>

          {/* Right Action Icons & Hamburger Trigger */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Search Trigger Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "50%",
                transition: "background-color 0.2s",
                marginRight: "6px"
              }}
              aria-label="Search Catalog"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--text-primary)" 
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

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

      {/* Search Overlay */}
      {isSearchOpen && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "56px",
          backgroundColor: "#ffffff",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--border-color)",
          padding: "0 24px"
        }}>
          <div className="container" style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%"
          }}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--text-primary)" 
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: "flex" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tools, formulations, ingredients..."
                autoFocus
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  backgroundColor: "transparent"
                }}
              />
            </form>

            <button 
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              style={{
                padding: "8px",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Close Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Search Dropdown Results */}
          {searchQuery.trim().length > 0 && (
            <div style={{
              position: "absolute",
              top: "56px",
              left: 0,
              width: "100%",
              backgroundColor: "#ffffff",
              borderBottom: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-md)",
              zIndex: 1199,
              maxHeight: "400px",
              overflowY: "auto"
            }}>
              <div className="container" style={{ padding: "20px 24px" }}>
                {filteredProducts.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-pink)", marginBottom: "4px" }}>
                      Products found ({filteredProducts.length})
                    </div>
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "10px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                        className="search-result-item"
                      >
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          backgroundColor: "#f7f7f9",
                          position: "relative",
                          overflow: "hidden",
                          flexShrink: 0
                        }}>
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill
                            sizes="48px"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>
                            {product.name}
                          </h4>
                          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
                            {product.tagline}
                          </p>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                          ₹{product.price}
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", textAlign: "center" }}>
                      <Link 
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-pink)" }}
                      >
                        {`View all results for "${searchQuery}"`}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                    {`No products found matching "${searchQuery}"`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

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
              <Link href="/shop?cat=nail-accessory" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Nail Accessory</Link>
              <Link href="/shop?cat=hair" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Hair</Link>
              <Link href="/shop?cat=foot" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Foot</Link>
              <Link href="/shop?cat=bath" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Bath</Link>
              <Link href="/shop?cat=makeup" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Makeup</Link>
              <Link href="/shop" className="nav-link" onClick={() => setMobileMenuOpen(false)}>All Categories</Link>
            </div>

            <h3 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: "10px" }}>Discover</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "8px" }}>
              <Link href="/best-sellers" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Best Sellers</Link>
              <Link href="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              <Link href="/payment-done" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
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
        
        .search-result-item:hover {
          background-color: #f7f7f9;
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
