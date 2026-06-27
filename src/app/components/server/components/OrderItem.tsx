// src/app/components/server/components/OrderItem.tsx
import { itemStatusConfig } from "../constants";
import type { OrderItem as OrderItemType } from "../types";

interface OrderItemProps {
  item: OrderItemType;
}

export function OrderItem({ item }: OrderItemProps) {
  const cfg = itemStatusConfig[item.status];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="bg-[#F3F4F6] text-[#6B7280] text-xs px-2 py-0.5 rounded-lg shrink-0">
          {item.quantity}×
        </span>
        <div className="min-w-0">
          <p className="text-[#1F2937] text-sm truncate">{item.name}</p>
          {item.note && (
            <p className="text-xs text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-lg mt-0.5 inline-block">
              ⚠ {item.note}
            </p>
          )}
        </div>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
    </div>
  );
}