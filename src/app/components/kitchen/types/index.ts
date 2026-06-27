// src/app/components/kitchen/types/index.ts
import type { Order, OrderItemStatus } from "../../../data/mockData";

export type KDSFilter = "tous" | "en_attente" | "en_preparation" | "prets";

export interface KitchenOrder extends Order {
  // On peut ajouter des propriétés spécifiques cuisine ici
  elapsedTime?: number;
}

export interface TicketCounts {
  tous: number;
  en_attente: number;
  en_preparation: number;
  prets: number;
}

export interface ItemStatusButtonProps {
  status: OrderItemStatus;
  onClick: () => void;
  label: string;
}