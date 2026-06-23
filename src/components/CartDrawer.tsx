"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, CartItem, Product } from "@/context/CartContext";
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "processing" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedCartProduct, setSelectedCartProduct] = useState<Product | null>(null);

  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Shipping & Address details states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string; pincode?: string }>({});

  // Computed values for coupons and shipping
  const discountAmount = appliedCoupon ? Math.round((cartTotal * appliedCoupon.percent) / 100) : 0;
  const shippingFee = (cartTotal - discountAmount) < 299 ? 50 : 0;
  const grandTotal = cartTotal - discountAmount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "NEW10") {
      setAppliedCoupon({ code: "NEW10", percent: 10 });
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const validateAndSubmitCheckout = () => {
    const errors: { name?: string; phone?: string; address?: string; pincode?: string } = {};

    if (!customerName.trim()) {
      errors.name = "Full name is required";
    }

    if (!customerPhone.trim()) {
      errors.phone = "Mobile number is required";
    } else if (!/^\d{10}$/.test(customerPhone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }

    const addr = shippingAddress.trim();
    if (!addr) {
      errors.address = "Delivery address is required";
    } else if (addr.length < 15) {
      errors.address = "Address is too short. Please include house no., street, city, state (min 15 characters)";
    } else if (!/[a-zA-Z]/.test(addr)) {
      errors.address = "Address must contain letters";
    }

    const pin = pincode.trim();
    if (!pin) {
      errors.pincode = "Pincode is required";
    } else if (!/^[1-9][0-9]{5}$/.test(pin)) {
      errors.pincode = "Enter a valid 6-digit Pincode (cannot start with 0)";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    handleCheckout();
  };

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

    // Format pricing summary for message
    let pricingDetailsText = `*Subtotal:* ₹${cartTotal.toLocaleString("en-IN")}.00\n`;
    if (appliedCoupon) {
      pricingDetailsText += `*Discount (Promo ${appliedCoupon.code}):* -₹${discountAmount.toLocaleString("en-IN")}.00\n`;
    }
    pricingDetailsText += `*Shipping:* ${shippingFee > 0 ? `₹${shippingFee}.00` : "FREE (Express)"}\n*Grand Total:* ₹${grandTotal.toLocaleString("en-IN")}.00`;

    // Format shipping details
    const shippingDetailsText = `*Name:* ${customerName.trim()}\n*Mobile:* ${customerPhone.trim()}\n*Address:* ${shippingAddress.trim()}\n*Pincode:* ${pincode.trim()}`;

    // Assemble final message
    const message = `Hello MAHQEE,\n\nI would like to place an order:\n\n*Order Summary:*\n${itemsText}\n\n*Pricing Summary:*\n${pricingDetailsText}\n\n*Delivery Information:*\n${shippingDetailsText}\n\nThank you!`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;

    // Simulate routing delay, open WhatsApp, clear cart, and redirect to payment-done page
    setTimeout(() => {
      const generatedOrder = `MQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      
      const orderData = {
        orderNumber: generatedOrder,
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          color: item.selectedColor?.name || null,
          image: item.product.image
        })),
        subtotal: cartTotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        shippingFee: shippingFee,
        grandTotal: grandTotal,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: shippingAddress.trim(),
          pincode: pincode.trim()
        },
        date: new Date().toISOString(),
        paymentStatus: "processing"
      };

      // Save order details to localStorage
      const optimizedOrderData = {
        ...orderData,
        items: orderData.items.map(it => ({
          ...it,
          image: it.image && it.image.startsWith("data:image/") ? "" : it.image
        }))
      };
      try {
        localStorage.setItem("mahqee_last_order", JSON.stringify(optimizedOrderData));
        const existingOrdersStr = localStorage.getItem("mahqee_orders");
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        existingOrders.unshift(optimizedOrderData);
        localStorage.setItem("mahqee_orders", JSON.stringify(existingOrders));
      } catch (e) {
        console.error("Failed to save order to local storage database", e);
      }

      // Save order details to shared server-side database
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })
      .catch(err => {
        console.error("Failed to persist order to shared database", err);
      });

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      // Reset form fields
      setCustomerName("");
      setCustomerPhone("");
      setShippingAddress("");
      setPincode("");
      setAppliedCoupon(null);
      setCouponInput("");

      // Transition client state and navigate to success page
      clearCart();
      closeCart();
      setCheckoutStep("cart"); // Reset drawer step for next open
      router.push("/payment-done");
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
      <div 
        className="cart-drawer-panel"
        style={{
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
        zIndex: 1001,
        overflow: "hidden"
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
                  minHeight: 0,
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
                  paddingTop: "20px"
                }}>
                  {/* Coupon Code Section */}
                  <div style={{ marginBottom: "16px" }}>
                    <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        placeholder="Promo Code (e.g. NEW10)" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        disabled={!!appliedCoupon}
                        style={{
                          flex: "1",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "#ffffff",
                          fontSize: "13px",
                          color: "var(--text-primary)",
                          outline: "none"
                        }}
                      />
                      {appliedCoupon ? (
                        <button 
                          type="button" 
                          onClick={handleRemoveCoupon}
                          className="btn-secondary"
                          style={{ padding: "10px 16px", borderRadius: "8px", fontSize: "13px", height: "40px" }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          className="btn-primary"
                          style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "13px", height: "40px" }}
                        >
                          Apply
                        </button>
                      )}
                    </form>
                    {couponError && (
                      <div style={{ color: "var(--accent-pink)", fontSize: "11px", marginTop: "6px", marginLeft: "4px" }}>
                        {couponError}
                      </div>
                    )}
                    {appliedCoupon && (
                      <div style={{ color: "#2e7d32", fontSize: "11px", marginTop: "6px", marginLeft: "4px", fontWeight: "500" }}>
                        ✓ Coupon &quot;{appliedCoupon.code}&quot; applied! ({appliedCoupon.percent}% off)
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}.00</span>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#2e7d32" }}>
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}.00</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Shipping <span style={{color: "var(--text-primary)", fontWeight: "500"}}>(for orders below ₹299)</span></span>
                    <span>{shippingFee > 0 ? `₹${shippingFee}.00` : "FREE (Express)"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "500", color: "var(--text-primary)" }}>
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}.00</span>
                  </div>
                  <button 
                    onClick={() => setCheckoutStep("shipping")} 
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                  >
                    Proceed to Shipping
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 1.5: SHIPPING DETAILS VIEW */}
        {checkoutStep === "shipping" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            justifyContent: "space-between",
            height: "calc(100% - 60px)"
          }} className="shipping-step-container">
            <div style={{ overflowY: "auto", flex: "1", minHeight: 0, paddingRight: "6px", marginBottom: "20px" }} className="shipping-form-scroll">
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Delivery Information
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: formErrors.name ? "1px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      outline: "none"
                    }}
                  />
                  {formErrors.name && (
                    <span style={{ color: "var(--accent-pink)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Mobile Number *
                  </label>
                  <input 
                    type="tel" 
                    placeholder="10-digit number" 
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCustomerPhone(val);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: formErrors.phone ? "1px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      outline: "none"
                    }}
                  />
                  {formErrors.phone && (
                    <span style={{ color: "var(--accent-pink)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Delivery Address *
                  </label>
                  <textarea 
                    placeholder="House/Flat No., Building, Street Address, Town/City, State" 
                    value={shippingAddress}
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                    }}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: formErrors.address ? "1px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                  {formErrors.address && (
                    <span style={{ color: "var(--accent-pink)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      {formErrors.address}
                    </span>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Pincode *
                  </label>
                  <input 
                    type="text" 
                    placeholder="6-digit pincode" 
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPincode(val);
                      if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: undefined });
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: formErrors.pincode ? "1px solid var(--accent-pink)" : "1px solid var(--border-color)",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      outline: "none"
                    }}
                  />
                  {formErrors.pincode && (
                    <span style={{ color: "var(--accent-pink)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      {formErrors.pincode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom summary and action buttons */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }} className="shipping-summary-actions">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}.00</span>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  onClick={() => setCheckoutStep("cart")}
                  className="btn-secondary"
                  style={{ flex: "0 0 90px", justifyContent: "center", padding: "12px", borderRadius: "8px", fontSize: "13px" }}
                >
                  Back
                </button>
                <button 
                  onClick={validateAndSubmitCheckout}
                  className="btn-primary"
                  style={{ flex: "1", justifyContent: "center", padding: "12px", borderRadius: "8px", fontSize: "13px" }}
                >
                  Place Order (WhatsApp)
                </button>
              </div>
            </div>
          </div>
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
        .cart-drawer-panel {
          width: 100% !important;
          max-width: 440px !important;
          height: 100% !important;
        }
        @media (max-width: 480px) {
          .cart-drawer-panel {
            padding: 24px 20px !important;
          }
          .shipping-step-container {
            height: calc(100% - 40px) !important;
          }
          .shipping-form-scroll {
            margin-bottom: 12px !important;
          }
        }
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
