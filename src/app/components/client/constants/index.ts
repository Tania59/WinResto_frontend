// src/app/components/client/constants/index.ts
import type { Screen, OrderStatus } from "../types";

export const screenOrder: Screen[] = ["welcome", "menu", "cart", "geolocation", "tracking"];

export const statusSteps = [
  { key: "received" as OrderStatus, label: "Commande reçue", color: "bg-[#22C55E]", textColor: "text-[#22C55E]" },
  { key: "preparing" as OrderStatus, label: "En préparation", color: "bg-[#3B82F6]", textColor: "text-[#3B82F6]" },
  { key: "ready" as OrderStatus, label: "Prête à servir", color: "bg-[#D97706]", textColor: "text-[#D97706]" },
  { key: "served" as OrderStatus, label: "Servie", color: "bg-[#6B7280]", textColor: "text-[#6B7280]" },
];

export const RESTAURANT_NAME = "Le Palmier";
export const DEFAULT_TABLE = 5;