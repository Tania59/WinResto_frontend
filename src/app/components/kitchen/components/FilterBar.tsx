// src/app/components/kitchen/components/FilterBar.tsx
import { FILTERS, FILTER_LABELS, FILTER_COLORS } from "../constants";
import type { KDSFilter } from "../types";

interface FilterBarProps {
  currentFilter: KDSFilter;
  onFilterChange: (filter: KDSFilter) => void;
  counts: Record<KDSFilter, number>;
}

export function FilterBar({ currentFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="bg-[#161B22]/60 border-b border-white/8 px-2 sm:px-5 py-2 sm:py-3 flex gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-hide">
      {FILTERS.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap shrink-0 ${
            currentFilter === filter
              ? FILTER_COLORS[filter]
              : "bg-white/6 text-white/50 hover:bg-white/12 hover:text-white"
          }`}
        >
          {FILTER_LABELS[filter]}
          {counts[filter] > 0 && (
            <span
              className={`px-1 py-0.5 rounded-full text-[10px] sm:text-xs ${
                currentFilter === filter ? "bg-black/20" : "bg-white/15"
              }`}
            >
              {counts[filter]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}