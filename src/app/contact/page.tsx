"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    const messageText = `Hello MAHQEE,\n\nI would like to submit an inquiry:\n\n*Name:* ${formData.name.trim()}\n*Email:* ${formData.email.trim()}\n*Subject:* ${formData.subject.trim() || "N/A"}\n\n*Message:*\n${formData.message.trim()}`;
    const WHATSAPP_BUSINESS_PHONE = "919650045175";
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(messageText)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Simulate API request delay
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitted(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "var(--page-top-padding) 24px var(--page-bottom-padding) 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Hero Boutique Banner */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "280px",
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: "48px",
          border: "1px solid rgba(16, 34, 77, 0.08)",
          boxShadow: "var(--shadow-sm)"
        }} className="contact-hero-banner">
          <Image 
            src="/banners/Contactus-banner.png" 
            alt="MAHQEE Apothecary Boutique" 
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: "fill", objectPosition: "center" }}
            priority
          />
          <div style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            background: "linear-gradient(180deg, rgba(16, 34, 77, 0.05) 0%, rgba(16, 34, 77, 0.3) 100%)"
          }} />
        </div>

        {/* Intro header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.15em",
            color: "var(--accent-pink)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px"
          }}>
            Get in Touch
          </span>
          <h1 className="contact-title" style={{
            fontSize: "40px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            marginBottom: "12px"
          }}>
            Connect With Us
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
            Reach out to our customer concierge team for product help, orders support, or collaborations.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "48px",
          alignItems: "start"
        }} className="contact-grid">
          
          {/* Left: Contact Form Card */}
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "36px 30px",
            boxShadow: "var(--shadow-sm)"
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                {/* Success Icon */}
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(38, 209, 240, 0.1)",
                  color: "var(--accent-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>
                  Inquiry Received
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "24px" }}>
                  Thank you for connecting. Our concierge desk will review your message and reply via email within 24 business hours.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{ padding: "8px 20px", fontSize: "13px" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      outline: "none",
                      fontSize: "13px",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      outline: "none",
                      fontSize: "13px",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>Subject (Optional)</label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      outline: "none",
                      fontSize: "13px",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Describe your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      outline: "none",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ justifyContent: "center", padding: "12px", borderRadius: "8px", width: "100%", fontSize: "13.5px" }}
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right: Info & Boutiques Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Contact details */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h3 style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                Concierge Desk
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px" }}>
                <div>
                  <span style={{ color: "var(--text-secondary)", display: "block" }}>Email Inquiries</span>
                  <strong style={{ color: "var(--text-primary)" }}>Mahqeebeautycare@gmail.com</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)", display: "block" }}>Concierge Support</span>
                  <strong style={{ color: "var(--text-primary)" }}>+91 9671655023</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)", display: "block" }}>Working Hours</span>
                  <strong style={{ color: "var(--text-primary)" }}>Mon - Sat, 10:00 AM - 7:00 PM IST</strong>
                </div>
              </div>
            </div>

            {/* Store locations */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "30px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h3 style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                Boutiques
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "12.5px" }}>
                <div>
                  {/* <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>The Chanakya Boutique</strong> */}
                  <span style={{ color: "var(--text-secondary)" }}>Shop No. - 1 Radhe Radhe Market, Quila Road, Mandir Wali Gali, Rohtak, Haryana - 124001</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .contact-hero-banner {
            height: 180px !important;
          }
          .contact-title {
            font-size: 28px !important;
          }
        }
      `}</style>
    </main>
  );
}
