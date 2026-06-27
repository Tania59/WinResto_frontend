// src/app/components/server/components/ZoneSection.tsx
import { TableCard } from "./TableCard";
import type { TableData } from "../types";

interface ZoneSectionProps {
  zone: string;
  tables: TableData[];
  onTableClick: (table: TableData) => void;
}

const zoneIcons: Record<string, string> = {
  Terrasse: "🌿",
  "Salle principale": "🍽",
  VIP: "⭐",
};

export function ZoneSection({ zone, tables, onTableClick }: ZoneSectionProps) {
  return (
    <div>
      <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-2 sm:mb-2.5 uppercase tracking-widest flex items-center gap-1 sm:gap-1.5">
        {zoneIcons[zone] || "🍽"} {zone}
      </p>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5">
        {tables.map((table, i) => (
          <TableCard key={table.id} table={table} onClick={onTableClick} index={i} />
        ))}
      </div>
    </div>
  );
}