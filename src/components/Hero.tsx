"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  // We keep useScrollProgress if we want to add any parallax effects later,
  // but it's not strictly necessary for this simple image slider.
  const progress = useScrollProgress(sectionRef);

  const banners = [
    { src: "/images/banners/banner1.jpg", alt: "MAHQEE All-in-one Beauty Tool Kit" },
    { src: "/images/banners/banner 5.png", alt: "MAHQEE Detangle Smooth Shine Comb" },
    { src: "/images/banners/banner2.jpg", alt: "Your Beauty Our Care" },
    { src: "/images/banners/banner3.jpg", alt: "Clear Skin Confident You" },
    { src: "/images/banners/banner4.jpg", alt: "Perfect Hair Every Day" }
  ];

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section 
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "var(--bg-primary)",
        padding: "120px 24px 48px 24px" // Premium spacing below fixed navbar
      }}
    >
      <div 
        className="carousel-container" 
        style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "1400px",
          aspectRatio: "1024 / 683", // Keep original aspect ratio to fit the content exactly
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          transform: `translateY(${(progress - 0.5) * -15}px)`, // Slight parallax lift
          transition: "transform 0.1s ease-out"
        }}
      >
        {banners.map((banner, idx) => (
          <div 
            key={idx}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === idx ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              zIndex: currentSlide === idx ? 1 : 0
            }}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : "lazy"}
              sizes="(max-width: 1440px) 100vw, 1400px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={90}
            />
          </div>
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
            fontSize: "20px",
            color: "var(--text-primary)",
            transition: "all 0.2s ease"
          }}
          className="carousel-nav-btn"
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
            fontSize: "20px",
            color: "var(--text-primary)",
            transition: "all 0.2s ease"
          }}
          className="carousel-nav-btn"
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Slide navigation dots */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 10
        }}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === currentSlide ? "var(--text-primary)" : "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(0,0,0,0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                padding: 0
              }}
              aria-label={`Go to promotional banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .carousel-nav-btn:hover {
          background-color: var(--text-primary) !important;
          color: #ffffff !important;
          transform: translateY(-50%) scale(1.08) !important;
        }
      `}</style>
    </section>
  );
}
