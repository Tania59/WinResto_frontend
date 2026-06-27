// src/app/components/kitchen/components/TicketCard.tsx
import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { TicketTimer } from "./TicketTimer";
import { ItemStatusButton } from "./ItemStatusButton";
import { BORDER_MAP } from "../constants";
import type { Order } from "../../../data/mockData";
import type { KitchenOrder } from "../types";

interface TicketCardProps {
  order: KitchenOrder;
  onMarkAll: (orderId: string, status: "en_preparation" | "pret") => void;
  onArchive: (orderId: string) => void;
  onMarkItem: (orderId: string, itemId: number, status: "en_preparation" | "pret") => void;
  isTiny?: boolean;
}

export function TicketCard({ order, onMarkAll, onArchive, onMarkItem, isTiny = false }: TicketCardProps) {
  const isReady = order.status === "pret";
  const border = BORDER_MAP[order.status] || "border-l-[#374151]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`bg-[#161B22] rounded-2xl border-l-4 ${border} flex flex-col overflow-hidden ${
        isReady ? "ring-1 ring-[#22C55E]/25" : ""
      }`}
    >
      {/* Header */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-white/8 flex flex-wrap items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
            <span className="text-lg sm:text-xl text-white">
              {isTiny ? `T${order.tableNumber}` : `Table ${order.tableNumber}`}
            </span>
            {isReady && (
              <span className="bg-[#22C55E]/15 text-[#22C55E] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#22C55E]/20 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                <CheckCircle size={10} className="sm:size-2.75" /> PRÊT
              </span>
            )}
            {order.isLate && !isReady && (
              <span className="bg-[#EF4444]/15 text-[#EF4444] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#EF4444]/20 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                <AlertTriangle size={10} className="sm:size-2.75" /> Retard
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-white/40 text-[10px] sm:text-xs flex items-center gap-1">
              <Clock size={9} className="sm:size-2.5" /> {order.sentAt}
            </span>
            <TicketTimer orderId={order.id} isTiny={isTiny} />
          </div>
        </div>
        <span className="text-white/30 text-[10px] sm:text-xs shrink-0">{order.id}</span>
      </div>

      {/* Items */}
      <div className="p-3 sm:p-4 flex-1 space-y-2.5 sm:space-y-3">
        {order.items.map(item => {
          const isDone = item.status === "pret" || item.status === "servi";
          return (
            <div
              key={item.id}
              className={`flex items-start gap-1.5 sm:gap-2 transition-opacity ${isDone ? "opacity-50" : ""}`}
            >
              <span className="bg-white/8 text-white/60 text-[11px] sm:text-sm px-1.5 sm:px-2 py-0.5 rounded-lg mt-0.5 shrink-0 font-mono">
                {item.quantity}×
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm sm:text-base leading-tight wrap-break-word ${isDone ? "line-through text-white/40" : "text-white"}`}>
                  {item.name}
                </p>
                {item.note && (
                  <p className="text-[#F59E0B] text-[10px] sm:text-xs mt-0.5 bg-[#F59E0B]/10 px-1.5 sm:px-2 py-0.5 rounded-lg inline-block wrap-break-word">
                    ⚠ {item.note}
                  </p>
                )}
              </div>
              <ItemStatusButton
                status={item.status}
                onClick={() => onMarkItem(order.id, item.id, item.status === "en_attente" ? "en_preparation" : "pret")}
                isTiny={isTiny}
              />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
        {isReady ? (
          <>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#4ADE80] text-[10px] sm:text-xs bg-[#22C55E]/8 border border-[#22C55E]/15 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl">
              <CheckCircle size={12} className="sm:size-3.25" /> Serveur notifié ✓
            </div>
            <button
              onClick={() => onArchive(order.id)}
              className="w-full bg-white/6 text-white/50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm hover:bg-white/10 hover:text-white transition-colors"
            >
              {isTiny ? "Archiver" : "Archiver le ticket"}
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => onMarkAll(order.id, "en_preparation")}
              className="bg-[#3B82F6]/12 text-[#60A5FA] border border-[#3B82F6]/20 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm hover:bg-[#3B82F6]/20 transition-colors active:scale-[0.97] truncate"
            >
              {isTiny ? "▶ Démarrer" : "▶ Tout démarrer"}
            </button>
            <button
              onClick={() => onMarkAll(order.id, "pret")}
              className="bg-[#22C55E]/12 text-[#4ADE80] border border-[#22C55E]/20 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm hover:bg-[#22C55E]/20 transition-colors active:scale-[0.97] truncate"
            >
              {isTiny ? "✓ Prêt" : "✓ Tout prêt"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}