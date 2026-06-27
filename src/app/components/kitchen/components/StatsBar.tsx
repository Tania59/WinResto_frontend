// src/app/components/kitchen/components/StatsBar.tsx
import { motion } from "motion/react";
import { Flame } from "lucide-react";
import type { TicketCounts } from "../types";

interface StatsBarProps {
  counts: TicketCounts;
  isTiny?: boolean;
}

export function StatsBar({ counts, isTiny = false }: StatsBarProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
      {counts.en_attente > 0 && (
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="bg-[#F59E0B] text-black text-[10px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 whitespace-nowrap"
        >
          <Flame size={11} className="sm:size-3.25" />
          {isTiny ? counts.en_attente : `${counts.en_attente} nouveau${counts.en_attente > 1 ? "x" : ""}`}
        </motion.span>
      )}
    </div>
  );
}