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
  paymentStatus?: "processing" | "verified" | "failed";
}

export default function PaymentDonePage() {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getWhatsappUrl = (order: Order | null) => {
    if (!order) return "#";
    const WHATSAPP_BUSINESS_PHONE = "919650045175";
    const itemsText = order.items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.name}${
            item.color ? ` (Option: ${item.color})` : ""
          } - ₹${(item.price * item.quantity).toLocaleString("en-IN")}.00`
      )
      .join("\n");
    const pricing = `*Subtotal:* ₹${order.subtotal.toLocaleString("en-IN")}.00\n*Discount:* -₹${order.discount.toLocaleString("en-IN")}.00\n*Shipping:* ${order.shippingFee > 0 ? `₹${order.shippingFee}.00` : "FREE"}\n*Grand Total:* ₹${order.grandTotal.toLocaleString("en-IN")}.00`;
    const shipping = `*Name:* ${order.customer.name}\n*Mobile:* ${order.customer.phone}\n*Address:* ${order.customer.address}\n*Pincode:* ${order.customer.pincode}`;
    const message = `Hello MAHQEE,\n\nI would like to place an order:\n\n*Order Summary:*\n${itemsText}\n\n*Pricing Summary:*\n${pricing}\n\n*Delivery Information:*\n${shipping}\n\nThank you!`;
    return `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSimulateStatus = (newStatus: "processing" | "verified" | "failed") => {
    if (!lastOrder) return;
    const updatedOrder = { ...lastOrder, paymentStatus: newStatus };
    setLastOrder(updatedOrder);
    localStorage.setItem("mahqee_last_order", JSON.stringify(updatedOrder));
    
    const updatedOrders = allOrders.map(o => o.orderNumber === lastOrder.orderNumber ? updatedOrder : o);
    setAllOrders(updatedOrders);
    localStorage.setItem("mahqee_orders", JSON.stringify(updatedOrders));

    // Persist this change on the server
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: lastOrder.orderNumber,
        paymentStatus: newStatus
      })
    })
    .catch(err => {
      console.error("Failed to update status on server", err);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Retrieve last order details from localStorage immediately
    const storedLastOrder = localStorage.getItem("mahqee_last_order");
    if (storedLastOrder) {
      try {
        setLastOrder(JSON.parse(storedLastOrder));
      } catch (e) {
        console.error("Failed to parse last order", e);
      }
    }

    // Retrieve historical orders list from localStorage immediately
    const storedOrders = localStorage.getItem("mahqee_orders");
    if (storedOrders) {
      try {
        setAllOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error("Failed to parse orders list", e);
      }
    }

    // Poll server for latest orders status sync (only for this client's order numbers to preserve privacy)
    const fetchLatestOrders = () => {
      const storedLast = localStorage.getItem("mahqee_last_order");
      const storedAll = localStorage.getItem("mahqee_orders");
      
      const numbers: string[] = [];
      if (storedLast) {
        try {
          numbers.push(JSON.parse(storedLast).orderNumber);
        } catch {}
      }
      if (storedAll) {
        try {
          JSON.parse(storedAll).forEach((o: any) => {
            if (o.orderNumber && !numbers.includes(o.orderNumber)) {
              numbers.push(o.orderNumber);
            }
          });
        } catch {}
      }

      if (numbers.length === 0) return;

      fetch(`/api/orders?numbers=${numbers.join(",")}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((ordersList: Order[]) => {
          const storedOrders = localStorage.getItem("mahqee_orders");
          let currentLocalList: Order[] = [];
          if (storedOrders) {
            try { currentLocalList = JSON.parse(storedOrders); } catch {}
          }
          
          const updatedLocalList = currentLocalList.map(localOrd => {
            const foundServer = ordersList.find(s => s.orderNumber === localOrd.orderNumber);
            if (foundServer) {
              return { ...localOrd, paymentStatus: foundServer.paymentStatus };
            }
            return localOrd;
          });
          
          setAllOrders(updatedLocalList);
          localStorage.setItem("mahqee_orders", JSON.stringify(updatedLocalList));
          
          // Sync current lastOrder status from database
          const latestLastOrder = localStorage.getItem("mahqee_last_order");
          if (latestLastOrder) {
            try {
              const parsedLast = JSON.parse(latestLastOrder);
              const foundServer = ordersList.find(s => s.orderNumber === parsedLast.orderNumber);
              if (foundServer) {
                const updatedLast = { ...parsedLast, paymentStatus: foundServer.paymentStatus };
                setLastOrder(updatedLast);
                localStorage.setItem("mahqee_last_order", JSON.stringify(updatedLast));
              }
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch(err => {
          console.warn("Could not sync orders from server API", err);
        });
    };

    fetchLatestOrders();

    const interval = setInterval(fetchLatestOrders, 3000);
    return () => clearInterval(interval);
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
        
        {/* DYNAMIC SUCCESS ICON HEADER */}
        {(() => {
          const status = lastOrder?.paymentStatus || "processing";
          if (status === "verified") {
            return (
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
                  color: "#2e7d32",
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
                  Your Paytm payment has been successfully verified by our WhatsApp agent! Your order is now confirmed and scheduled for express delivery.
                </p>
              </div>
            );
          } else if (status === "failed") {
            return (
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  border: "2px solid #dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto"
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.15em",
                  color: "#dc2626",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px"
                }}>
                  Verification Failed
                </span>
                <h1 style={{
                  fontSize: "36px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-serif)",
                  marginBottom: "8px"
                }}>
                  Payment Unverified
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", maxWidth: "480px", margin: "0 auto", marginBottom: "16px" }}>
                  Our WhatsApp support agent could not verify your Paytm payment. Please check your receipt details or resend it to verify again.
                </p>
                <a href={getWhatsappUrl(lastOrder)} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none", padding: "10px 24px", fontSize: "13px", borderRadius: "8px" }}>
                  Resend Paytm Receipt
                </a>
              </div>
            );
          } else {
            return (
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(217, 119, 6, 0.1)",
                  border: "2px solid #d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto"
                }}>
                  <svg className="animate-spin-custom" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.15em",
                  color: "#d97706",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px"
                }}>
                  Awaiting Verification
                </span>
                <h1 style={{
                  fontSize: "36px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-serif)",
                  marginBottom: "8px"
                }}>
                  Order Registered
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", maxWidth: "480px", margin: "0 auto", marginBottom: "16px" }}>
                  Your order is registered. Our WhatsApp agent is currently verifying your Paytm payment. Please make sure you have sent the receipt on WhatsApp.
                </p>
                <a href={getWhatsappUrl(lastOrder)} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none", padding: "10px 24px", fontSize: "13px", borderRadius: "8px" }}>
                  Send Paytm Receipt (WhatsApp)
                </a>
              </div>
            );
          }
        })()}

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
                      {(() => {
                        const status = ord.paymentStatus || "processing";
                        if (status === "verified") {
                          return (
                            <span style={{ fontSize: "11px", color: "#16a34a", backgroundColor: "rgba(22, 163, 74, 0.1)", padding: "4px 8px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                              ✓ Paid & Verified
                            </span>
                          );
                        } else if (status === "failed") {
                          return (
                            <span style={{ fontSize: "11px", color: "#dc2626", backgroundColor: "rgba(220, 38, 38, 0.1)", padding: "4px 8px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                              ✗ Verification Failed
                            </span>
                          );
                        } else {
                          return (
                            <span style={{ fontSize: "11px", color: "#d97706", backgroundColor: "rgba(217, 119, 6, 0.1)", padding: "4px 8px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                              ⏳ Awaiting Agent
                            </span>
                          );
                        }
                      })()}
                      <span>Total: ₹{ord.grandTotal.toLocaleString("en-IN")}.00</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin-custom {
          animation: spin-custom-keyframe 1.5s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-custom-keyframe {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </main>
  );
}
