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
    category: "Oils",
    price: 199,
    description: "Designed with a premium floral pattern, the 360 Floral Comb features wide-spaced teeth crafted to gently detangle thick, dense, and curly hair. Prevents hair breakage, distributes natural scalp oils evenly, and adds a luxury aesthetic to your vanity.",
    image: "/images/floral-comb2.png",
    images: [
      "/images/floral-comb2.png",
      "/images/floral-comb.png",
      "/images/floral-comb3.png",
      "/images/floral-comb4.png",
      "/images/floral-comb4.png",
    ],
    ingredients: ["Premium Cellulose Acetate", "Wide-teeth Detangling Layout", "Anti-static coating"],
    benefits: ["Gently detangles thick and curly hair", "Prevents breakage and hair loss", "Distributes natural oils evenly"]
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("mahqee_products");
      if (savedProducts) {
        try {
          return JSON.parse(savedProducts);
        } catch (e) {
          console.error("Failed to parse products", e);
        }
      }
    }
    return productsData;
  });

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

  const addProduct = (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem("mahqee_products", JSON.stringify(updated));
  };

  const resetProducts = () => {
    setProducts(productsData);
    localStorage.removeItem("mahqee_products");
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("mahqee_products", JSON.stringify(updated));
  };

  const updateProduct = (productId: string, updatedProduct: Product) => {
    const updated = products.map(p => p.id === productId ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem("mahqee_products", JSON.stringify(updated));
  };

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
