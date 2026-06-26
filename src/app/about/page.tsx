"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SlideItem {
  title: string;
  image: string;
  borderColor: string;
  tag: string;
}

export default function AboutPage() {
  const slides: SlideItem[] = [
    {
      title: "Your Daily Hair Care Essential",
      image: "/floracombmain.png",
      borderColor: "#ed74b2",
      tag: "Hand-crafted Styling"
    },
    {
      title: "Pinch-Free Lash Precision",
      image: "/eyelash-curler.png",
      borderColor: "#26d1f0",
      tag: "Perfect Lash Lift"
    },
    {
      title: "Deep Rejuvenating Massage",
      image: "/dual-sided-classic-foot-file-scrubber-gallery-2.jpg",
      borderColor: "#ed74b2",
      tag: "Soothing Face Roller"
    },
    {
      title: "Absolute Precision Extraction",
      image: "/blackhead-blemish-remover-tool-main.png",
      borderColor: "#26d1f0",
      tag: "Stainless Steel Tool"
    },
    {
      title: "Precision Application",
      image: "/precision-beauty-blender-sponge-gallery-2.png",
      borderColor: "#10224d",
      tag: "Precision Beauty Blender Sponge"
    },
    {
      title: "Manicure Tool with glittery handle",
      image: "/manicure-tool.png",
      borderColor: "#ed74b2",
      tag: "Manicure Tool with glittery handle",
    }
  ];

  const [activeIndex, setActiveIndex] = useState(2); // Center active card

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "var(--page-top-padding) 0 100px 0",
      backgroundColor: "var(--bg-primary)",
      overflow: "hidden"
    }}>

      {/* SECTION 1: HERO & OUTLINE ICONS */}
      <section className="about-hero-section">
        <div className="container">
          <div className="badge-header-container">
            
            {/* Floating outline tool badges */}
            <div className="floating-badge badge-roller floating-element-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10224d" strokeWidth="1.5">
                <path d="M12 6V18" />
                <path d="M7 6H17M9 6v-2h6v2" />
                <path d="M9 18H15v2H9v-2z" />
                <rect x="5" y="4" width="14" height="3" rx="1" />
                <rect x="8" y="17" width="8" height="2.5" rx="1" />
              </svg>
            </div>
            <div className="floating-badge badge-comb floating-element-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10224d" strokeWidth="1.5">
                <rect x="4" y="8" width="16" height="8" rx="2" />
                <path d="M6 10v4M9 10v4M12 10v4M15 10v4M18 10v4" />
              </svg>
            </div>
            <div className="floating-badge badge-scrubber floating-element-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10224d" strokeWidth="1.5">
                <circle cx="12" cy="12" r="8" />
                <path d="M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </svg>
            </div>
            <div className="floating-badge badge-curler floating-element-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10224d" strokeWidth="1.5">
                <circle cx="8" cy="18" r="2" />
                <circle cx="16" cy="18" r="2" />
                <path d="M8 16V10M16 16V10" />
                <path d="M6 6c0-1.5 2-2 6-2s6 .5 6 2c0 2-3 3-6 3s-6-1-6-3z" />
              </svg>
            </div>

            <h1 className="badge-hero-title">
              Beauty tools crafted to complement<br />your daily rhythm never interrupt it.
            </h1>
          </div>

          {/* Intro split grid */}
          <div className="intro-split-grid">
            <div className="intro-visual-col">
              <div className="sponge-image-wrapper">
                <Image 
                  src="/Mahqee beauty essential.png" 
                  alt="Aesthetic Makeup Blender Wedges" 
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
            <div className="intro-text-col">
              <div className="intro-text-card">
                <h3 className="intro-card-title">Welcome to Mahqee – Miracle Of Beauty</h3>
                <p style={{ marginBottom: "16px" }}>
                  At Mahqee, we believe that true beauty lies in the details of your daily self-care rituals. Guided by our philosophy, <strong>&ldquo;Miracle Of Beauty,&rdquo;</strong> we are dedicated to crafting premium, high-quality beauty and personal care tools that elevate your everyday routine into a luxurious, effortless experience.
                </p>
                <p>
                  We understand that the right tools make all the difference. Whether it is a comb designed to glide seamlessly through your hair, an extraction tool built for absolute precision, or a scrubber that rejuvenates your skin, Mahqee products are engineered to deliver professional-grade results from the comfort of your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CAROUSEL */}
      <section className="about-carousel-section">
        <div className="container">
          <div className="carousel-header">
            <h2 className="carousel-title">Good Tools. Great Taste.</h2>
            <p className="carousel-subtitle">The essentials everyone is talking about (and showing off)</p>
          </div>
        </div>

        <div className="carousel-container">
          <button onClick={handlePrev} className="carousel-btn prev" aria-label="Previous slide">
            &#8249;
          </button>
          
          <div className="carousel-track-wrapper">
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(calc(50% - ${activeIndex * 280 + 130}px))`
              }}
            >
              {slides.map((slide, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`carousel-card ${isActive ? "active" : ""}`}
                    style={{
                      borderColor: isActive ? slide.borderColor : "var(--border-color)",
                      boxShadow: isActive ? `0 10px 30px rgba(16, 34, 77, 0.12)` : "none"
                    }}
                  >
                    <div className="card-image-wrapper">
                      <Image 
                        src={slide.image} 
                        alt={slide.title} 
                        fill
                        sizes="260px"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    {isActive && (
                      <div className="card-overlay">
                        <span className="card-tag">{slide.tag}</span>
                        <h4 className="card-title">{slide.title}</h4>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleNext} className="carousel-btn next" aria-label="Next slide">
            &#8250;
          </button>
        </div>
      </section>

      {/* SECTION 3: FOUNDER NOTE */}
      <section className="about-founder-section">
        <div className="container" style={{ maxWidth: "850px" }}>
          
          {/* Centered Heading at the top */}
          <div className="founder-header-centered">
            <h2 className="founder-section-headline">
              A Note From <span className="serif-font-accent">OUR FOUNDER</span>
            </h2>
          </div>

          {/* Letter Card (Full Width) */}
          <div className="founder-letter-container">
            
            {/* Note sheet */}
            <div className="founder-note-sheet">
              
              {/* Matte Adhesive Tape Effect */}
              <div className="letter-tape" />
              
              {/* Speech bubble sticker moved to corner of the letter */}
              <div className="letter-sticker-speech">
                Talk beauty to me
              </div>
              
              <div className="note-text-body">
                
                {/* Our Mission */}
                <div className="note-section-block">
                  <h3 className="note-section-title">Our Mission</h3>
                  <p>
                    Our mission is simple: to empower individuals to feel confident, radiant, and cared for through thoughtfully designed grooming and beauty accessories. We combine modern aesthetics, ergonomic functionality, and uncompromised quality to create essentials that protect, enhance, and celebrate your natural beauty.
                  </p>
                </div>

                {/* The Mahqee Promise */}
                <div className="note-section-block">
                  <h3 className="note-section-title">The Mahqee Promise</h3>
                  
                  <div className="promise-detail-item">
                    <h4 className="promise-detail-header">✨ Uncompromising Quality</h4>
                    <p>
                      We pride ourselves on engineering products using premium, skin-safe, and highly durable materials—from robust, rust-resistant stainless steel to hand-polished, anti-snag hair tools. Every Mahqee item undergoes rigorous quality standards to ensure it is built to last.
                    </p>
                  </div>

                  <div className="promise-detail-item">
                    <h4 className="promise-detail-header">📐 Thoughtful, Precision Design</h4>
                    <p>
                      Our products are never generic. We meticulously study ergonomics and utility to bring you features that matter—like rounded comb teeth that safely massage the scalp, anti-slip diamond handles for steady control, and pinch-free mechanisms for delicate eye areas.
                    </p>
                  </div>

                  <div className="promise-detail-item">
                    <h4 className="promise-detail-header">🌸 Elegant Aesthetics</h4>
                    <p>
                      We believe your beauty tools should look as beautiful as they perform. From vibrant geometric patterns to luxurious marbled textures, Mahqee brings a touch of modern sophistication and color to your vanity.
                    </p>
                  </div>
                </div>

                {/* Experience the Miracle of Beauty */}
                <div className="note-section-block cta-closing-block">
                  <h3 className="note-section-title">Experience the Miracle of Beauty</h3>
                  <p style={{ marginBottom: "20px" }}>
                    Your self-care routine deserves the best. Discover our collections and experience the perfect harmony of innovation, comfort, and luxury with Mahqee.
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Link href="/shop" className="btn-primary" style={{ fontSize: "12px", padding: "10px 20px" }}>
                      Explore Shop
                    </Link>
                    <Link href="/contact" className="btn-secondary" style={{ fontSize: "12px", padding: "10px 20px" }}>
                      Get In Touch
                    </Link>
                  </div>
                </div>

                <div className="note-signature-block">
                  <span className="note-closing">With love,</span>
                  <span className="note-author-name">Team Mahqee</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Hero Section Styling */
        .about-hero-section {
          padding-bottom: 90px;
          border-bottom: 1px solid var(--border-color);
        }

        .badge-header-container {
          text-align: center;
          position: relative;
          padding: 60px 0;
          max-width: 800px;
          margin: 0 auto 40px auto;
        }

        .badge-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(34px, 5.5vw, 56px);
          color: var(--text-primary);
          line-height: 1.15;
          position: relative;
          z-index: 2;
        }

        .floating-badge {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--text-primary);
          box-shadow: 0 4px 10px rgba(16, 34, 77, 0.05);
          z-index: 1;
        }

        .badge-roller {
          background-color: #fde2e4;
          top: 10px;
          left: 12%;
        }

        .badge-comb {
          background-color: #cdebf9;
          top: -20px;
          right: 32%;
        }

        .badge-scrubber {
          background-color: #d8f3dc;
          bottom: 0px;
          left: 36%;
        }

        .badge-curler {
          background-color: #fefae0;
          bottom: 20px;
          right: 14%;
        }

        .intro-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 20px;
        }

        .sponge-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1.1 / 1;
          border-radius: 24px;
          overflow: hidden;
          background-color: #ffff;
          box-shadow: var(--shadow-md);
        }

        .intro-text-col {
          display: flex;
          align-items: center;
        }

        .intro-text-card {
          background-color: #faf9f6;
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(16, 34, 77, 0.06);
          color: var(--text-secondary);
          font-size: 14.5px;
          line-height: 1.75;
        }

        .intro-card-title {
          font-family: var(--font-serif);
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        /* Carousel Section Styling */
        .about-carousel-section {
          padding: 100px 0;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
        }

        .carousel-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .carousel-title {
          font-family: var(--font-serif);
          font-size: 32px;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .carousel-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0 40px;
          overflow: visible;
        }

        .carousel-btn {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
          z-index: 10;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .carousel-btn:hover {
          background-color: var(--bg-primary);
          border-color: var(--text-primary);
          transform: scale(1.05);
        }

        .carousel-btn.prev {
          left: 40px;
        }

        .carousel-btn.next {
          right: 40px;
        }

        .carousel-track-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 40px 0;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .carousel-card {
          width: 260px;
          height: 340px;
          border-radius: 20px;
          border: 2px solid transparent;
          overflow: hidden;
          background-color: var(--bg-primary);
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          transform: scale(0.92);
          opacity: 0.65;
          transition: var(--transition-smooth);
        }

        .carousel-card.active {
          transform: scale(1.08);
          opacity: 1;
          z-index: 5;
        }

        .card-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, rgba(16, 34, 77, 0) 0%, rgba(16, 34, 77, 0.85) 100%);
          padding: 24px 20px 20px 20px;
          color: #ffffff;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-tag {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-blue);
          font-weight: 600;
        }

        .card-title {
          font-size: 13.5px;
          font-weight: 500;
          line-height: 1.4;
        }

        /* Founder Section Styling */
        .about-founder-section {
          background-color: #fbebed;
          padding: 100px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .founder-header-centered {
          text-align: center;
          margin-bottom: 60px;
        }

        .founder-section-headline {
          font-family: var(--font-serif);
          font-size: clamp(32px, 5vw, 42px);
          color: var(--text-primary);
          line-height: 1.15;
        }

        .founder-letter-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
        }

        /* Note sheet styling - Reworked to Full Width */
        .founder-note-sheet {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0 15px 35px rgba(16, 34, 77, 0.06), 0 2px 10px rgba(16, 34, 77, 0.03);
          padding: 60px 56px;
          border: 1px dashed rgba(16, 34, 77, 0.1);
          position: relative;
          z-index: 1;
          width: 100%;
          margin: 0 auto;
        }

        /* Matte Tape visual on top of the letter */
        .letter-tape {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 150px;
          height: 32px;
          background-color: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(1.5px);
          border-left: 2px dashed rgba(0, 0, 0, 0.06);
          border-right: 2px dashed rgba(0, 0, 0, 0.06);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
          z-index: 5;
        }

        /* Speech Bubble Sticker at the Corner of the Letter */
        .letter-sticker-speech {
          position: absolute;
          top: -24px;
          right: 20px;
          background-color: #cdebf9;
          border: 1px solid var(--text-primary);
          color: var(--text-primary);
          font-size: 10px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 30px;
          transform: rotate(6deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          white-space: nowrap;
          z-index: 5;
        }

        .letter-sticker-speech::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 15px;
          width: 0;
          height: 0;
          border-width: 6px 6px 0 0;
          border-color: #cdebf9 transparent transparent transparent;
        }

        .note-text-body {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.8;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .note-section-title {
          font-family: var(--font-serif);
          font-size: 21px;
          color: var(--text-primary);
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(16, 34, 77, 0.08);
          padding-bottom: 8px;
        }

        .promise-detail-item {
          margin-bottom: 24px;
        }

        .promise-detail-item:last-child {
          margin-bottom: 0;
        }

        .promise-detail-header {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .cta-closing-block {
          background-color: var(--bg-primary);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid var(--border-color);
        }

        .note-signature-block {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid rgba(16, 34, 77, 0.08);
          padding-top: 20px;
        }

        .note-closing {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .note-author-name {
          font-family: 'Georgia', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--text-primary);
          font-style: italic;
          margin-top: 4px;
        }

        /* Float Badge Animations */
        @keyframes floatBadge {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }

        .badge-roller {
          animation: floatBadge 5s ease-in-out infinite;
        }

        .badge-comb {
          animation: floatBadge 6s ease-in-out infinite 1s;
        }

        .badge-scrubber {
          animation: floatBadge 5.5s ease-in-out infinite 0.5s;
        }

        .badge-curler {
          animation: floatBadge 6.5s ease-in-out infinite 1.5s;
        }

        /* Responsive Layout Rules */
        @media (max-width: 900px) {
          .intro-split-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .founder-note-sheet {
            padding: 40px 24px;
          }
        }
        @media (max-width: 600px) {
          .floating-badge {
            display: none !important;
          }
          .carousel-container {
            padding: 0 10px !important;
          }
          .carousel-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 18px !important;
          }
          .carousel-btn.prev {
            left: 10px !important;
          }
          .carousel-btn.next {
            right: 10px !important;
          }
          .letter-sticker-speech {
            right: 10px !important;
            font-size: 9px !important;
            padding: 4px 10px !important;
            top: -20px !important;
          }
          .letter-tape {
            width: 100px !important;
            height: 24px !important;
            top: -12px !important;
          }
        }
      `}</style>
    </main>
  );
}
