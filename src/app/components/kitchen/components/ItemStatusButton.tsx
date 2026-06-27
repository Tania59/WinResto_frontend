// src/app/components/kitchen/components/ItemStatusButton.tsx
import { OrderItemStatus } from "../../../data/mockData";

interface ItemStatusButtonProps {
  status: OrderItemStatus;
  onClick: () => void;
  isTiny?: boolean;
}

export function ItemStatusButton({ status, onClick, isTiny = false }: ItemStatusButtonProps) {
  if (status === "pret" || status === "servi") {
    return <span className="text-[#22C55E]/60 text-xs px-1 sm:px-2 py-1 shrink-0">✓</span>;
  }

  const isWaiting = status === "en_attente";
  const label = isWaiting ? (isTiny ? "▶" : "▶ En cours") : (isTiny ? "✓" : "✓ Prêt");
  const className = isWaiting
    ? "bg-[#3B82F6]/15 text-[#60A5FA] hover:bg-[#3B82F6]/25 border border-[#3B82F6]/20"
    : "bg-[#22C55E]/15 text-[#4ADE80] hover:bg-[#22C55E]/25 border border-[#22C55E]/20";

  return (
    <button
      onClick={onClick}
      className={`text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap active:scale-95 ${className}`}
    >
      {label}
    </button>
  );
}