// src/app/components/kitchen/components/TicketTimer.tsx
import { useKitchenTimer } from "../hooks/useKitchenTimer";

interface TicketTimerProps {
  orderId: string;
  isTiny?: boolean;
}

export function TicketTimer({ orderId, isTiny = false }: TicketTimerProps) {
  const { display, isLate, isWarning } = useKitchenTimer(orderId);

  return (
    <span
      className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-lg font-mono tabular-nums whitespace-nowrap ${
        isLate
          ? "bg-[#EF4444]/20 text-[#EF4444]"
          : isWarning
          ? "bg-[#F59E0B]/20 text-[#F59E0B]"
          : "bg-white/10 text-white/50"
      }`}
    >
      {isLate && "⚠ "}
      {display}
    </span>
  );
}