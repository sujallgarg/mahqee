"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, CartItem, Product } from "@/context/CartContext";
import ProductDetailsModal from "./ProductDetailsModal";

const WHATSAPP_BUSINESS_PHONE = "919650045175"; // TODO: Customize this with your actual WhatsApp Business number (including country code)

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    cartTotal,
    clearCart
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "processing" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedCartProduct, setSelectedCartProduct] = useState<Product | null>(null);

  const handleCheckout = () => {
    setCheckoutStep("processing");
    
    // Format cart items details for the WhatsApp message
    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name}${
            item.selectedColor ? ` (Option: ${item.selectedColor.name})` : ""
          } - ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}.00`
      )
      .join("\n");

    const message = `Hello MAHQEE,\n\nI would like to place an order:\n\n*Order Summary:*\n${itemsText}\n\n*Total Amount:* ₹${cartTotal.toLocaleString("en-IN")}.00\n\nThank you!`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;

    // Simulate routing delay, open WhatsApp, clear cart, and transition to success screen
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      const generatedOrder = `MQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setCheckoutStep("success");
      clearCart();
    }, 1500);
  };

  const handleClose = () => {
    closeCart();
    // Reset checkout step on close after transition completes
    setTimeout(() => setCheckoutStep("cart"), 300);
  };

  if (!isCartOpen) return null;

  // Mini CSS renderer of product graphics in cart list
  const renderCartItemMiniGraphic = (item: CartItem) => {
    let liquidBg = "linear-gradient(180deg, rgba(239, 230, 245, 0.95), rgba(215, 195, 235, 0.95))";
    
    if (item.selectedColor) {
      if (item.selectedColor.name.includes("Jade") || item.selectedColor.name.includes("Sage")) {
        liquidBg = "linear-gradient(180deg, rgba(220, 235, 225, 0.95), rgba(170, 200, 185, 0.95))";
      } else if (item.selectedColor.name.includes("Rose") || item.selectedColor.name.includes("Quartz")) {
        liquidBg = "linear-gradient(180deg, rgba(250, 230, 235, 0.95), rgba(235, 190, 205, 0.95))";
      } else if (item.selectedColor.name.includes("Evening")) {
        liquidBg = "linear-gradient(180deg, rgba(245, 220, 225, 0.95), rgba(215, 160, 175, 0.95))";
      }
    } else if (item.product.id === "alchemists-oil") {
      liquidBg = "linear-gradient(180deg, rgba(255, 235, 180, 0.95), rgba(229, 168, 64, 0.95))";
    } else if (item.product.id === "cleansing-balm") {
      liquidBg = "linear-gradient(180deg, rgba(250, 245, 230, 0.98), rgba(235, 220, 180, 0.98))";
    }

    if (item.product.category === "Creams") {
      return (
        <div style={{ width: "35px", height: "35px", position: "relative" }}>
          <div style={{ width: "32px", height: "6px", background: "#d0d0d0", borderRadius: "1px", margin: "0 auto" }} />
          <div style={{ width: "35px", height: "26px", background: liquidBg, borderRadius: "0 0 6px 6px", margin: "0 auto", border: "0.5px solid rgba(255,255,255,0.4)" }} />
        </div>
      );
    } else if (item.product.category === "Oils") {
      return (
        <div style={{ width: "22px", height: "45px", position: "relative" }}>
          <div style={{ width: "14px", height: "10px", background: "#d0d0d0", borderRadius: "1px", margin: "0 auto" }} />
          <div style={{ width: "22px", height: "35px", background: liquidBg, borderRadius: "3px", margin: "0 auto", border: "0.5px solid rgba(255,255,255,0.4)" }} />
        </div>
      );
    } else {
      return (
        <div style={{ width: "25px", height: "45px", position: "relative" }}>
          <div style={{ width: "8px", height: "4px", background: "#f0f0f0", borderRadius: "1px", margin: "0 auto" }} />
          <div style={{ width: "16px", height: "6px", background: "#d0d0d0", borderRadius: "1px", margin: "0 auto" }} />
          <div style={{ width: "25px", height: "35px", background: liquidBg, borderRadius: "4px", margin: "0 auto", border: "0.5px solid rgba(255,255,255,0.4)" }} />
        </div>
      );
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1000,
      display: "flex",
      justifyContent: "flex-end"
    }}>
      {/* Drawer Overlay Backdrop */}
      <div 
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          animation: "fadeInBackdrop 0.3s ease"
        }}
      />

      {/* Slide-over Drawer */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "440px",
        height: "100%",
        backgroundColor: "var(--bg-secondary)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        padding: "36px 30px",
        animation: "slideInDrawer 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
        zIndex: 1001
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{ fontSize: "24px", color: "var(--text-primary)" }}>
            {checkoutStep === "success" ? "Order Placed" : "Shopping Bag"}
          </h2>
          <button 
            onClick={handleClose}
            style={{
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Close Bag"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1L13 13M1 13L13 1" />
            </svg>
          </button>
        </div>

        {/* STEP 1: CART VIEW */}
        {checkoutStep === "cart" && (
          <>
            {cartItems.length === 0 ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60%",
                textAlign: "center"
              }}>
                <svg width="60" height="60" viewBox="0 0 17 17" fill="none" stroke="var(--text-secondary)" strokeWidth="1" style={{ marginBottom: "20px" }}>
                  <path d="M4.5 6V4.5C4.5 2.5 6 1 8.5 1C11 1 12.5 2.5 12.5 4.5V6" />
                  <rect x="2" y="5.5" width="13" height="10.5" rx="2" />
                </svg>
                <h3 style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>Your bag is empty.</h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>Items you add will appear here.</p>
                <button onClick={handleClose} className="btn-primary">Continue Shopping</button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div style={{
                  flex: "1",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  paddingRight: "6px",
                  marginBottom: "24px"
                }}>
                  {cartItems.map((item, idx) => (
                    <div 
                      key={`${item.product.id}-${item.selectedColor?.name || ""}-${idx}`}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                        paddingBottom: "20px",
                        borderBottom: "1px solid var(--border-color)"
                      }}
                    >
                      {/* Mini Product Representation */}
                      <div 
                        onClick={() => setSelectedCartProduct(item.product)}
                        style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor: "var(--bg-primary)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          overflow: "hidden",
                          position: "relative",
                          border: "1px solid var(--border-color)",
                          transition: "var(--transition-fast)"
                        }}
                        className="cart-item-image-wrapper"
                      >
                        {item.product.image && (item.product.image.startsWith("/images/") || item.product.image.startsWith("data:image/")) ? (
                          <Image 
                            src={item.product.image} 
                            alt={item.product.name} 
                            fill
                            sizes="60px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          renderCartItemMiniGraphic(item)
                        )}
                      </div>

                      {/* Info & Quantity controls */}
                      <div style={{ flex: "1" }}>
                        <h4 
                          onClick={() => setSelectedCartProduct(item.product)}
                          style={{ 
                            fontSize: "15px", 
                            color: "var(--text-primary)", 
                            fontWeight: "500", 
                            marginBottom: "2px",
                            cursor: "pointer",
                            transition: "var(--transition-fast)"
                          }}
                          className="cart-item-title-link"
                        >
                          {item.product.name}
                        </h4>
                        
                        {item.selectedColor && (
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                            <span>Option: {item.selectedColor.name}</span>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.selectedColor.hex, display: "inline-block" }} />
                          </div>
                        )}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {/* Quantity selector */}
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid var(--border-color)",
                            borderRadius: "99px",
                            padding: "2px 8px",
                            gap: "12px",
                            backgroundColor: "var(--bg-primary)"
                          }}>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor?.name)}
                              style={{ fontSize: "14px", fontWeight: "600", padding: "2px 4px" }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: "12px", fontWeight: "500" }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor?.name)}
                              style={{ fontSize: "14px", fontWeight: "600", padding: "2px 4px" }}
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                            ₹{item.product.price * item.quantity}.00
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Summary Area */}
                <div style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "24px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Shipping</span>
                    <span>FREE (Express)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "18px", fontWeight: "500", color: "var(--text-primary)" }}>
                    <span>Total</span>
                    <span>₹{cartTotal}.00</span>
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                  >
                    Check Out
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 2: PROCESSING SECURE CHECKOUT */}
        {checkoutStep === "processing" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "70%",
            textAlign: "center"
          }}>
            <div className="checkout-spinner" />
            <h3 style={{ fontSize: "18px", color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>
              Secure checkout routing...
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Establishing encrypted connection with bank server.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {checkoutStep === "success" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "70%",
            textAlign: "center"
          }}>
            <div className="success-checkmark-circle">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" strokeWidth="2.5">
                <path d="M20 6L9 17L4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: "20px", color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              Thank you for ordering with MAHQEE.
            </p>
            <p style={{ fontSize: "12px", color: "var(--accent-pink)", fontWeight: "600", marginBottom: "32px" }}>
              Order Code: {orderNumber}
            </p>
            <button onClick={handleClose} className="btn-primary">Keep Browsing</button>
          </div>
        )}
      </div>

      {selectedCartProduct && (
        <ProductDetailsModal 
          product={selectedCartProduct} 
          onClose={() => setSelectedCartProduct(null)} 
        />
      )}

      {/* Local keyframe animations & spinner styles */}
      <style jsx global>{`
        .cart-item-title-link:hover {
          color: var(--accent-pink) !important;
          text-decoration: underline;
        }
        .cart-item-image-wrapper:hover {
          transform: scale(1.02);
          border-color: var(--accent-pink) !important;
        }

        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .checkout-spinner {
          width: 45px;
          height: 45px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent-pink);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-checkmark-circle {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background-color: rgba(237, 116, 178, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scalePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes scalePop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
