// src/app/components/server/hooks/useManualOrder.ts
import { useState, useMemo, useCallback } from "react";
import { menuItems, formatPrice } from "../../../data/mockData";
import type { MenuItem } from "../../../data/mockData";
import type { CartItem } from "../types";

export function useManualOrder() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Tout");

  const count = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((s, c) => s + c.item.price * c.qty, 0), [cart]);

  const filteredMenu = useMemo(() => {
    const items = activeCategory === "Tout"
      ? menuItems
      : menuItems.filter(i => i.category === activeCategory);
    return items.filter(i => i.available);
  }, [activeCategory]);

  const addItem = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { item, qty: 1, note: "" }];
    });
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.item.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
        .filter(c => c.qty > 0)
    );
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, note } : c));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getOrderItems = useCallback(() => {
    return cart.map(({ item, qty, note }) => ({
      item: { id: item.id, name: item.name },
      qty,
      note,
    }));
  }, [cart]);

  return {
    cart,
    count,
    total,
    activeCategory,
    setActiveCategory,
    filteredMenu,
    addItem,
    updateQty,
    updateNote,
    clearCart,
    getOrderItems,
  };
}