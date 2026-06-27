// src/app/components/kitchen/hooks/useKitchenOrders.ts
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { activeOrders } from "../../../data/mockData";
import type { Order, OrderItemStatus } from "../../../data/mockData";
import type { KitchenOrder } from "../types";

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>(activeOrders);

  const markItemAs = useCallback((orderId: string, itemId: number, status: OrderItemStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const items = order.items.map(item =>
          item.id === itemId ? { ...item, status } : item
        );
        const allReady = items.every(i => i.status === "pret" || i.status === "servi");
        const anyPrep = items.some(i => i.status === "en_preparation");
        return {
          ...order,
          items,
          status: allReady ? "pret" as const : anyPrep ? "en_preparation" as const : order.status,
        };
      })
    );
  }, []);

  const markAllAs = useCallback((orderId: string, status: OrderItemStatus) => {
    const newOrderStatus = status === "pret" ? "pret" as const : "en_preparation" as const;
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newOrderStatus,
              items: order.items.map(item => ({ ...item, status })),
            }
          : order
      )
    );
    if (status === "pret") {
      const order = orders.find(o => o.id === orderId);
      toast.success(`Table ${order?.tableNumber} prête !`, {
        description: "Serveur notifié automatiquement ✓",
        style: { background: "#052e16", color: "#86efac", border: "1px solid #166534" },
      });
    }
  }, [orders]);

  const archiveOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast.success("Ticket archivé", {
      style: { background: "#1F2937", color: "white" },
    });
  }, []);

  const getFilteredOrders = useCallback((filter: string) => {
    return orders.filter(o => {
      if (filter === "tous") return o.status !== "servi";
      if (filter === "prets") return o.status === "pret";
      return o.status === filter;
    });
  }, [orders]);

  const getCounts = useCallback(() => {
    const tous = orders.filter(o => o.status !== "servi").length;
    const en_attente = orders.filter(o => o.status === "en_attente").length;
    const en_preparation = orders.filter(o => o.status === "en_preparation").length;
    const prets = orders.filter(o => o.status === "pret").length;
    return { tous, en_attente, en_preparation, prets };
  }, [orders]);

  return {
    orders,
    markItemAs,
    markAllAs,
    archiveOrder,
    getFilteredOrders,
    getCounts,
  };
}