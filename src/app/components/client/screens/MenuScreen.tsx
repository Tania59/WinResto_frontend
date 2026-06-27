// src/app/components/client/screens/MenuScreen.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { menuItems, categories, formatPrice } from "../../../data/mockData";
import { MenuItemCard } from "../components/MenuItemCard";
import { RESTAURANT_NAME, DEFAULT_TABLE } from "../constants";
import type { MenuItem } from "../../../data/mockData";
import type { CartItem } from "../types";

interface MenuScreenProps {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onViewCart: () => void;
  onBack: () => void;
}

export function MenuScreen({
  cart,
  cartCount,
  cartTotal,
  onAddToCart,
  onUpdateQty,
  onViewCart,
  onBack,
}: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Tout");

  const filteredItems = activeCategory === "Tout"
    ? menuItems
    : menuItems.filter((i: MenuItem) => i.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <ChevronLeft size={20} className="text-[#6B7280]" />
          </button>
          <span className="text-[#1F2937] text-sm">🌴 {RESTAURANT_NAME}</span>
          <span className="bg-[#D97706]/15 text-[#D97706] px-2 py-0.5 rounded-full text-xs">
            Table {DEFAULT_TABLE}
          </span>
        </div>
        <motion.button
          onClick={onViewCart}
          animate={cartCount > 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative p-2 rounded-xl hover:bg-[#F3F4F6] transition-colors"
        >
          <ShoppingCart size={22} className="text-[#1F2937]" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 bg-[#D97706] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </header>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-[#E5E7EB] shrink-0">
        {categories.map((cat: string) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileTap={{ scale: 0.95 }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-[#D97706] text-white shadow-sm"
                : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-28">
        {filteredItems.map((item: MenuItem, i: number) => {
          const inCart = cart.find((c: CartItem) => c.item.id === item.id);
          return (
            <MenuItemCard
              key={item.id}
              item={item}
              inCart={inCart}
              onAdd={() => onAddToCart(item)}
              onUpdateQty={(delta: number) => onUpdateQty(item.id, delta)}
              index={i}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onViewCart}
              className="w-full bg-[#1F2937] text-white py-4 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-[#374151] transition-colors"
            >
              <span className="bg-[#D97706] px-2.5 py-0.5 rounded-lg text-sm">{cartCount}</span>
              <span>Voir mon panier</span>
              <span className="text-[#D97706]">{formatPrice(cartTotal)}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}