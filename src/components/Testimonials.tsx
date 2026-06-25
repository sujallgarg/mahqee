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
}

export default function Testimonials() {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(testimonialsRef);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews: Review[] = [
    {
      author: "Ananya R.",
      verified: true,
      date: "06/25/26",
      rating: 5,
      title: "Game changer for thick hair!",
      body: "I have super dense hair and most combs either pull or snap within weeks. The Mahqee dressing comb has been a complete game changer. The rounded teeth feel amazing on my scalp and it glides through knots effortlessly without a single snag. Plus, the pink geometric design looks beautiful on my vanity!",
      productTag: "Hair Collection (Comb)"
    },
    {
      author: "Rahul M.",
      verified: true,
      date: "06/25/26",
      rating: 5,
      title: "Professional quality at home",
      body: "The dual-ended extractor tool feels incredibly premium and sturdy. The textured diamond handle means it doesn't slip out of my fingers at all, giving me total control. It's so much more hygienic than using my fingers and completely clears pores without damaging my skin. A must-have tool!",
      productTag: "Skincare Tools (Blackhead Remover)"
    },
    {
      author: "Priya K.",
      verified: true,
      date: "06/25/26",
      rating: 5,
      title: "Perfect lift, zero pinching!",
      body: "I’ve always been terrified of eyelash curlers pinching my eyelids, but this one is incredibly smooth and precise. It fits my eye shape perfectly and gives an instant, uniform lift that lasts all day. Truly designed for your daily rituals!",
      productTag: "Eyelash Curler Review"
    },
    {
      author: "Sneha J.",
      verified: true,
      date: "06/25/26",
      rating: 5,
      title: "Luxurious shower essential",
      body: "Absolutely love the braided back scrubber! The dual handles make it so easy to clean hard-to-reach areas comfortably. The mesh is dense, high-quality, and creates an insane amount of lather with just a drop of body wash. It leaves my skin feeling incredibly soft and exfoliated.",
      productTag: "Bath Collection (Loofah)"
    },
    {
      author: "Vikram S.",
      verified: true,
      date: "06/25/26",
      rating: 5,
      title: "Beautifully designed essentials",
      body: "Mahqee really stays true to its motto, 'Miracle of Beauty'. What I love most is that their products feel like they were genuinely designed for my daily rituals, not the other way around. Everything from the marble textures to the ergonomic grips shows they actually care about the user experience. Highly recommend!",
      productTag: "Overall Brand Feedback"
    }
  ];

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
                  lineHeight: "1.65",
                  color: "var(--text-secondary)",
                  marginBottom: "24px",
                  minHeight: "135px"
                }}>
                  &ldquo;{rev.body}&rdquo;
                </p>
              </div>

              {/* Reviewed Product tag */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "16px"
              }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--accent-pink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
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
