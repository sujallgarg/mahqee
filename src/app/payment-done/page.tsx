"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string | null;
  image: string | null;
}

interface Order {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingFee: number;
  grandTotal: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  date: string;
}

export default function PaymentDonePage() {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Retrieve last order details
    const storedLastOrder = localStorage.getItem("mahqee_last_order");
    if (storedLastOrder) {
      try {
        setLastOrder(JSON.parse(storedLastOrder));
      } catch (e) {
        console.error("Failed to parse last order", e);
      }
    }

    // Retrieve historical orders list
    const storedOrders = localStorage.getItem("mahqee_orders");
    if (storedOrders) {
      try {
        setAllOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error("Failed to parse orders list", e);
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }} />
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      padding: "var(--page-top-padding) 24px var(--page-bottom-padding) 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        
        {/* SUCCESS ICON HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "rgba(46, 125, 50, 0.1)",
            border: "2px solid #2e7d32",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="3">
              <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            color: "var(--accent-pink)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px"
          }}>
            Transaction Successful
          </span>
          <h1 style={{
            fontSize: "36px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            marginBottom: "8px"
          }}>
            Order Confirmed!
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", maxWidth: "480px", margin: "0 auto" }}>
            Your order details have been registered on the MAHQEE server, and your purchase receipt has been successfully sent to our WhatsApp support team.
          </p>
        </div>

        {/* ORDER DETAILS RECEIPT INVOICE */}
        {lastOrder ? (
          <div className="payment-done-card">
            {/* Meta summary */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "16px"
            }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", textTransform: "uppercase" }}>Order Code</span>
                <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>{lastOrder.orderNumber}</strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", textTransform: "uppercase" }}>Order Date</span>
                <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  {new Date(lastOrder.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {/* Products rows */}
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Items Ordered
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {lastOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--bg-primary)",
                      flexShrink: 0
                    }}>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "rgba(16, 34, 77, 0.05)", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>📦</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "2px" }}>{item.name}</h4>
                      {item.color && (
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Option: {item.color}</span>
                      )}
                    </div>
                    <div style={{ textAlign: "right", fontSize: "13px", color: "var(--text-primary)" }}>
                      <span>{item.quantity}x</span>
                      <strong style={{ marginLeft: "12px" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations details */}
            <div style={{
              borderTop: "1px solid var(--border-color)",
              borderBottom: "1px solid var(--border-color)",
              padding: "16px 0",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Subtotal</span>
                <span>₹{lastOrder.subtotal.toLocaleString("en-IN")}.00</span>
              </div>
              {lastOrder.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#2e7d32" }}>
                  <span>Discount ({lastOrder.couponCode})</span>
                  <span>-₹{lastOrder.discount.toLocaleString("en-IN")}.00</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Shipping Fee</span>
                <span>{lastOrder.shippingFee > 0 ? `₹${lastOrder.shippingFee}.00` : "FREE (Express)"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-primary)", fontWeight: "600", fontSize: "16px", marginTop: "4px" }}>
                <span>Grand Total Paid</span>
                <span>₹{lastOrder.grandTotal.toLocaleString("en-IN")}.00</span>
              </div>
            </div>

            {/* Delivery address details */}
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                Delivery Information
              </h3>
              <div style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "13px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div>Name: <strong style={{ color: "var(--text-primary)" }}>{lastOrder.customer.name}</strong></div>
                <div>Mobile Phone: <span style={{ color: "var(--text-primary)" }}>{lastOrder.customer.phone}</span></div>
                <div>Address: <span style={{ color: "var(--text-secondary)" }}>{lastOrder.customer.address}</span></div>
                <div>Pincode: <strong style={{ color: "var(--text-primary)" }}>{lastOrder.customer.pincode}</strong></div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "48px 30px",
            boxShadow: "var(--shadow-sm)",
            textAlign: "center",
            marginBottom: "32px"
          }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No recent checkout session records found on this browser.</p>
          </div>
        )}

        {/* CTA ACTION BUTTONS */}
        <div className="payment-done-buttons">
          <Link href="/shop" className="btn-primary payment-done-btn">
            Continue Shopping
          </Link>
          <Link href="/track-order" className="btn-secondary payment-done-btn">
            Track Delivery Status
          </Link>
        </div>

        {/* PREVIOUS ORDERS ACCORDION */}
        {allOrders.length > 0 && (
          <div style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "32px"
          }}>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-primary)",
                padding: "8px 0"
              }}
            >
              <span>View Order History ({allOrders.length})</span>
              <span>{showHistory ? "▲" : "▼"}</span>
            </button>

            {showHistory && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "20px"
              }}>
                {allOrders.map((ord) => (
                  <div 
                    key={ord.orderNumber}
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid var(--border-color)",
                      borderRadius: "16px",
                      padding: "20px",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "12px", fontSize: "12px" }}>
                      <div>Order: <strong>{ord.orderNumber}</strong></div>
                      <div style={{ color: "var(--text-secondary)" }}>
                        {new Date(ord.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                    
                    {/* Items brief */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                      {ord.items.map((it, iidx) => (
                        <div key={iidx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                          <span>{it.quantity}x {it.name} {it.color ? `(${it.color})` : ""}</span>
                          <span>₹{(it.price * it.quantity).toLocaleString("en-IN")}.00</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                      <span style={{ fontSize: "11px", color: "#2e7d32", textTransform: "uppercase" }}>✓ WhatsApp Submitted</span>
                      <span>Total: ₹{ord.grandTotal.toLocaleString("en-IN")}.00</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
