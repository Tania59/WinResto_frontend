// src/app/components/kitchen/screens/DashboardScreen.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChefHat } from "lucide-react";
import { TicketCard } from "../components/TicketCard";
import { FilterBar } from "../components/FilterBar";
import { StatsBar } from "../components/StatsBar";
import { useKitchenFilter } from "../hooks/useKitchenFilter";
import type { KitchenOrder } from "../types";
import type { TicketCounts } from "../types";

interface DashboardScreenProps {
  orders: KitchenOrder[];
  counts: TicketCounts;
  onMarkAll: (orderId: string, status: "en_preparation" | "pret") => void;
  onArchive: (orderId: string) => void;
  onMarkItem: (orderId: string, itemId: number, status: "en_preparation" | "pret") => void;
  onQuit: () => void;
  isTiny?: boolean;
  timeStr: string;
}

export function DashboardScreen({
  orders,
  counts,
  onMarkAll,
  onArchive,
  onMarkItem,
  onQuit,
  isTiny = false,
  timeStr,
}: DashboardScreenProps) {
  const { filter, setFilter } = useKitchenFilter();

  const getFilteredOrders = () => {
    return orders.filter(o => {
      if (filter === "tous") return o.status !== "servi";
      if (filter === "prets") return o.status === "pret";
      return o.status === filter;
    });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="flex flex-col h-full bg-[#0D1117] text-white overflow-hidden">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-white/8 px-3 sm:px-5 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D97706]/20 rounded-xl flex items-center justify-center shrink-0">
            <ChefHat size={18} className="sm:size-5.5 text-[#D97706]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base text-white truncate">Cuisine · Le Palmier</h1>
              {!isTiny && (
                <span className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#22C55E]/20 shrink-0">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="text-white/40 text-[10px] sm:text-xs font-mono tabular-nums">{timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <StatsBar counts={counts} isTiny={isTiny} />
          <button
            onClick={onQuit}
            className="text-white/40 text-[10px] sm:text-sm border border-white/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-colors whitespace-nowrap"
          >
            Quitter
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar currentFilter={filter} onFilterChange={setFilter} counts={counts} />

      {/* Tickets */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <ChefHat size={48} className="sm:size-16 mb-4 opacity-50" />
            <p className="text-lg sm:text-xl mb-1">Cuisine au calme !</p>
            <p className="text-xs sm:text-sm">Aucun ticket en attente 🧘</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredOrders.map(order => (
                <TicketCard
                  key={order.id}
                  order={order}
                  onMarkAll={onMarkAll}
                  onArchive={onArchive}
                  onMarkItem={onMarkItem}
                  isTiny={isTiny}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}