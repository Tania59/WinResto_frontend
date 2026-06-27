// src/app/components/server/screens/TableDetailScreen.tsx
import { motion } from "motion/react";
import { ChevronLeft, Users, Clock, AlertCircle, CheckCircle2, PlusCircle, CreditCard } from "lucide-react";
import { OrderItem } from "../components/OrderItem";
import { StatusBadge } from "../components/StatusBadge";
import type { TableData, Order } from "../types";

interface TableDetailScreenProps {
  table: TableData;
  orders: Order[];
  onBack: () => void;
  onManualOrder: () => void;
  onMarkAllServed: (orderId: string) => void;
  onClearCall: (tableId: number) => void;
  onPay: (tableId: number) => void;
}

export function TableDetailScreen({
  table,
  orders,
  onBack,
  onManualOrder,
  onMarkAllServed,
  onClearCall,
  onPay,
}: TableDetailScreenProps) {
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
            <div className="flex items-center gap-1 sm:gap-2">
              <h2 className="text-[#1F2937] text-sm sm:text-base truncate">Table {table.number}</h2>
              <StatusBadge status={table.status} className="shrink-0" />
            </div>
            <p className="text-[#6B7280] text-[10px] sm:text-xs truncate">
              Zone {table.zone} · {table.capacity} pers.
            </p>
          </div>
        </div>
        <button
          onClick={() => onPay(table.id)}
          className="bg-[#22C55E] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm hover:bg-[#16A34A] transition-colors shrink-0"
        >
          Clôturer
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {table.hasCall && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 sm:p-3.5 flex items-center gap-2 sm:gap-3"
          >
            <AlertCircle size={16} className="sm:size-[18px] text-[#EF4444] shrink-0" />
            <p className="text-[#DC2626] text-xs sm:text-sm flex-1">Le client demande à être servi</p>
            <button
              onClick={() => onClearCall(table.id)}
              className="bg-[#EF4444] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm hover:bg-red-600 transition-colors shrink-0"
            >
              Traiter
            </button>
          </motion.div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-[#9CA3AF]">
            <Users size={32} className="sm:size-10 mx-auto mb-2 sm:mb-3 opacity-30" />
            <p className="text-sm sm:text-base">Aucune commande active</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
            >
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-[#F3F4F6] bg-[#F9FAFB] flex flex-wrap items-center justify-between gap-1 sm:gap-2">
                <div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="text-[#1F2937] text-xs sm:text-sm">{order.id}</span>
                    {order.isLate && (
                      <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#FECACA]">
                        ⏱ Retard
                      </span>
                    )}
                  </div>
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs flex items-center gap-1 mt-0.5 flex-wrap">
                    <Clock size={10} className="sm:size-3" /> {order.sentAt}
                    {order.clientName && (
                      <>
                        <span className="text-[#D1D5DB]">·</span>
                        <span className="truncate max-w-[80px] sm:max-w-none">{order.clientName}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {order.items.map(item => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <button
                  onClick={() => onMarkAllServed(order.id)}
                  className="w-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#DCFCE7] transition-colors"
                >
                  <CheckCircle2 size={14} className="sm:size-[15px]" /> Tout marquer comme servi
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-[#E5E7EB] grid grid-cols-2 gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onManualOrder}
          className="border-2 border-[#D97706] text-[#D97706] py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-[#FEF3C7] transition-colors"
        >
          <PlusCircle size={14} className="sm:size-4" /> Commande manuelle
        </button>
        <button
          onClick={() => onPay(table.id)}
          className="bg-[#22C55E] text-white py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-[#16A34A] transition-colors"
        >
          <CreditCard size={14} className="sm:size-4" /> Paiement
        </button>
      </div>
    </div>
  );
}