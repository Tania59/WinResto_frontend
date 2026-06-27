// src/app/components/server/screens/DashboardScreen.tsx
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Wifi } from "lucide-react";
import { StatsCards } from "../components/StatsCards";
import { ZoneSection } from "../components/ZoneSection";
import { ZONES, WAITER_NAME } from "../constants";
import type { TableData } from "../types";

interface DashboardScreenProps {
  tables: TableData[];
  occupiedCount: number;
  pendingCount: number;
  callCount: number;
  onTableClick: (table: TableData) => void;
  onQuit?: () => void;
}

export function DashboardScreen({
  tables,
  occupiedCount,
  pendingCount,
  callCount,
  onTableClick,
  onQuit,
}: DashboardScreenProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      toast("🔔 Nouvelle commande", {
        description: "Table 5 · 3 articles",
        action: { label: "Voir", onClick: () => {} },
        duration: 5000,
      });
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-[#E5E7EB] px-4 sm:px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#D97706] rounded-xl flex items-center justify-center text-white text-base sm:text-lg shrink-0">
            🌴
          </div>
          <div className="min-w-0">
            <p className="text-[#1F2937] text-xs sm:text-sm flex items-center gap-1 sm:gap-2 truncate">
              Service en cours
              <span className="flex items-center gap-1 text-[#22C55E] text-[10px] sm:text-xs shrink-0">
                <Wifi size={10} className="sm:size-3" /> Live
              </span>
            </p>
            <p className="text-[#6B7280] text-[10px] sm:text-xs truncate">
              {timeStr} · {WAITER_NAME}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {callCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bg-[#EF4444] text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full"
            >
              {callCount} appel{callCount > 1 ? "s" : ""}
            </motion.span>
          )}
          {onQuit && (
            <button
              onClick={onQuit}
              className="text-[#6B7280] text-[10px] sm:text-xs border border-[#E5E7EB] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              Quitter
            </button>
          )}
        </div>
      </header>

      <StatsCards
        occupiedCount={occupiedCount}
        totalTables={tables.length}
        pendingCount={pendingCount}
        callCount={callCount}
      />

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
        {ZONES.map(zone => {
          const zoneTables = tables.filter(t => t.zone === zone);
          if (zoneTables.length === 0) return null;
          return (
            <ZoneSection
              key={zone}
              zone={zone}
              tables={zoneTables}
              onTableClick={onTableClick}
            />
          );
        })}
      </div>
    </div>
  );
}