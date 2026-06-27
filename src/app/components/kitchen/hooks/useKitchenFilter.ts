// src/app/components/kitchen/hooks/useKitchenFilter.ts
import { useState, useCallback } from "react";
import type { KDSFilter } from "../types";

export function useKitchenFilter(initialFilter: KDSFilter = "tous") {
  const [filter, setFilter] = useState<KDSFilter>(initialFilter);

  const handleFilterChange = useCallback((newFilter: KDSFilter) => {
    setFilter(newFilter);
  }, []);

  return {
    filter,
    setFilter: handleFilterChange,
  };
}