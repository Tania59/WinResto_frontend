// src/app/components/server/hooks/useTables.ts
import { useState, useMemo, useCallback } from "react";
import { tables } from "../../../data/mockData";
import type { TableData, TableStatus } from "../types";

export function useTables() {
  const [tableList, setTableList] = useState<TableData[]>(tables as TableData[]);

  const occupiedCount = useMemo(
    () => tableList.filter(t => t.status !== "libre").length,
    [tableList]
  );

  const pendingCount = useMemo(
    () => tableList.filter(t => t.status === "commande_attente").length,
    [tableList]
  );

  const callCount = useMemo(
    () => tableList.filter(t => t.status === "appel").length,
    [tableList]
  );

  const getTablesByZone = useCallback(
    (zone: string) => tableList.filter(t => t.zone === zone),
    [tableList]
  );

  const getTableById = useCallback(
    (id: number) => tableList.find(t => t.id === id) || null,
    [tableList]
  );

  const updateTableStatus = useCallback(
    (id: number, status: TableStatus) => {
      setTableList(prev =>
        prev.map(t => (t.id === id ? { ...t, status } : t))
      );
    },
    []
  );

  const clearTableCall = useCallback(
    (id: number) => {
      setTableList(prev =>
        prev.map(t => (t.id === id ? { ...t, hasCall: false } : t))
      );
    },
    []
  );

  return {
    tables: tableList,
    occupiedCount,
    pendingCount,
    callCount,
    getTablesByZone,
    getTableById,
    updateTableStatus,
    clearTableCall,
  };
}