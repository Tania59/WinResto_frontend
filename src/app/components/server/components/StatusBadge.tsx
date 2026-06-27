// src/app/components/server/components/StatusBadge.tsx
import { statusConfig } from "../constants";
import type { TableStatus } from "../types";

interface StatusBadgeProps {
  status: TableStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${className}`}>
      {cfg.label}
    </span>
  );
}