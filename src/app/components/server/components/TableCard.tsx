// src/app/components/server/components/TableCard.tsx
import { motion } from "motion/react";
import { statusConfig } from "../constants";
import type { TableData } from "../types";

interface TableCardProps {
  table: TableData;
  onClick: (table: TableData) => void;
  index: number;
}

export function TableCard({ table, onClick, index }: TableCardProps) {
  const cfg = statusConfig[table.status];
  const isWaiting = table.status === "commande_attente";
  const isCall = table.status === "appel";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(table)}
      className={`relative border-2 rounded-xl p-2 sm:p-3 text-center transition-all hover:shadow-md ${cfg.bg} ${cfg.border} cursor-pointer`}
    >
      {isWaiting && (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 rounded-xl bg-[#D97706]/8"
        />
      )}
      <p className={`text-base sm:text-lg relative z-10 ${cfg.text}`}>{table.number}</p>
      <p className={`text-[10px] sm:text-xs relative z-10 ${cfg.text} opacity-70 mt-0.5 truncate`}>{cfg.label}</p>
      {table.pendingOrders > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-[#D97706] text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center z-20"
        >
          {table.pendingOrders}
        </motion.span>
      )}
      {isCall && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 bg-[#EF4444] text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center z-20"
        >
          !
        </motion.span>
      )}
    </motion.button>
  );
}