"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images: string[]; // for detail modal gallery
  colors?: { name: string; hex: string; image: string }[]; // dynamic options (like Apple watch bands/phones)
  ingredients: string[];
  benefits: string[];
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: { name: string; hex: string };
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; hex: string }) => void;
  removeFromCart: (productId: string, colorName?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorName?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updatedProduct: Product) => void;
  resetProducts: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const productsData: Product[] = [
  {
    id: "floral-comb",
    name: "Floral Comb",
    tagline: "Extra Width for Dense Hair",
    category: "Hair",
    price: 199,
    description: "Designed with a premium floral pattern, the 360 Floral Comb features wide-spaced teeth crafted to gently detangle thick, dense, and curly hair. Prevents hair breakage, distributes natural scalp oils evenly, and adds a luxury aesthetic to your vanity.",
    image: "/images/floracombmain.png",
    images: [
      "/images/floracombmain.png",
      "/images/floral-comb.png",
      "/images/floral-comb3.png",
      "/images/floral-comb4.png",
      "/images/floral-comb4.png"
    ],
    ingredients: ["Premium Cellulose Acetate", "Wide-teeth Detangling Layout", "Anti-static coating"],
    benefits: ["Gently detangles thick and curly hair", "Prevents breakage and hair loss", "Distributes natural oils evenly"]
  },
  {
    id: "premium-eyelash-curler",
    name: "Premium Eyelash Curler",
    tagline: "Miracle of Beauty — Effortless Curl, Perfect Definition.",
    category: "Makeup",
    price: 299,
    description: "\"Achieve beautifully lifted, high-definition curls with the MAHQUEE Premium Eyelash Curler. Designed with an ergonomic grip for steady control, it features a smooth mechanism that applies even pressure without pinching or pulling your lashes. Perfect for all eye shapes to instantly open up and brighten your look before mascara application.\"",
    image: "/images/eyelash-curler.png",
    images: [
      "/images/eyelash-curler.png",
      "/images/premium-eyelash-curler-gallery-1.png",
      "/images/premium-eyelash-curler-gallery-2.png"
    ],
    ingredients: [],
    benefits: [],
    isBestSeller: true
  },
  {
    id: "blackhead-blemish-remover-tool",
    name: "Blackhead & Blemish Remover Tool",
    tagline: "Flawless Skin, Effortlessly — India's No.1 Quality Extraction Tool.",
    category: "Makeup",
    price: 149,
    description: "\"Achieve a clearer, blemish-free complexion with the MAHQEE Professional Blackhead Remover. This premium 12 cm stainless steel tool features a dual-sided design tailored for precision: a small spoon end for smooth extraction and an anti-loop tip for targeting stubborn blackheads and whiteheads. Designed with an anti-slip textured handle for maximum grip and steady control, it ensures safe, hygienic skin clearing at home without damaging surrounding tissue.\"",
    image: "/images/blackhead-blemish-remover-tool-main.png",
    images: [
      "/images/blackhead-blemish-remover-tool-gallery-0.png",
      "/images/blackhead-blemish-remover-tool-gallery-1.png",
      "/images/blackhead-blemish-remover-tool-gallery-2.jpg",
      "/images/blackhead-blemish-remover-tool-gallery-3.png",
      "/images/blackhead-blemish-remover-tool-gallery-4.png",
      "/images/blackhead-blemish-remover-tool-gallery-5.png"
    ],
    ingredients: [],
    benefits: [],
    isBestSeller: true
  }
];


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(productsData);

  // Safe wrapper functions to prevent crashes if Base64 images cause localStorage quota to be exceeded
  const safeSaveProducts = (data: Product[]) => {
    try {
      const optimizedData = data.map(product => {
        const hasBase64 = product.image && product.image.startsWith("data:image/");
        const optimizedImages = product.images?.map(img => img.startsWith("data:image/") ? "" : img) || [];
        return {
          ...product,
          image: hasBase64 ? "" : product.image,
          images: optimizedImages
        };
      });
      localStorage.setItem("mahqee_products", JSON.stringify(optimizedData));
    } catch (e) {
      console.warn("Failed to write products to localStorage cache (quota exceeded)", e);
    }
  };

  const safeSaveCart = (items: CartItem[]) => {
    try {
      const optimizedItems = items.map(item => {
        const hasBase64 = item.product.image && item.product.image.startsWith("data:image/");
        const optimizedImages = item.product.images?.map(img => img.startsWith("data:image/") ? "" : img) || [];
        return {
          ...item,
          product: {
            ...item.product,
            image: hasBase64 ? "" : item.product.image,
            images: optimizedImages
          }
        };
      });
      localStorage.setItem("mahqee_cart", JSON.stringify(optimizedItems));
    } catch (e) {
      console.warn("Failed to write cart to localStorage cache (quota exceeded)", e);
    }
  };

  // Load cart and fetch products from database API on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mahqee_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setTimeout(() => {
          setCartItems(parsed);
        }, 0);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }

    // Load from localStorage cache immediately on mount to be fast and hydration-safe
    const savedProducts = localStorage.getItem("mahqee_products");
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setTimeout(() => {
          setProducts(parsedProducts);
        }, 0);
      } catch (e) {
        console.error("Failed to parse cached products", e);
      }
    }

    // Fetch dynamic products from file-based server database API
    const fetchProducts = () => {
      fetch("/api/products", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("API failed");
          return res.json();
        })
        .then((data) => {
          setProducts(data);
          safeSaveProducts(data);
        })
        .catch((err) => {
          console.warn("Could not load products from Server API, using local storage cache fallback", err);
        });
    };

    fetchProducts();

    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, []);

  const addProduct = async (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    safeSaveProducts(updated);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to persist product add on server", e);
    }
  };

  const resetProducts = async () => {
    setProducts(productsData);
    localStorage.removeItem("mahqee_products");

    try {
      const res = await fetch("/api/products?reset=true", {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to persist catalog reset on server", e);
    }
  };

  const deleteProduct = async (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    safeSaveProducts(updated);

    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to persist product deletion on server", e);
    }
  };

  const updateProduct = async (productId: string, updatedProduct: Product) => {
    const updated = products.map(p => p.id === productId ? updatedProduct : p);
    setProducts(updated);
    safeSaveProducts(updated);

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to persist product edits on server", e);
    }
  };

  // Save cart to local storage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    safeSaveCart(items);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity = 1, selectedColor?: { name: string; hex: string }) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        (!selectedColor || item.selectedColor?.name === selectedColor.name)
    );

    if (existingIndex > -1) {
      const newItems = [...cartItems];
      newItems[existingIndex].quantity += quantity;
      saveCart(newItems);
    } else {
      saveCart([...cartItems, { product, quantity, selectedColor }]);
    }
    openCart(); // Open cart to show added item
  };

  const removeFromCart = (productId: string, colorName?: string) => {
    const newItems = cartItems.filter(
      (item) => !(item.product.id === productId && (!colorName || item.selectedColor?.name === colorName))
    );
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number, colorName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }
    const newItems = cartItems.map((item) => {
      if (item.product.id === productId && (!colorName || item.selectedColor?.name === colorName)) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        resetProducts
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
