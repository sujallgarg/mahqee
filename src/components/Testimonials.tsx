"use client";

import React, { useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface Review {
  author: string;
  verified: boolean;
  date: string;
  rating: number;
  title: string;
  body: string;
  productTag: string;
  productType: "balm" | "serum" | "cream" | "oil";
}

export default function Testimonials() {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(testimonialsRef);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews: Review[] = [
    {
      author: "PALLAVI ..",
      verified: true,
      date: "06/15/26",
      rating: 5,
      title: "Colour is good and material",
      body: "Colour is good and material is excellent and size is also best have to carry and the bag is literally so good and it is very beautiful. Perfectly matched with the brand colors.",
      productTag: "MAHQEE Velvet Tote Bag",
      productType: "balm"
    },
    {
      author: "kashish L.",
      verified: true,
      date: "06/15/26",
      rating: 5,
      title: "Minimalist & Elegant",
      body: "Great product for dry skin. It has solved my flaky patches overnight. I highly recommend it for anybody looking to repair their barrier.",
      productTag: "MAHQEE Dry Skincare Kit",
      productType: "cream"
    },
    {
      author: "Poonam S.",
      verified: true,
      date: "06/15/26",
      rating: 5,
      title: "Hydrating",
      body: "It is extremely hydrating and nonsticky on skin. I'm using it on my skin daily and it keeps my face hydrated throughout the day. Velvet Rose formula is outstanding.",
      productTag: "Rose Water Hydrosol",
      productType: "serum"
    },
    {
      author: "Abishekaprabu ..",
      verified: true,
      date: "06/15/26",
      rating: 5,
      title: "Very happy with the purchase",
      body: "Very good, truly lightweight moisturizer. Absorbs instantly and leaves a cashmere matte finish without making my face oily. Will repurchase.",
      productTag: "Jasmine Velvet Cream",
      productType: "cream"
    }
  ];

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const renderProductThumbnail = (type: string) => {
    // Mini visual thumbnail representation
    return (
      <div style={{
        width: "24px",
        height: "24px",
        backgroundColor: "var(--bg-primary)",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}>
        <div style={{
          width: "10px",
          height: "15px",
          borderRadius: "1px",
          background: type === "serum" ? "var(--accent-blue)" : type === "oil" ? "var(--accent-pink)" : "var(--text-primary)"
        }} />
      </div>
    );
  };

  return (
    <section 
      ref={testimonialsRef}
      style={{
        padding: "var(--section-padding-y) 0",
        backgroundColor: "#ffffff",
        borderTop: "1px solid var(--border-color)",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Parallax background aura */}
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(38, 209, 240, 0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: `translateY(${(progress - 0.5) * -60}px)`,
        transition: "transform 0.1s ease-out",
        zIndex: 0
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontSize: "32px",
          color: "var(--text-primary)",
          marginBottom: "48px",
          fontFamily: "var(--font-serif)"
        }}>
          What Our Customers Say
        </h2>

        {/* Carousel buttons */}
        {/* <div style={{
          position: "absolute",
          top: "0px",
          right: "24px",
          display: "flex",
          gap: "8px",
          zIndex: 10
        }}>
          <button 
            onClick={scrollLeft}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Scroll reviews left"
          >
            ‹
          </button>
          <button 
            onClick={scrollRight}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Scroll reviews right"
          >
            ›
          </button>
        </div> */}

        {/* Horizontal Reviews Track */}
        <div 
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingBottom: "24px",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            transform: `translateY(${(progress - 0.5) * -15}px)`,
            transition: "transform 0.15s ease-out"
          }}
          className="reviews-scroll-container"
        >
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="premium-card-hover"
              style={{
                flex: "0 0 320px",
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                scrollSnapAlign: "start"
              }}
            >
              {/* Header: Author, Rating, Date */}
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginBottom: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{rev.author}</strong>
                    {rev.verified && (
                      <span style={{
                        color: "var(--accent-blue)",
                        fontSize: "9px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px"
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <span>{rev.date}</span>
                </div>

                {/* Star Rating */}
                <div style={{ display: "flex", gap: "2px", color: "var(--accent-pink)", marginBottom: "12px" }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <h3 style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px"
                }}>
                  {rev.title}
                </h3>
                
                <p style={{
                  fontSize: "12.5px",
                  lineHeight: "1.6",
                  color: "var(--text-secondary)",
                  marginBottom: "24px",
                  minHeight: "80px"
                }}>
                  &ldquo;{rev.body}&rdquo;
                </p>
              </div>

              {/* Reviewed Product Thumbnail details */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "16px"
              }}>
                {renderProductThumbnail(rev.productType)}
                <span style={{
                  fontSize: "11.5px",
                  fontWeight: "500",
                  color: "var(--text-primary)"
                }}>
                  {rev.productTag}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>

      <style jsx global>{`
        .reviews-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
      `}</style>
    </section>
  );
}
