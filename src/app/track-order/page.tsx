"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TrackingEvent {
  time: string;
  location: string;
  status: string;
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<{
    status: "placed" | "processing" | "shipped" | "transit" | "delivered";
    carrier: string;
    estDelivery: string;
    events: TrackingEvent[];
  } | null>(null);

  // Poll server database for latest status of the searched order code
  useEffect(() => {
    if (!searchedCode) return;

    const trackPoll = () => {
      fetch("/api/orders", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders from server");
          return res.json();
        })
        .then((ordersList: any[]) => {
          const foundOrder = ordersList.find(
            (o: any) => o.orderNumber.trim().toLowerCase() === searchedCode.trim().toLowerCase()
          );
          if (foundOrder) {
            const status = foundOrder.paymentStatus || "processing";
            if (status === "verified") {
              setTrackingInfo({
                status: "shipped",
                carrier: "MAHQEE Express Logistics (DHL Partner)",
                estDelivery: "2-3 Business Days",
                events: [
                  { time: "Today, 10:45 AM", location: "Mumbai Hub, India", status: "Package sorted & loaded onto express container" },
                  { time: "Yesterday, 02:30 PM", location: "Warehouse Facility, New Delhi", status: "Package packed, sealed, and handed to dispatch team" },
                  { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Paytm payment verified by WhatsApp agent, invoice generated, order confirmed" }
                ]
              });
            } else if (status === "failed") {
              setTrackingInfo({
                status: "placed",
                carrier: "MAHQEE Express Logistics (DHL Partner)",
                estDelivery: "On Hold (Payment Unverified)",
                events: [
                  { time: "Today, 11:30 AM", location: "Digital Operations", status: "Verification Failed: Our support agent could not verify your Paytm payment." },
                  { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Order registered on server. Awaiting payment receipt verification." }
                ]
              });
            } else {
              setTrackingInfo({
                status: "processing",
                carrier: "MAHQEE Express Logistics (DHL Partner)",
                estDelivery: "Awaiting Verification",
                events: [
                  { time: "Today, 09:15 AM", location: "Digital Operations", status: "Awaiting Paytm payment receipt verification by our WhatsApp agent." },
                  { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Order details registered. Awaiting receipt upload on WhatsApp." }
                ]
              });
            }
          }
        })
        .catch(err => {
          console.warn("Could not sync tracking info from server database", err);
        });
    };

    trackPoll();
    const interval = setInterval(trackPoll, 5000);
    return () => clearInterval(interval);
  }, [searchedCode]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    setSearchedCode(orderCode);

    // Look up the order in localStorage
    let foundOrder = null;
    if (typeof window !== "undefined") {
      const storedOrders = localStorage.getItem("mahqee_orders");
      if (storedOrders) {
        try {
          const orders = JSON.parse(storedOrders);
          foundOrder = orders.find(
            (o: any) => o.orderNumber.trim().toLowerCase() === orderCode.trim().toLowerCase()
          );
        } catch (err) {
          console.error("Failed to parse orders list in track-order page", err);
        }
      }
    }

    if (foundOrder) {
      const status = foundOrder.paymentStatus || "processing";
      if (status === "verified") {
        setTrackingInfo({
          status: "shipped",
          carrier: "MAHQEE Express Logistics (DHL Partner)",
          estDelivery: "2-3 Business Days",
          events: [
            { time: "Today, 10:45 AM", location: "Mumbai Hub, India", status: "Package sorted & loaded onto express container" },
            { time: "Yesterday, 02:30 PM", location: "Warehouse Facility, New Delhi", status: "Package packed, sealed, and handed to dispatch team" },
            { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Paytm payment verified by WhatsApp agent, invoice generated, order confirmed" }
          ]
        });
      } else if (status === "failed") {
        setTrackingInfo({
          status: "placed",
          carrier: "MAHQEE Express Logistics (DHL Partner)",
          estDelivery: "On Hold (Payment Unverified)",
          events: [
            { time: "Today, 11:30 AM", location: "Digital Operations", status: "Verification Failed: Our support agent could not verify your Paytm payment." },
            { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Order registered on server. Awaiting payment receipt verification." }
          ]
        });
      } else {
        // processing
        setTrackingInfo({
          status: "processing",
          carrier: "MAHQEE Express Logistics (DHL Partner)",
          estDelivery: "Awaiting Verification",
          events: [
            { time: "Today, 09:15 AM", location: "Digital Operations", status: "Awaiting Paytm payment receipt verification by our WhatsApp agent." },
            { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Order details registered. Awaiting receipt upload on WhatsApp." }
          ]
        });
      }
    } else {
      // Fallback: Simulate looking up tracking details for other codes (mock fallback)
      setTrackingInfo({
        status: "shipped", // mock status
        carrier: "MAHQEE Express Logistics (DHL Partner)",
        estDelivery: "2-3 Business Days",
        events: [
          { time: "Today, 10:45 AM", location: "Mumbai Hub, India", status: "Package sorted & loaded onto express container" },
          { time: "Yesterday, 02:30 PM", location: "Warehouse Facility, New Delhi", status: "Package packed, sealed, and handed to dispatch team" },
          { time: "Yesterday, 09:12 AM", location: "Digital Operations", status: "Payment verified, invoice generated, order confirmed" }
        ]
      });
    }
  };

  const getStepClass = (stepName: string) => {
    if (!trackingInfo) return "inactive";
    const statusMap = {
      placed: 1,
      processing: 2,
      shipped: 3,
      transit: 4,
      delivered: 5
    };
    
    const currentWeight = statusMap[trackingInfo.status];
    
    const targetMap = {
      placed: 1,
      processing: 2,
      shipped: 3,
      transit: 4,
      delivered: 5
    };
    
    const targetWeight = targetMap[stepName as keyof typeof targetMap];
    
    if (currentWeight >= targetWeight) return "completed";
    if (currentWeight + 1 === targetWeight) return "active";
    return "inactive";
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "160px 24px 120px 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        
        {/* Intro heading */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{
            fontSize: "36px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            marginBottom: "12px"
          }}>
            Track Your Order
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
            Input your checkout confirmation order code to view transit milestones and estimated delivery schedules.
          </p>
        </div>

        {/* Search and Graphics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 0.75fr",
          gap: "28px",
          alignItems: "stretch",
          marginBottom: "32px"
        }} className="track-order-grid">
          
          {/* Search Input Box */}
          <form onSubmit={handleTrack} style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            padding: "24px 20px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            gap: "12px",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <input 
                type="text" 
                placeholder="Enter Order Code (e.g. MQ-582914)"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                style={{
                  flex: "1",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  fontSize: "13.5px",
                  outline: "none",
                  color: "var(--text-primary)"
                }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ borderRadius: "8px", padding: "0 28px", fontSize: "13px" }}
              >
                Track
              </button>
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontStyle: "italic" }}>
              Don&apos;t have an order code? Try entering <strong>MQ-834915</strong> to test the tracker simulation.
            </span>
          </form>

          {/* Premium Packaging Side Image */}
          <div style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
            minHeight: "140px"
          }} className="track-order-img-box">
            <Image 
              src="/images/track-order-banner.png" 
              alt="MAHQEE Wrapped Gift Delivery Packaging" 
              fill
              sizes="(max-width: 600px) 100vw, 250px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>

        {/* Tracking status visualizer */}
        {trackingInfo && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Visual Milestones bar */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "36px 30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Delivery Milestones for {searchedCode}
              </h3>

              {/* Progress Steps container */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                marginBottom: "40px"
              }}>
                {/* Connecting lines */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  left: "5%",
                  right: "5%",
                  height: "2px",
                  backgroundColor: "var(--border-color)",
                  zIndex: 0
                }} />

                {/* Milestones steps */}
                {["placed", "processing", "shipped", "transit", "delivered"].map((step, idx) => {
                  const stepClass = getStepClass(step);
                  let displayLabel = "Placed";
                  if (step === "processing") displayLabel = "Processing";
                  else if (step === "shipped") displayLabel = "Shipped";
                  else if (step === "transit") displayLabel = "In Transit";
                  else if (step === "delivered") displayLabel = "Delivered";

                  let color = "var(--text-secondary)";
                  let bg = "#ffffff";
                  let border = "2px solid var(--border-color)";

                  if (stepClass === "completed") {
                    color = "var(--text-primary)";
                    bg = "var(--accent-pink)";
                    border = "2px solid var(--accent-pink)";
                  } else if (stepClass === "active") {
                    color = "var(--accent-pink)";
                    bg = "#ffffff";
                    border = "2px solid var(--accent-pink)";
                  }

                  return (
                    <div key={idx} style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      position: "relative",
                      zIndex: 2,
                      width: "18%"
                    }}>
                      {/* Step Bubble */}
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: bg,
                        border: border,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease"
                      }}>
                        {stepClass === "completed" && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                            <path d="M20 6L9 17L4 12" />
                          </svg>
                        )}
                      </div>

                      {/* Label */}
                      <span style={{
                        fontSize: "9.5px",
                        fontWeight: "600",
                        color: color,
                        textAlign: "center",
                        whiteSpace: "nowrap"
                      }}>
                        {displayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Courier info */}
              <div style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "12px",
                color: "var(--text-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div>Carrier: <strong style={{ color: "var(--text-primary)" }}>{trackingInfo.carrier}</strong></div>
                <div>Est. Transit: <strong style={{ color: "var(--accent-pink)" }}>{trackingInfo.estDelivery}</strong></div>
              </div>
            </div>

            {/* Event Timeline Logs */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "36px 30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h3 style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "24px", fontFamily: "var(--font-serif)" }}>
                Transit Activities Log
              </h3>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "relative",
                paddingLeft: "16px"
              }}>
                {/* Timeline vertical line */}
                <div style={{
                  position: "absolute",
                  left: "4px",
                  top: "6px",
                  bottom: "6px",
                  width: "1.5px",
                  backgroundColor: "var(--border-color)"
                }} />

                {trackingInfo.events.map((ev, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute",
                      left: "-16px",
                      top: "4px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: i === 0 ? "var(--accent-pink)" : "var(--border-color)",
                      border: i === 0 ? "2px solid #ffffff" : "none",
                      boxShadow: i === 0 ? "0 0 0 2px var(--accent-pink)" : "none"
                    }} />

                    {/* Content */}
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "2px" }}>{ev.time}</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>{ev.location}</div>
                    <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>{ev.status}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .track-order-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .track-order-img-box {
            min-height: 180px !important;
          }
        }
      `}</style>
    </main>
  );
}
