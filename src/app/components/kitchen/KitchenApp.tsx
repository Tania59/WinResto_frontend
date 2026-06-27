// src/app/components/kitchen/KitchenApp.tsx
import { useState, useEffect } from "react";
import { useKitchenOrders } from "./hooks/useKitchenOrders";
import { DashboardScreen } from "./screens/DashboardScreen";

// Hook pour détecter les très petits écrans
function useIsTinyScreen() {
  const [isTiny, setIsTiny] = useState(false);
  useEffect(() => {
    const check = () => setIsTiny(window.innerWidth < 360);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTiny;
}

export function KitchenApp({ onBack }: { onBack: () => void }) {
  const [time, setTime] = useState(new Date());
  const isTiny = useIsTinyScreen();

  const { orders, markAllAs, archiveOrder, markItemAs, getCounts } = useKitchenOrders();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleMarkAll = (orderId: string, status: "en_preparation" | "pret") => {
    markAllAs(orderId, status);
  };

  const handleMarkItem = (orderId: string, itemId: number, status: "en_preparation" | "pret") => {
    markItemAs(orderId, itemId, status);
  };

  const handleArchive = (orderId: string) => {
    archiveOrder(orderId);
  };

  return (
    <DashboardScreen
      orders={orders}
      counts={getCounts()}
      onMarkAll={handleMarkAll}
      onArchive={handleArchive}
      onMarkItem={handleMarkItem}
      onQuit={onBack}
      isTiny={isTiny}
      timeStr={timeStr}
    />
  );
}