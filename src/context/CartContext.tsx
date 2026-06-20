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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const productsData: Product[] = [
  {
    id: "orchid-serum",
    name: "Vitamin C Serum",
    tagline: "Brightening & Anti-Aging",
    category: "Serums",
    price: 399,
    description: "A potent Vitamin C serum that brightens skin tone, reduces dark spots, and promotes collagen production for a youthful glow.",
    image: "/images/mahqee-vitamin-c.png",
    images: [
      "/images/mahqee-vitamin-c.png",
      "/images/vit_c_texture.png",
      "/images/vit_c_lifestyle.png"
    ],
    ingredients: ["Vitamin C (15%)", "Ferulic Acid", "Hyaluronic Acid"],
    benefits: ["Brightens overall skin tone", "Reduces hyperpigmentation", "Fights free radical damage"]
  },
  {
    id: "alchemists-oil",
    name: "Rose Water",
    tagline: "Hydrating & Soothing Toner",
    category: "Toners",
    price: 199,
    description: "Pure, distilled rose water to hydrate, refresh, and balance your skin's pH. Perfect for sensitive skin.",
    image: "/images/mahqee-rose-water.png",
    images: [
      "/images/mahqee-rose-water.png",
      "/images/rose_water_texture.png",
      "/images/rose_water_lifestyle.png"
    ],
    ingredients: ["100% Pure Rosa Damascena Extract"],
    benefits: ["Soothes redness and irritation", "Hydrates and refreshes", "Balances skin pH"]
  },
  {
    id: "cleansing-balm",
    name: "Salicylic Acid + LHA 02% Cleanser",
    tagline: "Acne, Breakouts & Oiliness",
    category: "Cleansers",
    price: 249,
    description: "A gentle yet effective daily cleanser formulated with Salicylic Acid and LHA to deeply cleanse, reduce excess sebum, and prevent acne breakouts without stripping the skin barrier.",
    image: "/images/mahqee-cleanser.png",
    images: [
      "/images/mahqee-cleanser.png",
      "/images/cleanser_texture.png",
      "/images/cleanser_lifestyle.png"
    ],
    ingredients: ["Salicylic Acid (2%)", "LHA (Capryloyl Salicylic Acid)", "Oat Extract", "Zinc PCA"],
    benefits: ["Reduces excess sebum and oiliness", "Deeply cleanses pores", "Prevents acne and breakouts"]
  },
  {
    id: "rose-hydrosol",
    name: "Retinol Night Cream",
    tagline: "Fine Lines & Wrinkles",
    category: "Creams",
    price: 499,
    description: "A rich night cream formulated with encapsulated Retinol to visibly reduce fine lines, wrinkles, and uneven texture while you sleep.",
    image: "/images/mahqee-retinol-cream.png",
    images: [
      "/images/mahqee-retinol-cream.png",
      "/images/category-bodycare.png",
      "/images/sunscreen.png"
    ],
    ingredients: ["Encapsulated Retinol (0.3%)", "Ceramides", "Peptides"],
    benefits: ["Reduces appearance of fine lines", "Improves skin elasticity", "Nourishes deeply overnight"]
  },
  {
    id: "jasmine-cream",
    name: "Vitamin B5 10% Moisturizer",
    tagline: "Damaged Barrier, Oily & Dehydrated",
    category: "Creams",
    price: 332,
    description: "A lightweight, oil-free moisturizer with 10% Vitamin B5 to nourish, heal, and repair damaged skin barriers while hydrating oily and dehydrated skin types.",
    image: "/images/moisturizer.png",
    images: [
      "/images/moisturizer.png",
      "/images/category-bodycare.png",
      "/images/cleanser.png"
    ],
    colors: [
      { name: "Clarity White", hex: "#ffffff", image: "/images/moisturizer.png" },
      { name: "Orchid Petal", hex: "#ed74b2", image: "/images/moisturizer.png" }
    ],
    ingredients: ["Vitamin B5 (Panthenol 10%)", "Copper PCA", "Zinc PCA", "Hyaluronic Acid"],
    benefits: ["Repairs damaged skin barrier", "Deeply hydrates without oiliness", "Calms and heals skin irritation"]
  },
  {
    id: "eye-nectar",
    name: "Luminous Eye Nectar",
    tagline: "Brighten and de-puff delicate eyes.",
    category: "Creams",
    price: 399,
    description: "A cooling, high-potency eye treatment featuring Caffeine and Vitamin C. With an ultra-smooth metal rollerball simulator design, it brightens dark circles, drains fluid retention, and firms eye contours.",
    image: "/images/serum.png",
    images: [
      "/images/serum.png",
      "/images/category-skincare.png",
      "/images/sunscreen.png"
    ],
    ingredients: ["Green Coffee Caffeine", "Vitamin C (Tetrahexyldecyl Ascorbate)", "Arnica Extract", "Coenzyme Q10"],
    benefits: ["Visibly reduces under-eye puffiness", "Brightens stubborn dark circles", "Smoothes fine lines around eyes"]
  }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
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
  }, []);

  // Save cart to local storage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("mahqee_cart", JSON.stringify(items));
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
        cartTotal
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
