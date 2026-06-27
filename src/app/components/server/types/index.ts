// src/app/components/server/types/index.ts
import type { MenuItem } from "../../../data/mockData";

export type WaiterScreen = "dashboard" | "table_detail" | "manual_order";

export type TableStatus = "libre" | "occupee" | "commande_attente" | "paiement" | "appel";

export type OrderItemStatus = "en_attente" | "en_preparation" | "pret" | "servi";

// Types qui correspondent EXACTEMENT à mockData
export interface TableData {
  id: number;
  number: number;
  zone: string;
  capacity: number;
  status: TableStatus;
  pendingOrders: number;
  hasCall: boolean;
}

export interface OrderItem {
  id: number;  // ← number comme dans mockData
  name: string;
  quantity: number;
  note?: string;
  status: OrderItemStatus;
}

export interface Order {
  id: string;
  tableId: number;
  tableNumber: number;
  items: OrderItem[];
  sentAt: string;
  clientName?: string;
  isLate?: boolean;
}

export interface CartItem {
  item: MenuItem;
  qty: number;
  note: string;
}

export interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
}

export interface ItemStatusConfig {
  bg: string;
  text: string;
  label: string;
}