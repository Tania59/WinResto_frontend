// src/app/components/client/types/index.ts
import type { MenuItem } from "../../../data/mockData";

export type Screen = "welcome" | "menu" | "cart" | "geolocation" | "out_of_range" | "tracking";
export type OrderStatus = "received" | "preparing" | "ready" | "served";

export interface CartItem {
  item: MenuItem;
  qty: number;
  note: string;
}

export interface CartItemWithTotal extends CartItem {
  total: number;
}