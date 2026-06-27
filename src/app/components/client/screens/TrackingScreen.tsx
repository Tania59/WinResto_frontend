// src/app/components/client/screens/TrackingScreen.tsx
import { motion } from "motion/react";
import { Utensils, CreditCard } from "lucide-react";
import { formatPrice } from "../../../data/mockData";
import { StatusTimeline } from "../components/StatusTimeline";
import type { CartItem } from "../types";
import type { OrderStatus } from "../types";

interface TrackingScreenProps {
  orderId: string;
  cart: CartItem[];
  cartTotal: number;
  status: OrderStatus;
  onCallWaiter: () => void;
  onRequestBill: () => void;
}

export function TrackingScreen({
  orderId,
  cart,
  cartTotal,
  status,
  onCallWaiter,
  onRequestBill,
}: TrackingScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[#6B7280] text-xs">Votre commande</p>
          <span className="bg-[#22C55E]/10 text-[#22C55E] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> En cours
          </span>
        </div>
        <h2 className="text-[#1F2937] text-base">{orderId}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <StatusTimeline currentStatus={status} />

        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <h3 className="text-[#1F2937] text-sm mb-3">Articles commandés</h3>
          <div className="space-y-2.5">
            {cart.map((c: CartItem) => (
              <div key={c.item.id} className="flex items-center gap-2">
                <span className="bg-[#F3F4F6] text-[#6B7280] text-xs px-2 py-0.5 rounded-lg">
                  {c.qty}×
                </span>
                <span className="text-[#1F2937] text-sm flex-1">{c.item.name}</span>
                {c.note && (
                  <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-0.5 rounded-full">
                    ⚠ {c.note}
                  </span>
                )}
                <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-xs px-2 py-0.5 rounded-full">
                  En prép.
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[#F3F4F6] text-[#D97706] text-sm">
            <span>Total payé</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCallWaiter}
            className="border-2 border-[#D97706] text-[#D97706] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-[#D97706]/5 transition-colors"
          >
            <Utensils size={16} /> Appeler
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRequestBill}
            className="border-2 border-[#EF4444] text-[#EF4444] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-[#EF4444]/5 transition-colors"
          >
            <CreditCard size={16} /> Addition
          </motion.button>
        </div>
      </div>
    </div>
  );
}