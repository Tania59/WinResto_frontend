// src/app/components/client/components/CartItem.tsx
import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../../data/mockData";
import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (delta: number) => void;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
  index: number;
}

export function CartItem({ item, onUpdateQty, onRemove, onUpdateNote, index }: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl p-4 border border-[#E5E7EB]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={item.item.photo}
            alt={item.item.name}
            className="w-14 h-14 object-cover rounded-xl shrink-0 bg-[#F3F4F6]"
          />
          <div className="min-w-0">
            <p className="text-[#1F2937] text-sm truncate">{item.item.name}</p>
            <p className="text-[#D97706] text-xs">{formatPrice(item.item.price)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-xl p-0.5 shrink-0">
          <button
            onClick={() => onUpdateQty(-1)}
            className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center"
          >
            <Minus size={13} className="text-[#6B7280]" />
          </button>
          <span className="text-[#1F2937] w-5 text-center text-sm">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(1)}
            className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center"
          >
            <Plus size={13} className="text-white" />
          </button>
        </div>
        <button onClick={onRemove} className="p-1.5 text-[#EF4444]/60 hover:text-[#EF4444] transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[#D97706] text-sm">{formatPrice(item.item.price * item.qty)}</span>
      </div>
      <input
        placeholder="Note pour la cuisine (ex: sans piment)"
        value={item.note}
        onChange={e => onUpdateNote(e.target.value)}
        className="mt-2 w-full text-xs border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 bg-[#F9FAFB] placeholder-[#9CA3AF]"
      />
    </motion.div>
  );
}