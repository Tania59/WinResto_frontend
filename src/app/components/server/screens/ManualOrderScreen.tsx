// src/app/components/server/screens/ManualOrderScreen.tsx
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Plus, Minus, Send } from "lucide-react";
import { formatPrice } from "../../../data/mockData";
import { CATEGORIES } from "../constants";
import type { MenuItem } from "../../../data/mockData";
import type { CartItem } from "../types";

interface ManualOrderScreenProps {
  tableNumber: number;
  cart: CartItem[];
  count: number;
  total: number;
  activeCategory: string;
  filteredMenu: MenuItem[];
  onSetCategory: (category: string) => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onSendOrder: () => void;
  onBack: () => void;
}

export function ManualOrderScreen({
  tableNumber,
  cart,
  count,
  total,
  activeCategory,
  filteredMenu,
  onSetCategory,
  onAddItem,
  onUpdateQty,
  onSendOrder,
  onBack,
}: ManualOrderScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors shrink-0"
          >
            <ChevronLeft size={18} className="sm:size-5 text-[#6B7280]" />
          </button>
          <div className="min-w-0">
            <h2 className="text-[#1F2937] text-sm sm:text-base truncate">Commande manuelle</h2>
            <p className="text-[#6B7280] text-[10px] sm:text-xs truncate">Table {tableNumber}</p>
          </div>
        </div>
        {count > 0 && (
          <span className="bg-[#D97706] text-white text-[10px] sm:text-sm px-2 sm:px-3 py-1 rounded-full shrink-0">
            {count} art. · {formatPrice(total)}
          </span>
        )}
      </header>

      <div className="flex gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto border-b border-[#E5E7EB] bg-white shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSetCategory(cat)}
            className={`whitespace-nowrap px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-sm shrink-0 transition-colors ${
              activeCategory === cat
                ? "bg-[#D97706] text-white"
                : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 pb-24">
        {filteredMenu.map((item, idx) => {
          const inCart = cart.find(c => c.item.id === item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="bg-white rounded-xl p-2 sm:p-3 border border-[#E5E7EB] flex items-center justify-between gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl shrink-0 bg-[#F3F4F6]"
                />
                <div className="min-w-0">
                  <p className="text-[#1F2937] text-xs sm:text-sm truncate">{item.name}</p>
                  <p className="text-[#D97706] text-[10px] sm:text-xs">{formatPrice(item.price)}</p>
                </div>
              </div>
              {inCart ? (
                <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-xl p-0.5 shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg shadow-sm flex items-center justify-center"
                  >
                    <Minus size={12} className="sm:size-[13px] text-[#6B7280]" />
                  </button>
                  <span className="text-[#1F2937] w-4 sm:w-5 text-center text-xs sm:text-sm">{inCart.qty}</span>
                  <button
                    onClick={() => onAddItem(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-[#D97706] rounded-lg flex items-center justify-center"
                  >
                    <Plus size={12} className="sm:size-[13px] text-white" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAddItem(item)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#D97706]/10 text-[#D97706] rounded-lg flex items-center justify-center hover:bg-[#D97706]/20 transition-colors shrink-0"
                >
                  <Plus size={14} className="sm:size-4" />
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-[#E5E7EB]"
          >
            <button
              onClick={onSendOrder}
              className="w-full bg-[#D97706] text-white py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F59E0B] transition-colors shadow-[0_4px_16px_rgba(217,119,6,0.3)] text-sm sm:text-base"
            >
              <Send size={16} className="sm:size-[18px]" /> Envoyer en cuisine — {formatPrice(total)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}