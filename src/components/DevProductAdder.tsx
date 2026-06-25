"use client";

import React, { useState } from "react";
import { useCart, Product } from "@/context/CartContext";
import Image from "next/image";

export default function DevProductAdder() {
  const { addProduct, resetProducts, products } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Nail Accessory");
  const [price, setPrice] = useState("299");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/serum.png");
  const [imagesInput, setImagesInput] = useState("/serum.png, /vit_c_texture.png, /vit_c_lifestyle.png");
  const [ingredients, setIngredients] = useState("Active Botanical Extract, Hyaluronic Acid, Vitamin E");
  const [benefits, setBenefits] = useState("Deeply hydrates epidermal layers, Calms skin redness, Restores glow");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      // Pre-populate gallery with the same uploaded image plus standard fallbacks
      setImagesInput(`${base64String}, /category-skincare.png, /category-bodycare.png`);
    };
    reader.readAsDataURL(file);
  };

  // Only render during development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const imagePresets = [
    { label: "Serum Bottle", path: "/serum.png" },
    { label: "Moisturizer Tube", path: "/moisturizer.png" },
    { label: "Cleanser", path: "/cleanser.png" },
    { label: "Sunscreen", path: "/sunscreen.png" },
    { label: "Floral Comb", path: "/floral-comb.png" },
    { label: "Floral Comb 2", path: "/floral-comb2.png" },
    { label: "Floral Comb 3", path: "/floral-comb3.png" },
    { label: "Floral Comb 4", path: "/floral-comb4.png" },
    { label: "MAHQEE Cleanser", path: "/mahqee-cleanser.png" },
    { label: "MAHQEE Retinol Cream", path: "/mahqee-retinol-cream.png" },
    { label: "MAHQEE Rose Water", path: "/mahqee-rose-water.png" },
    { label: "MAHQEE Vitamin C", path: "/mahqee-vitamin-c.png" }
  ];

  const handlePresetSelect = (presetPath: string) => {
    setImage(presetPath);
    // Auto populate gallery images based on selection to make it quick
    if (presetPath.includes("comb")) {
      setImagesInput("/floral-comb.png, /floral-comb2.png, /floral-comb3.png, /floral-comb4.png");
    } else if (presetPath.includes("vitamin-c")) {
      setImagesInput("/mahqee-vitamin-c.png, /vit_c_texture.png, /vit_c_lifestyle.png");
    } else if (presetPath.includes("rose-water")) {
      setImagesInput("/mahqee-rose-water.png, /rose_water_texture.png, /rose_water_lifestyle.png");
    } else if (presetPath.includes("cleanser")) {
      setImagesInput("/mahqee-cleanser.png, /cleanser_texture.png, /cleanser_lifestyle.png");
    } else {
      setImagesInput(`${presetPath}, /category-skincare.png, /category-bodycare.png`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline || !description || !price) {
      alert("Please fill out all required fields.");
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Check if ID already exists
    if (products.some(p => p.id === id)) {
      alert(`A product with ID "${id}" already exists. Please choose a different name.`);
      return;
    }

    const newProduct: Product = {
      id,
      name,
      tagline,
      category,
      price: parseFloat(price) || 0,
      description,
      image,
      images: imagesInput.split(",").map(img => img.trim()).filter(Boolean),
      ingredients: ingredients.split(",").map(ing => ing.trim()).filter(Boolean),
      benefits: benefits.split(",").map(ben => ben.trim()).filter(Boolean),
      isBestSeller
    };

    addProduct(newProduct);
    
    // Reset form fields
    setName("");
    setTagline("");
    setDescription("");
    setIsBestSeller(false);
    setSuccessMsg(`"${newProduct.name}" added successfully!`);
    
    setTimeout(() => {
      setSuccessMsg("");
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating dev launcher button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          backgroundColor: "var(--text-primary)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "12px 20px",
          borderRadius: "99px",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          animation: "devPulse 2s infinite"
        }}
        className="dev-floating-btn"
      >
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#10b981",
          display: "inline-block"
        }} />
        Dev: Add Product
      </button>

      {/* Dev Overlay Modal */}
      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(16, 34, 77, 0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }} onClick={() => setIsOpen(false)}>
          
          <div style={{
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 24px 64px rgba(16, 34, 77, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "devFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: "24px 30px",
              borderBottom: "1px solid rgba(16, 34, 77, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(16, 34, 77, 0.02)"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-serif)"
                }}>
                  Dev Tool: Add Custom Product
                </h3>
                <span style={{ fontSize: "11px", color: "var(--accent-pink)", fontWeight: "500" }}>
                  VISIBLE ONLY IN DEVELOPMENT ENVIRONMENT
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} style={{
              padding: "30px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {successMsg ? (
                <div style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid #10b981",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  color: "#065f46",
                  animation: "devScaleUp 0.3s ease"
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: "0 auto 12px auto" }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h4 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>Success!</h4>
                  <p style={{ fontSize: "13px" }}>{successMsg}</p>
                </div>
              ) : (
                <>
                  {/* Basic Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Product Name *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lavender Hydration Cleanser"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Tagline *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Refresh and balance skin pH"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Category *
                      </label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Nail Accessory">Accessory</option>
                        <option value="Hair">Hair</option>
                        <option value="Foot">Foot</option>
                        <option value="Bath">Bath</option>
                        <option value="Makeup">Makeup</option>
                        <option value="Bundle">Bundle</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Price (₹) *
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                      Description *
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Enter detailed description of the product formulations, textures, skin types target..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {/* Preset Selector */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                      Image Preset (Quick Select)
                    </label>
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      overflowX: "auto",
                      paddingBottom: "8px",
                      scrollbarWidth: "none"
                    }} className="dev-presets-track">
                      {imagePresets.map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => handlePresetSelect(preset.path)}
                          style={{
                            flex: "0 0 auto",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor: image === preset.path ? "var(--text-primary)" : "rgba(16, 34, 77, 0.04)",
                            color: image === preset.path ? "#ffffff" : "var(--text-primary)",
                            border: "1px solid rgba(16, 34, 77, 0.08)",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Image and Best Seller Option */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "end" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Product Image (Drag & Drop or Click)
                      </label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            processImageFile(file);
                          }
                        }}
                        onClick={() => document.getElementById("file-upload-input")?.click()}
                        style={{
                          width: "100%",
                          height: "90px",
                          borderRadius: "12px",
                          border: isDragging ? "2px dashed var(--accent-pink)" : "2px dashed rgba(16, 34, 77, 0.15)",
                          backgroundColor: isDragging ? "rgba(237, 116, 178, 0.04)" : "rgba(16, 34, 77, 0.02)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          textAlign: "center",
                          padding: "12px"
                        }}
                        className="dev-drag-dropzone"
                      >
                        <input 
                          type="file" 
                          id="file-upload-input"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) processImageFile(file);
                          }}
                          style={{ display: "none" }}
                        />
                        {image && image.startsWith("data:image/") ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* Small thumbnail preview */}
                            <Image 
                              src={image} 
                              alt="Preview" 
                              width={45}
                              height={45}
                              style={{ borderRadius: "6px", objectFit: "cover", border: "1px solid rgba(16, 34, 77, 0.1)" }}
                            />
                            <div style={{ textAlign: "left" }}>
                              <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>Custom Image Loaded</span>
                              <span style={{ fontSize: "9px", color: "var(--accent-pink)", fontWeight: "500" }}>Click to replace</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ marginBottom: "6px" }}>
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                              {isDragging ? "Drop your image here" : "Drag image here or click to browse"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", height: "90px", gap: "8px", paddingBottom: "10px" }}>
                      <input 
                        type="checkbox" 
                        id="isBestSeller"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      <label htmlFor="isBestSeller" style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer", userSelect: "none" }}>
                        Mark as Best Seller
                      </label>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Main Image Path
                      </label>
                      <input 
                        type="text" 
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                        Gallery Image Paths (comma separated)
                      </label>
                      <input 
                        type="text" 
                        value={imagesInput}
                        onChange={(e) => setImagesInput(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                      Ingredients (comma separated list)
                    </label>
                    <input 
                      type="text" 
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                      Benefits (comma separated list)
                    </label>
                    <input 
                      type="text" 
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    borderTop: "1px solid rgba(16, 34, 77, 0.06)",
                    paddingTop: "20px"
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to reset all products back to default hardcoded entries?")) {
                          resetProducts();
                          alert("Database reset to defaults.");
                          setIsOpen(false);
                        }
                      }}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fca5a5",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s"
                      }}
                      className="dev-reset-btn"
                    >
                      Reset Catalog
                    </button>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        style={{
                          padding: "10px 18px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          backgroundColor: "#f3f4f6",
                          color: "var(--text-primary)",
                          border: "1px solid rgba(16, 34, 77, 0.08)",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          backgroundColor: "var(--text-primary)",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.2s"
                        }}
                        className="dev-submit-btn"
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Injected Animations */}
      <style jsx global>{`
        @keyframes devPulse {
          0% { box-shadow: 0 8px 32px rgba(16, 34, 77, 0.2), 0 0 0 0px rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 8px 32px rgba(16, 34, 77, 0.25), 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 8px 32px rgba(16, 34, 77, 0.2), 0 0 0 0px rgba(16, 185, 129, 0); }
        }
        @keyframes devFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes devScaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .dev-floating-btn:hover {
          transform: translateY(-2px) scale(1.02);
          background-color: var(--accent-pink) !important;
        }
        .dev-presets-track::-webkit-scrollbar {
          display: none;
        }
        .dev-reset-btn:hover {
          background-color: #fca5a5 !important;
        }
        .dev-submit-btn:hover {
          background-color: var(--accent-pink) !important;
        }
      `}</style>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(16, 34, 77, 0.12)",
  outline: "none",
  fontSize: "13px",
  fontFamily: "var(--font-sans)",
  color: "var(--text-primary)",
  backgroundColor: "#ffffff",
  transition: "all 0.2s"
};
