"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface CatBlock {
  title: string;
  label: string;
  image: string;
  route: string;
}

export default function CategoryGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(gridRef);

  const categories: CatBlock[] = [
    { title: "Comb", label: "Comb", image: "/images/floral-comb2.png", route: "/shop?cat=comb" },
    { title: "Hair Care", label: "Hair", image: "/images/category-haircare.png", route: "/shop?cat=oils" },
    { title: "Body Care", label: "Bath & Body", image: "/images/category-bodycare.png", route: "/shop?cat=creams" },
    { title: "Lip Care", label: "Lip", image: "/images/category-lipcare.png", route: "/shop" }
  ];

  return (
    <section 
      ref={gridRef}
      style={{
        padding: "120px 0",
        backgroundColor: "#ffffff"
      }}
    >
      <div className="container">
        <h2 style={{
          fontSize: "32px",
          color: "var(--text-primary)",
          marginBottom: "48px",
          fontFamily: "var(--font-serif)",
          textAlign: "left"
        }}>
          Shop by Category
        </h2>

        {/* Categories Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "36px"
        }}>
          {categories.map((cat, idx) => {
            const cardOffset = (progress - 0.5) * (idx % 2 === 0 ? -15 : 15);
            return (
              <Link 
                key={idx}
                href={cat.route}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  textDecoration: "none",
                  transform: `translateY(${cardOffset}px)`,
                  transition: "transform 0.15s ease-out"
                }}
                className="category-card-link"
              >
                {/* Overlay visual box */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "240px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-sm)",
                  transition: "var(--transition-smooth)"
                }} className="category-image-box">
                  {/* Premium next/image */}
                  <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    style={{ objectFit: "cover", zIndex: 0 }}
                  />
                  {/* Legibility Gradient Overlay */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(180deg, rgba(16, 34, 77, 0.2) 0%, rgba(16, 34, 77, 0.6) 100%)",
                    zIndex: 1
                  }} />
                  
                  {/* Heading overlay */}
                  <h3 style={{
                    fontSize: "24px",
                    color: "#ffffff",
                    fontWeight: "600",
                    zIndex: 2,
                    textAlign: "center",
                    padding: "0 16px"
                  }}>
                    {cat.title}
                  </h3>
                </div>

                {/* Sub-label under block */}
                <span style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--text-secondary)"
                }}>
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .category-image-box:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-md);
        }
        .category-card-link:hover span {
          color: var(--accent-pink);
        }
      `}</style>
    </section>
  );
}
