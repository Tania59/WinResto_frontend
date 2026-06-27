// src/app/components/client/hooks/useCart.ts
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../../../data/mockData";
import type { CartItem } from "../types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("winstro_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // Ignorer
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("winstro_cart", JSON.stringify(cart));
  }, [cart]);

  const count = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((s, c) => s + c.item.price * c.qty, 0), [cart]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { item, qty: 1, note: "" }];
    });
    toast.success(`${item.name} ajouté`, {
      description: `${item.price} FCFA`,
      duration: 1800,
    });
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.item.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
        .filter(c => c.qty > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(c => c.item.id !== id));
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, note } : c));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("winstro_cart");
  }, []);

  return {
    cart,
    count,
    total,
    addToCart,
    updateQty,
    removeItem,
    updateNote,
    clearCart,
  };
}