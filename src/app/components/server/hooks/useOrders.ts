// src/app/components/server/hooks/useOrders.ts
import { useState, useCallback } from "react";
import { activeOrders } from "../../../data/mockData";
import { toast } from "sonner";
import type { Order, OrderItemStatus } from "../types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(activeOrders as Order[]);

  const getOrdersByTable = useCallback(
    (tableId: number) => orders.filter(o => o.tableId === tableId),
    [orders]
  );

  const markItemAsServed = useCallback(
    (orderId: string, itemId: number) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === itemId ? { ...item, status: "servi" as OrderItemStatus } : item
                ),
              }
            : order
        )
      );
    },
    []
  );

  const markAllAsServed = useCallback(
    (orderId: string) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                items: order.items.map(item => ({ ...item, status: "servi" as OrderItemStatus })),
              }
            : order
        )
      );
      toast.success("Articles marqués comme servis");
    },
    []
  );

  const addManualOrder = useCallback(
    (
      tableId: number,
      tableNumber: number,
      items: { item: { id: number; name: string }; qty: number; note: string }[],
      clientName?: string
    ) => {
      const newOrder: Order = {
        id: `CMD-${Math.floor(Math.random() * 900) + 100}`,
        tableId,
        tableNumber,
        clientName,
        sentAt: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        items: items.map(({ item, qty, note }) => ({
          id: item.id,
          name: item.name,
          quantity: qty,
          note,
          status: "en_attente" as OrderItemStatus,
        })),
        isLate: false,
      };
      setOrders(prev => [...prev, newOrder]);
      toast.success("Commande envoyée en cuisine", {
        description: `Table ${tableNumber} · ${items.length} articles`,
      });
      return newOrder;
    },
    []
  );

  return {
    orders,
    getOrdersByTable,
    markItemAsServed,
    markAllAsServed,
    addManualOrder,
  };
}