// src/app/components/kitchen/hooks/useKitchenTimer.ts
import { useState, useEffect } from "react";

// Order start offsets (minutes ago from now)
const orderStartOffsets: Record<string, number> = {
  "CMD-001": 12,
  "CMD-002": 28,
  "CMD-003": 5,
  "CMD-004": 3,
  "CMD-005": 1,
};

export function useKitchenTimer(orderId: string, defaultOffset: number = 2) {
  const offset = orderStartOffsets[orderId] ?? defaultOffset;
  const [elapsed, setElapsed] = useState(offset * 60);

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isLate = mins >= 15;
  const isWarning = mins >= 10;

  return {
    mins,
    secs,
    isLate,
    isWarning,
    display: `${mins}:${String(secs).padStart(2, "0")}`,
  };
}