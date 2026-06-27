// src/app/components/kitchen/constants/index.ts
import type { KDSFilter } from "../types";

export const FILTERS: KDSFilter[] = ["tous", "en_attente", "en_preparation", "prets"];

export const FILTER_LABELS: Record<KDSFilter, string> = {
  tous: "Tous",
  en_attente: "En attente",
  en_preparation: "En cours",
  prets: "Prêts",
};

export const FILTER_COLORS: Record<KDSFilter, string> = {
  tous: "bg-white/15 text-white",
  en_attente: "bg-[#F59E0B] text-black",
  en_preparation: "bg-[#3B82F6] text-white",
  prets: "bg-[#22C55E] text-white",
};

export const BORDER_MAP: Record<string, string> = {
  en_attente: "border-l-[#F59E0B]",
  en_preparation: "border-l-[#3B82F6]",
  pret: "border-l-[#22C55E]",
  servi: "border-l-[#374151]",
};

export const ITEM_STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  en_preparation: "En cours",
  pret: "Prêt",
  servi: "Servi",
};

export const RESTAURANT_NAME = "Le Palmier";