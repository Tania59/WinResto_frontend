// src/app/components/server/constants/index.ts
import type { StatusConfig, ItemStatusConfig } from "../types";

export const ZONES = ["Terrasse", "Salle principale", "VIP"];

export const CATEGORIES = ["Tout", "Entrées", "Plats", "Grillades", "Boissons", "Desserts"];

export const statusConfig: Record<string, StatusConfig> = {
  libre: {
    bg: "bg-white",
    text: "text-[#9CA3AF]",
    border: "border-[#E5E7EB]",
    dot: "bg-[#D1D5DB]",
    label: "Libre"
  },
  occupee: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#3B82F6]",
    label: "Occupée"
  },
  commande_attente: {
    bg: "bg-[#FFFBEB]",
    text: "text-[#B45309]",
    border: "border-[#FDE68A]",
    dot: "bg-[#D97706]",
    label: "En attente"
  },
  paiement: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#16A34A]",
    border: "border-[#BBF7D0]",
    dot: "bg-[#22C55E]",
    label: "Addition"
  },
  appel: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#DC2626]",
    border: "border-[#FECACA]",
    dot: "bg-[#EF4444]",
    label: "🔔 Appel !"
  },
};

export const itemStatusConfig: Record<string, ItemStatusConfig> = {
  en_attente: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#6B7280]",
    label: "En attente"
  },
  en_preparation: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    label: "⚡ En préparation"
  },
  pret: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#16A34A]",
    label: "✓ Prêt"
  },
  servi: {
    bg: "bg-[#F9FAFB]",
    text: "text-[#9CA3AF]",
    label: "Servi"
  },
};

export const RESTAURANT_NAME = "Le Palmier";
export const WAITER_NAME = "Fatoumata Traoré";