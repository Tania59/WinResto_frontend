// src/app/components/server/ServerApp.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { useServerNavigation } from "./hooks/useServerNavigation";
import { useTables } from "./hooks/useTables";
import { useOrders } from "./hooks/useOrders";
import { useManualOrder } from "./hooks/useManualOrder";

import { DashboardScreen } from "./screens/DashboardScreen";
import { TableDetailScreen } from "./screens/TableDetailScreen";
import { ManualOrderScreen } from "./screens/ManualOrderScreen";

import type { TableData } from "./types";

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

// ✅ AJOUT : onBack comme prop optionnelle
export function ServerApp({ onBack }: { onBack?: () => void }) {
  const { screen, navigate, goBack } = useServerNavigation();
  const { tables, occupiedCount, pendingCount, callCount, clearTableCall } = useTables();
  const { getOrdersByTable, markAllAsServed, addManualOrder } = useOrders();
  const {
    cart,
    count,
    total,
    activeCategory,
    setActiveCategory,
    filteredMenu,
    addItem,
    updateQty,
    clearCart,
    getOrderItems,
  } = useManualOrder();

  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const handleTableClick = (table: TableData) => {
    setSelectedTable(table);
    navigate("table_detail");
  };

  const handleSendOrder = () => {
    if (!selectedTable) return;
    const items = getOrderItems();
    addManualOrder(
      selectedTable.id,
      selectedTable.number,
      items,
      undefined
    );
    clearCart();
    navigate("table_detail");
  };

  const handleQuit = () => {
    if (onBack) onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "dashboard" && (
          <motion.div
            key="dashboard"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <DashboardScreen
              tables={tables}
              occupiedCount={occupiedCount}
              pendingCount={pendingCount}
              callCount={callCount}
              onTableClick={handleTableClick}
              onQuit={handleQuit}
            />
          </motion.div>
        )}

        {screen === "table_detail" && selectedTable && (
          <motion.div
            key="table_detail"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <TableDetailScreen
              table={selectedTable}
              orders={getOrdersByTable(selectedTable.id)}
              onBack={goBack}
              onManualOrder={() => navigate("manual_order")}
              onMarkAllServed={(orderId) => markAllAsServed(orderId)}
              onClearCall={(tableId) => clearTableCall(tableId)}
              onPay={(tableId) => {
                toast.success("Paiement effectué", {
                  description: `Table ${selectedTable.number} · Total payé`,
                });
              }}
            />
          </motion.div>
        )}

        {screen === "manual_order" && selectedTable && (
          <motion.div
            key="manual_order"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <ManualOrderScreen
              tableNumber={selectedTable.number}
              cart={cart}
              count={count}
              total={total}
              activeCategory={activeCategory}
              filteredMenu={filteredMenu}
              onSetCategory={setActiveCategory}
              onAddItem={addItem}
              onUpdateQty={updateQty}
              onSendOrder={handleSendOrder}
              onBack={goBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}