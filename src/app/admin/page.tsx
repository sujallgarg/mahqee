"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart, Product } from "@/context/CartContext";

// Configuration: Set to true to completely disable the /admin page in production (returns a 404)
const BLOCK_IN_PRODUCTION = false;

export default function AdminPage() {
  const { products, addProduct, deleteProduct, updateProduct, resetProducts } = useCart();
  
  // Passcode authentication states
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");

  // Orders dashboard states
  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        setIsAuthorized(sessionStorage.getItem("mahqee_admin_authorized") === "true");
        
        const storedOrders = localStorage.getItem("mahqee_admin_orders");
        if (storedOrders) {
          try {
            setOrders(JSON.parse(storedOrders));
          } catch (e) {
            console.error("Failed to parse orders list in admin", e);
          }
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Poll orders queue from server
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchOrdersQueue = () => {
      fetch("/api/orders?admin_passcode=mahqee2026", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setOrders((prevOrders) => {
              const orderMap = new Map(prevOrders.map((o) => [o.orderNumber, o]));
              let changed = false;

              data.forEach((serverOrder) => {
                const existing = orderMap.get(serverOrder.orderNumber);
                if (!existing) {
                  orderMap.set(serverOrder.orderNumber, serverOrder);
                  changed = true;
                } else {
                  const merged = { ...existing, ...serverOrder };
                  if (JSON.stringify(existing) !== JSON.stringify(merged)) {
                    orderMap.set(serverOrder.orderNumber, merged);
                    changed = true;
                  }
                }
              });

              if (changed || prevOrders.length !== orderMap.size) {
                const mergedList = Array.from(orderMap.values());
                // Sort by date descending (newest first)
                mergedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                localStorage.setItem("mahqee_admin_orders", JSON.stringify(mergedList));
                return mergedList;
              }
              return prevOrders;
            });
          }
        })
        .catch(err => {
          console.warn("Could not sync orders from server API inside admin", err);
        });
    };

    fetchOrdersQueue();
    const interval = setInterval(fetchOrdersQueue, 5000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const handleUpdateOrderStatus = (orderNumber: string, newStatus: "processing" | "verified" | "failed") => {
    const updatedOrders = orders.map((o) => {
      if (o.orderNumber === orderNumber) {
        return { ...o, paymentStatus: newStatus };
      }
      return o;
    });
    setOrders(updatedOrders);
    localStorage.setItem("mahqee_admin_orders", JSON.stringify(updatedOrders));

    const storedLastOrder = localStorage.getItem("mahqee_last_order");
    if (storedLastOrder) {
      try {
        const lastOrder = JSON.parse(storedLastOrder);
        if (lastOrder.orderNumber === orderNumber) {
          lastOrder.paymentStatus = newStatus;
          localStorage.setItem("mahqee_last_order", JSON.stringify(lastOrder));
        }
      } catch (e) {
        console.error("Failed to update last order status in admin", e);
      }
    }

    // Persist change on shared server database
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        paymentStatus: newStatus
      })
    })
    .catch(err => {
      console.error("Failed to persist order verification status on server", err);
    });
  };

  const handleUpdateDeliveryStatus = (orderNumber: string, newDeliveryStatus: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.orderNumber === orderNumber) {
        return { ...o, deliveryStatus: newDeliveryStatus };
      }
      return o;
    });
    setOrders(updatedOrders);
    localStorage.setItem("mahqee_admin_orders", JSON.stringify(updatedOrders));

    const storedLastOrder = localStorage.getItem("mahqee_last_order");
    if (storedLastOrder) {
      try {
        const lastOrder = JSON.parse(storedLastOrder);
        if (lastOrder.orderNumber === orderNumber) {
          lastOrder.deliveryStatus = newDeliveryStatus;
          localStorage.setItem("mahqee_last_order", JSON.stringify(lastOrder));
        }
      } catch (e) {
        console.error("Failed to update last order status in admin", e);
      }
    }

    // Persist change on shared server database
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        deliveryStatus: newDeliveryStatus
      })
    })
    .catch(err => {
      console.error("Failed to persist delivery status on server", err);
    });
  };

  // Admin form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Nail Accessory");
  const [price, setPrice] = useState("299");
  const [description, setDescription] = useState("");
  
  // Custom states for list items
  const [images, setImages] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isLovedByMahqee, setIsLovedByMahqee] = useState(false);

  // UI inputs helper states
  const [newIngredient, setNewIngredient] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // If configuration is active, completely block route in production
  if (BLOCK_IN_PRODUCTION && process.env.NODE_ENV === "production") {
    return notFound();
  }

  // Prevent hydration mismatches by rendering null until mounted on client
  if (!isMounted) {
    return null;
  }

  if (!isAuthorized) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (passcode === "mahqee2026") {
        sessionStorage.setItem("mahqee_admin_authorized", "true");
        setIsAuthorized(true);
      } else {
        setPasscodeError("Invalid administration passcode.");
      }
    };

    return (
      <main style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-primary)",
        padding: "24px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1px solid var(--border-color)",
          padding: "40px 32px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--accent-pink)", letterSpacing: "1.5px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
            MAHQEE Security Portal
          </span>
          <h1 style={{ fontSize: "28px", color: "var(--text-primary)", fontFamily: "var(--font-serif)", marginBottom: "12px" }}>
            Admin Login
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px", lineHeight: "1.5" }}>
            Enter your administration security credentials to gain full access to catalog controls.
          </p>

          <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <input
                type="password"
                placeholder="Enter administration passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError("");
                }}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: passcodeError ? "1.5px solid #ef4444" : "1px solid rgba(16, 34, 77, 0.12)",
                  outline: "none",
                  fontSize: "14px",
                  textAlign: "center",
                  color: "var(--text-primary)",
                  backgroundColor: "#ffffff"
                }}
              />
              {passcodeError && (
                <span style={{ fontSize: "11px", color: "#ef4444", display: "block", marginTop: "6px", fontWeight: "500" }}>
                  {passcodeError}
                </span>
              )}
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "var(--text-primary)",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "var(--transition-fast)"
              }}
              className="dev-submit-btn"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  const imagePresets = [
    { label: "Serum Bottle", path: "/images/serum.png" },
    { label: "Moisturizer Tube", path: "/images/moisturizer.png" },
    { label: "Cleanser", path: "/images/cleanser.png" },
    { label: "Sunscreen", path: "/images/sunscreen.png" },
    { label: "Floral Comb", path: "/images/floral-comb.png" },
    { label: "Floral Comb 2", path: "/images/floral-comb2.png" },
    { label: "MAHQEE Cleanser", path: "/images/mahqee-cleanser.png" },
    { label: "MAHQEE Retinol Cream", path: "/images/mahqee-retinol-cream.png" },
    { label: "MAHQEE Rose Water", path: "/images/mahqee-rose-water.png" },
    { label: "MAHQEE Vitamin C", path: "/images/mahqee-vitamin-c.png" }
  ];

  // Drag and drop multiple image processing
  const handleMultipleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImages((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetImage = (presetPath: string) => {
    if (!images.includes(presetPath)) {
      setImages((prev) => [...prev, presetPath]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddIngredient = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    if (e.type === "keydown") e.preventDefault();
    
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients((prev) => [...prev, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddBenefit = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    if (e.type === "keydown") e.preventDefault();
    
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits((prev) => [...prev, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (indexToRemove: number) => {
    setBenefits((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Populate form for editing
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setTagline(product.tagline);
    setCategory(product.category);
    setPrice(product.price.toString());
    setDescription(product.description);
    setImages(product.images || [product.image]);
    setIngredients(product.ingredients || []);
    setBenefits(product.benefits || []);
    setIsBestSeller(!!product.isBestSeller);
    setIsLovedByMahqee(!!product.isLovedByMahqee);
    
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setTagline("");
    setCategory("Nail Accessory");
    setPrice("299");
    setDescription("");
    setImages([]);
    setIngredients([]);
    setBenefits([]);
    setIsBestSeller(false);
    setIsLovedByMahqee(false);
  };

  const handleDeleteClick = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProduct(productId);
      if (editingId === productId) {
        handleCancelEdit();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline || !description || !price || images.length === 0) {
      alert("Please fill out all required fields and upload at least one image.");
      return;
    }

    const priceNum = parseFloat(price) || 0;
    
    if (isLovedByMahqee) {
      const currentLovedCount = products.filter(p => p.isLovedByMahqee && p.id !== editingId).length;
      if (currentLovedCount >= 6) {
        alert("You can select a maximum of 6 products for the 'Loved by the MAHQEE'S' section. Please uncheck another product first.");
        return;
      }
    }
    
    if (editingId) {
      // Editing existing product
      const updatedProduct: Product = {
        id: editingId,
        name,
        tagline,
        category,
        price: priceNum,
        description,
        image: images[0],
        images: images,
        ingredients,
        benefits,
        isBestSeller,
        isLovedByMahqee
      };
      
      updateProduct(editingId, updatedProduct);
      setSuccessMsg(`"${name}" updated successfully!`);
      setTimeout(() => {
        setSuccessMsg("");
        handleCancelEdit();
      }, 2000);
    } else {
      // Creating new product
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      if (products.some(p => p.id === id)) {
        alert(`A product with ID "${id}" already exists. Please choose a different name.`);
        return;
      }

      const newProduct: Product = {
        id,
        name,
        tagline,
        category,
        price: priceNum,
        description,
        image: images[0],
        images: images,
        ingredients,
        benefits,
        isBestSeller,
        isLovedByMahqee
      };

      addProduct(newProduct);
      setSuccessMsg(`"${name}" added successfully!`);
      setTimeout(() => {
        setSuccessMsg("");
        handleCancelEdit();
      }, 2000);
    }
  };

  // Stats computation
  const totalProducts = products.length;
  const bestSellersCount = products.filter((p) => p.isBestSeller).length;
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).length;

  return (
    <main style={{
      minHeight: "100vh",
      padding: "160px 24px 120px 24px",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Header Block */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "24px",
          flexWrap: "wrap",
          gap: "24px"
        }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--accent-pink)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              MAHQEE Control Center
            </span>
            <div style={{ display: "flex", gap: "24px", marginTop: "12px", alignItems: "center" }}>
              <button 
                onClick={() => setActiveTab("catalog")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 8px 0",
                  cursor: "pointer",
                  fontSize: "28px",
                  fontFamily: "var(--font-serif)",
                  color: activeTab === "catalog" ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: activeTab === "catalog" ? "2px solid var(--accent-pink)" : "2px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                Catalog Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 8px 0",
                  cursor: "pointer",
                  fontSize: "28px",
                  fontFamily: "var(--font-serif)",
                  color: activeTab === "orders" ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: activeTab === "orders" ? "2px solid var(--accent-pink)" : "2px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                Orders Management
              </button>
            </div>
          </div>
          {process.env.NODE_ENV !== "production" && (
            activeTab === "catalog" ? (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset all products back to default hardcoded entries?")) {
                    resetProducts();
                    handleCancelEdit();
                    alert("Catalog database reset to defaults.");
                  }
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fca5a5",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "var(--transition-fast)"
                }}
                className="dev-reset-btn"
              >
                Reset Database
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear the entire order history database?")) {
                    localStorage.removeItem("mahqee_admin_orders");
                    localStorage.removeItem("mahqee_last_order");
                    setOrders([]);
                    fetch("/api/orders?clear=true", { method: "DELETE" })
                      .then(() => alert("Orders database cleared."))
                      .catch(err => console.error("Failed to clear orders database on server", err));
                  }
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fca5a5",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "var(--transition-fast)"
                }}
                className="dev-reset-btn"
              >
                Clear Orders Database
              </button>
            )
          )}
        </div>

        {activeTab === "catalog" && (
          <>
            {/* Summary Stats Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "48px"
            }}>
              <div style={statCardStyle}>
                <span style={statLabelStyle}>Total Formulations</span>
                <span style={statNumberStyle}>{totalProducts}</span>
              </div>
              <div style={statCardStyle}>
                <span style={statLabelStyle}>Curated Best Sellers</span>
                <span style={statNumberStyle}>{bestSellersCount}</span>
              </div>
              <div style={statCardStyle}>
                <span style={statLabelStyle}>Active Categories</span>
                <span style={statNumberStyle}>{uniqueCategories}</span>
              </div>
            </div>

            {/* Dashboard Panels */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "48px",
              alignItems: "start"
            }} className="admin-panels-grid">
          
          {/* 1. Form Panel */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid var(--border-color)",
            padding: "36px",
            boxShadow: "var(--shadow-sm)"
          }}>
            <h2 style={{
              fontSize: "20px",
              color: "var(--text-primary)",
              marginBottom: "24px",
              fontFamily: "var(--font-serif)",
              borderBottom: "1px solid rgba(16, 34, 77, 0.05)",
              paddingBottom: "12px"
            }}>
              {editingId ? `Edit Formulation: ${name}` : "Create New Formulation"}
            </h2>

            {successMsg ? (
              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid #10b981",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                color: "#065f46",
                marginBottom: "24px"
              }}>
                <h4 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>Completed</h4>
                <p style={{ fontSize: "13px" }}>{successMsg}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hydrating Rose Toner"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tagline *</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Refresh and balance skin barrier"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Nail Accessory">Nail Accessory</option>
                    <option value="Hair">Hair</option>
                    <option value="Foot">Foot</option>
                    <option value="Bath">Bath</option>
                    <option value="Makeup">Makeup</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Detailed Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Formulation specifications, tactile texture profiles, skin concern applications..."
                  required
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              {/* Gallery Section */}
              <div style={{ border: "1px solid rgba(16, 34, 77, 0.08)", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                  Formulation Gallery Images (Slideshow)*
                </h3>

                {/* Preset List */}
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Select Preset Assets:
                  </span>
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
                    {imagePresets.map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => handleAddPresetImage(preset.path)}
                        style={{
                          flex: "0 0 auto",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          backgroundColor: images.includes(preset.path) ? "var(--text-primary)" : "rgba(16, 34, 77, 0.04)",
                          color: images.includes(preset.path) ? "#ffffff" : "var(--text-primary)",
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

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleMultipleImageUpload(e.dataTransfer.files);
                  }}
                  onClick={() => document.getElementById("admin-files-input")?.click()}
                  style={{
                    width: "100%",
                    height: "100px",
                    borderRadius: "12px",
                    border: isDragging ? "2px dashed var(--accent-pink)" : "2px dashed rgba(16, 34, 77, 0.15)",
                    backgroundColor: isDragging ? "rgba(237, 116, 178, 0.04)" : "rgba(16, 34, 77, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "16px"
                  }}
                >
                  <input
                    type="file"
                    id="admin-files-input"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleMultipleImageUpload(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ marginBottom: "6px" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
                    {isDragging ? "Drop images here" : "Drag multiple images here, or click to upload"}
                  </span>
                </div>

                {/* Uploaded Gallery Previews */}
                {images.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" }}>
                    {images.map((imgSrc, idx) => (
                      <div key={idx} style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid rgba(16, 34, 77, 0.08)"
                      }}>
                        <Image
                          src={imgSrc}
                          alt="Gallery item preview"
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "rgba(153, 27, 27, 0.85)",
                            color: "#ffffff",
                            border: "none",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            cursor: "pointer",
                            lineHeight: 1
                          }}
                          title="Remove image"
                        >
                          &times;
                        </button>
                        <span style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          color: "#ffffff",
                          fontSize: "8.5px",
                          textAlign: "center",
                          padding: "2px 0"
                        }}>
                          {idx === 0 ? "Main" : `Slide ${idx}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--accent-pink)", fontStyle: "italic" }}>
                    No images added. Main product slide is required.
                  </span>
                )}
              </div>

              {/* Ingredients & Benefits Tag Editors */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                {/* Ingredients */}
                <div style={{ border: "1px solid rgba(16, 34, 77, 0.08)", borderRadius: "16px", padding: "16px" }}>
                  <label style={labelStyle}>Formulation Ingredients</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="text"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyDown={handleAddIngredient}
                      placeholder="e.g. Squalane"
                      style={{ ...inputStyle, padding: "8px 12px" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      style={{
                        padding: "0 12px",
                        backgroundColor: "var(--text-primary)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ingredients.map((ing, idx) => (
                      <span key={idx} style={tagStyle}>
                        {ing}
                        <button type="button" onClick={() => handleRemoveIngredient(idx)} style={tagCloseBtnStyle}>&times;</button>
                      </span>
                    ))}
                    {ingredients.length === 0 && <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>No ingredients defined</span>}
                  </div>
                </div>

                {/* Benefits */}
                <div style={{ border: "1px solid rgba(16, 34, 77, 0.08)", borderRadius: "16px", padding: "16px" }}>
                  <label style={labelStyle}>Product Benefits</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyDown={handleAddBenefit}
                      placeholder="e.g. Repairs moisture barrier"
                      style={{ ...inputStyle, padding: "8px 12px" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      style={{
                        padding: "0 12px",
                        backgroundColor: "var(--text-primary)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {benefits.map((ben, idx) => (
                      <span key={idx} style={tagStyle}>
                        {ben}
                        <button type="button" onClick={() => handleRemoveBenefit(idx)} style={tagCloseBtnStyle}>&times;</button>
                      </span>
                    ))}
                    {benefits.length === 0 && <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>No benefits defined</span>}
                  </div>
                </div>
              </div>

              {/* Checkboxes Row */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Best Seller Checkbox */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="adminBestSeller"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="adminBestSeller" style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    userSelect: "none"
                  }}>
                    Mark formulation as a curated Best Seller
                  </label>
                </div>

                {/* Loved by MAHQEE Checkbox */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="adminLovedByMahqee"
                    checked={isLovedByMahqee}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        const currentLovedCount = products.filter(p => p.isLovedByMahqee && p.id !== editingId).length;
                        if (currentLovedCount >= 6) {
                          alert("You can select a maximum of 6 products for the 'Loved by the MAHQEE'S' section. Please uncheck another product first.");
                          return;
                        }
                      }
                      setIsLovedByMahqee(checked);
                    }}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="adminLovedByMahqee" style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    userSelect: "none"
                  }}>
                    Add to &quot;Loved by the MAHQEE&apos;S&quot; Section
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                borderTop: "1px solid rgba(16, 34, 77, 0.05)",
                paddingTop: "24px"
              }}>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      backgroundColor: "#f3f4f6",
                      color: "var(--text-primary)",
                      border: "1px solid rgba(16, 34, 77, 0.08)",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "10px 30px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    backgroundColor: "var(--text-primary)",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "var(--transition-fast)"
                  }}
                  className="dev-submit-btn"
                >
                  {editingId ? "Save Changes" : "Create Formulation"}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Product Directory Panel */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid var(--border-color)",
            padding: "36px",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden"
          }}>
            <h2 style={{
              fontSize: "20px",
              color: "var(--text-primary)",
              marginBottom: "24px",
              fontFamily: "var(--font-serif)",
              borderBottom: "1px solid rgba(16, 34, 77, 0.05)",
              paddingBottom: "12px"
            }}>
              Active Formulations Directory ({products.length})
            </h2>

            {products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  No active products found in the catalog database. Add a product above.
                </span>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      <th style={{ padding: "12px 16px" }}>Visual</th>
                      <th style={{ padding: "12px 16px" }}>Product Name & Tag</th>
                      <th style={{ padding: "12px 16px" }}>Category</th>
                      <th style={{ padding: "12px 16px" }}>Price</th>
                      <th style={{ padding: "12px 16px" }}>Best Seller</th>
                      <th style={{ padding: "12px 16px" }}>Loved By MAHQEE</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: "1px solid rgba(16, 34, 77, 0.06)", fontSize: "13.5px", transition: "background-color 0.2s" }} className="admin-table-row">
                        <td style={{ padding: "16px" }}>
                          <div style={{
                            position: "relative",
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#eaeae8",
                            border: "1px solid rgba(16, 34, 77, 0.05)"
                          }}>
                            {prod.image && (prod.image.startsWith("/images/") || prod.image.startsWith("data:image/")) ? (
                              <Image
                                src={prod.image}
                                alt={prod.name}
                                fill
                                sizes="50px"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "10px", color: "var(--text-secondary)" }}>
                                Graph
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{prod.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{prod.tagline}</div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "99px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor: "rgba(16, 34, 77, 0.05)",
                            color: "var(--text-primary)"
                          }}>
                            {prod.category}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
                          ₹{prod.price}.00
                        </td>
                        <td style={{ padding: "16px" }}>
                          {prod.isBestSeller ? (
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: "600",
                              backgroundColor: "rgba(237, 116, 178, 0.12)",
                              color: "var(--accent-pink)",
                              textTransform: "uppercase"
                            }}>
                              Yes
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {prod.isLovedByMahqee ? (
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: "600",
                              backgroundColor: "rgba(16, 34, 77, 0.12)",
                              color: "var(--text-primary)",
                              textTransform: "uppercase"
                            }}>
                              Yes
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: "16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => handleEditClick(prod)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "#ffffff",
                                color: "var(--text-primary)",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "all 0.2s"
                              }}
                              className="admin-edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(prod.id, prod.name)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #fca5a5",
                                backgroundColor: "#ffffff",
                                color: "#991b1b",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "all 0.2s"
                              }}
                              className="admin-delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {/* Orders Dashboard */}
        {activeTab === "orders" && (
          <>
            {/* Orders Summary Stats Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              marginBottom: "48px"
            }}>
              <div style={statCardStyle}>
                <span style={statLabelStyle}>Total Orders</span>
                <span style={statNumberStyle}>{orders.length}</span>
              </div>
              <div style={{ ...statCardStyle, borderLeft: "4px solid #d97706" }}>
                <span style={statLabelStyle}>Awaiting Verification</span>
                <span style={{ ...statNumberStyle, color: "#d97706" }}>
                  {orders.filter(o => !o.paymentStatus || o.paymentStatus === 'processing').length}
                </span>
              </div>
              <div style={{ ...statCardStyle, borderLeft: "4px solid #16a34a" }}>
                <span style={statLabelStyle}>Verified Successful</span>
                <span style={{ ...statNumberStyle, color: "#16a34a" }}>
                  {orders.filter(o => o.paymentStatus === 'verified').length}
                </span>
              </div>
              <div style={{ ...statCardStyle, borderLeft: "4px solid #dc2626" }}>
                <span style={statLabelStyle}>Failed / Hold</span>
                <span style={{ ...statNumberStyle, color: "#dc2626" }}>
                  {orders.filter(o => o.paymentStatus === 'failed').length}
                </span>
              </div>
            </div>

            {/* Orders Panel */}
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              border: "1px solid var(--border-color)",
              padding: "36px",
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden"
            }}>
              <h2 style={{
                fontSize: "20px",
                color: "var(--text-primary)",
                marginBottom: "24px",
                fontFamily: "var(--font-serif)",
                borderBottom: "1px solid rgba(16, 34, 77, 0.05)",
                paddingBottom: "12px"
              }}>
                Paytm Payments Verification Queue ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                    No orders registered on the system yet.
                  </span>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1.5px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        <th style={{ padding: "12px 16px" }}>Order Info</th>
                        <th style={{ padding: "12px 16px" }}>Customer Details</th>
                        <th style={{ padding: "12px 16px" }}>Order Items</th>
                        <th style={{ padding: "12px 16px" }}>Total Amount</th>
                        <th style={{ padding: "12px 16px" }}>Paytm Status</th>
                        <th style={{ padding: "12px 16px" }}>Delivery Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Agent Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => {
                        const status = ord.paymentStatus || "processing";
                        return (
                          <tr key={ord.orderNumber} style={{ borderBottom: "1px solid rgba(16, 34, 77, 0.06)", fontSize: "13.5px", verticalAlign: "top" }} className="admin-table-row">
                            {/* Order Info */}
                            <td style={{ padding: "16px" }}>
                              <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{ord.orderNumber}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                                {new Date(ord.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </div>
                            </td>
                            {/* Customer Details */}
                            <td style={{ padding: "16px", maxWidth: "220px" }}>
                              <div style={{ fontWeight: "600" }}>{ord.customer?.name}</div>
                              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{ord.customer?.phone}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.3" }}>{ord.customer?.address}, {ord.customer?.pincode}</div>
                            </td>
                            {/* Order Items */}
                            <td style={{ padding: "16px", fontSize: "12px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {ord.items?.map((it: any, i: number) => (
                                  <div key={i}>
                                    • {it.quantity}x {it.name} {it.color ? `(${it.color})` : ""}
                                  </div>
                                ))}
                              </div>
                            </td>
                            {/* Total */}
                            <td style={{ padding: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
                              ₹{ord.grandTotal?.toLocaleString("en-IN")}.00
                            </td>
                            {/* Status */}
                            <td style={{ padding: "16px" }}>
                              {status === "verified" && (
                                <span style={{ fontSize: "11px", color: "#16a34a", backgroundColor: "rgba(22, 163, 74, 0.1)", padding: "4px 10px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                                  ✓ Verified
                                </span>
                              )}
                              {status === "failed" && (
                                <span style={{ fontSize: "11px", color: "#dc2626", backgroundColor: "rgba(220, 38, 38, 0.1)", padding: "4px 10px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                                  ❌ Failed
                                </span>
                              )}
                              {status === "processing" && (
                                <span style={{ fontSize: "11px", color: "#d97706", backgroundColor: "rgba(217, 119, 6, 0.1)", padding: "4px 10px", borderRadius: "99px", textTransform: "uppercase", fontWeight: "600" }}>
                                  ⏳ Processing
                                </span>
                              )}
                            </td>
                            {/* Delivery Status Select dropdown */}
                            <td style={{ padding: "16px" }}>
                              <select
                                value={ord.deliveryStatus || "placed"}
                                onChange={(e) => handleUpdateDeliveryStatus(ord.orderNumber, e.target.value)}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid var(--border-color)",
                                  backgroundColor: "#ffffff",
                                  fontSize: "12px",
                                  color: "var(--text-primary)",
                                  outline: "none",
                                  cursor: "pointer"
                                }}
                              >
                                <option value="placed">Placed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                            {/* Action Buttons */}
                            <td style={{ padding: "16px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.orderNumber, "verified")}
                                  disabled={status === "verified"}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: status === "verified" ? "#e5e7eb" : "#2e7d32",
                                    color: status === "verified" ? "#9ca3af" : "#ffffff",
                                    fontSize: "11px",
                                    cursor: status === "verified" ? "not-allowed" : "pointer",
                                    fontWeight: "600",
                                    transition: "opacity 0.2s"
                                  }}
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.orderNumber, "failed")}
                                  disabled={status === "failed"}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: status === "failed" ? "#e5e7eb" : "#dc2626",
                                    color: status === "failed" ? "#9ca3af" : "#ffffff",
                                    fontSize: "11px",
                                    cursor: status === "failed" ? "not-allowed" : "pointer",
                                    fontWeight: "600",
                                    transition: "opacity 0.2s"
                                  }}
                                >
                                  Reject
                                </button>
                                {status !== "processing" && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.orderNumber, "processing")}
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "6px",
                                      border: "1px solid var(--border-color)",
                                      backgroundColor: "#ffffff",
                                      color: "var(--text-primary)",
                                      fontSize: "11px",
                                      cursor: "pointer",
                                      fontWeight: "600"
                                    }}
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      <style jsx global>{`
        .admin-table-row:hover {
          background-color: rgba(16, 34, 77, 0.01);
        }
        .admin-edit-btn:hover {
          background-color: var(--text-primary) !important;
          color: #ffffff !important;
        }
        .admin-delete-btn:hover {
          background-color: #fee2e2 !important;
        }
      `}</style>
    </main>
  );
}

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid var(--border-color)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "var(--shadow-sm)",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const statNumberStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "var(--text-primary)"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--text-primary)",
  marginBottom: "6px"
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  backgroundColor: "rgba(16, 34, 77, 0.04)",
  color: "var(--text-primary)",
  fontSize: "11px",
  fontWeight: "500",
  padding: "4px 8px 4px 10px",
  borderRadius: "6px",
  border: "1px solid rgba(16, 34, 77, 0.05)"
};

const tagCloseBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontSize: "12px",
  lineHeight: 1,
  padding: 0
};

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
