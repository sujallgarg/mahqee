import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--bg-secondary)",
      borderTop: "1px solid var(--border-color)",
      padding: "64px 0 32px 0",
      marginTop: "auto",
      color: "var(--text-secondary)",
      fontSize: "12px"
    }}>
      <div className="container">
        {/* Apple-style footer directory grids */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "32px",
          marginBottom: "48px"
        }}>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "16px", fontSize: "12px" }}>Explore Categories</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><Link href="/shop?cat=nail-accessory" className="footer-link">Nail Accessory</Link></li>
              <li><Link href="/shop?cat=hair" className="footer-link">Hair</Link></li>
              <li><Link href="/shop?cat=foot" className="footer-link">Foot</Link></li>
              <li><Link href="/shop?cat=bath" className="footer-link">Bath</Link></li>
              <li><Link href="/shop?cat=makeup" className="footer-link">Makeup</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "16px", fontSize: "12px" }}>Account & Bag</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><a href="#" className="footer-link">Manage Account</a></li>
              <li><a href="#" className="footer-link">Order Tracking</a></li>
              <li><a href="#" className="footer-link">Returns & Exchanges</a></li>
              <li><a href="#" className="footer-link">MAHQEE Membership</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "16px", fontSize: "12px" }}>MAHQEE Boutique</h4>
            <p style={{ lineHeight: "1.6", marginBottom: "12px" }}>
              Find a boutique or experience lounge near you.
            </p>
            <a href="#" style={{ color: "var(--accent-pink)", fontWeight: "500" }}>Find a Boutique</a>
          </div>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid var(--border-color)", marginBottom: "24px" }} />

        {/* Bottom footer text */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {/* <p style={{ lineHeight: "1.6" }}>
            More ways to shop: <a href="#" style={{ textDecoration: "underline", color: "var(--text-primary)" }}>Find an Aesthetician</a> or call 1-800-MAHQEE.
          </p> */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            color: "var(--text-secondary)",
            fontSize: "11px"
          }}>
            <span>Copyright © 2026 MAHQEE Inc. All rights reserved.</span>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Use</a>
              <a href="#" className="footer-link">Sales and Refunds</a>
              <a href="#" className="footer-link">Legal</a>
            </div>
            <span>India / English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
