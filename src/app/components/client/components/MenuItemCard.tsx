// src/app/components/client/components/MenuItemCard.tsx
import { motion } from "motion/react";
import { Plus, Minus, Sparkles } from "lucide-react";
import { formatPrice } from "../../../data/mockData";
import { BadgePill } from "./BadgePill";
import type { MenuItem } from "../../../data/mockData";

interface MenuItemCardProps {
  item: MenuItem;
  inCart?: { qty: number } | undefined;
  onAdd: () => void;
  onUpdateQty: (delta: number) => void;
  index: number;
}

export function MenuItemCard({ item, inCart, onAdd, onUpdateQty, index }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${
        !item.available ? "opacity-60" : ""
      }`}
    >
      <div className="relative">
        <img src={item.photo} alt={item.name} className="w-full h-44 object-cover bg-[#F3F4F6]" />
        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-[#6B7280] px-4 py-1.5 rounded-full text-sm">Indisponible</span>
          </div>
        )}
        {item.badges.includes("popular") && item.available && (
          <div className="absolute top-2 left-2 bg-[#D97706] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={10} /> Populaire
          </div>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#1F2937] text-sm leading-tight">{item.name}</h3>
            <p className="text-[#9CA3AF] text-xs mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.badges.filter((b: string) => b !== "popular").map((b: string) => (
                <BadgePill key={b} badge={b} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-[#D97706] whitespace-nowrap text-sm">{formatPrice(item.price)}</span>
            {item.available && (
              inCart ? (
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-xl p-0.5">
                  <button
                    onClick={() => onUpdateQty(-1)}
                    className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-[#FEF3C7] transition-colors"
                  >
                    <Minus size={13} className="text-[#6B7280]" />
                  </button>
                  <span className="text-[#1F2937] w-5 text-center text-sm">{inCart.qty}</span>
                  <button
                    onClick={onAdd}
                    className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <Plus size={13} className="text-white" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onAdd}
                  className="bg-[#D97706] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-[#F59E0B] transition-colors shadow-sm"
                >
                  <Plus size={13} /> Ajouter
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}