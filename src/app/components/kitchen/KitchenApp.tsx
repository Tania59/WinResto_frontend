import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, ChefHat, Clock, Flame } from "lucide-react";
import { activeOrders } from "../../data/mockData";
import type { Order, OrderItemStatus } from "../../data/mockData";

// ============================================================
// 1️⃣ HOOK POUR DÉTECTER LES TRÈS PETITS ÉCRANS (< 360px)
// ============================================================
function useIsTinyScreen() {
  const [isTiny, setIsTiny] = useState(false);
  useEffect(() => {
    const check = () => setIsTiny(window.innerWidth < 360);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isTiny;
}

type KDSFilter = "tous" | "en_attente" | "en_preparation" | "prets";

// Each order gets a start time offset (minutes ago from now)
const orderStartOffsets: Record<string, number> = {
  "CMD-001": 12, "CMD-002": 28, "CMD-003": 5, "CMD-004": 3, "CMD-005": 1,
};

function useElapsed(startedMinsAgo: number) {
  const [elapsed, setElapsed] = useState(startedMinsAgo * 60);
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isLate = mins >= 15;
  const isWarning = mins >= 10;
  return { mins, secs, isLate, isWarning, display: `${mins}:${String(secs).padStart(2, "0")}` };
}

function TicketTimer({ orderId }: { orderId: string }) {
  const offset = orderStartOffsets[orderId] ?? 2;
  const { display, isLate, isWarning } = useElapsed(offset);
  return (
    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-lg font-mono tabular-nums whitespace-nowrap ${isLate ? "bg-[#EF4444]/20 text-[#EF4444]" : isWarning ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-white/10 text-white/50"}`}>
      {isLate && "⚠ "}{display}
    </span>
  );
}

export function KitchenApp({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<KDSFilter>("tous");
  const [orders, setOrders] = useState<Order[]>(activeOrders);
  const [time, setTime] = useState(new Date());

  // ============================================================
  // 2️⃣ UTILISATION DU HOOK POUR LES TRÈS PETITS ÉCRANS
  // ============================================================
  const isTiny = useIsTinyScreen();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // New order arrives after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      toast("🍽 Nouveau ticket", {
        description: "Table 3 · 2 articles · Jollof rice, Bière Flag",
        duration: 6000,
        style: { background: "#1F2937", color: "white", border: "1px solid rgba(255,255,255,0.1)" },
      });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const filtered = orders.filter(o => {
    if (filter === "tous") return o.status !== "servi";
    if (filter === "prets") return o.status === "pret";
    return o.status === filter;
  });

  const counts = {
    tous: orders.filter(o => o.status !== "servi").length,
    en_attente: orders.filter(o => o.status === "en_attente").length,
    en_preparation: orders.filter(o => o.status === "en_preparation").length,
    prets: orders.filter(o => o.status === "pret").length,
  };

  const updateAllItems = (orderId: string, status: OrderItemStatus) => {
    const newOrderStatus = status === "pret" ? "pret" as const : "en_preparation" as const;
    setOrders(prev => prev.map(o => o.id !== orderId ? o : {
      ...o,
      status: newOrderStatus,
      items: o.items.map(i => ({ ...i, status })),
    }));
    if (status === "pret") {
      const order = orders.find(o => o.id === orderId);
      toast.success(`Table ${order?.tableNumber} prête !`, {
        description: "Serveur notifié automatiquement ✓",
        style: { background: "#052e16", color: "#86efac", border: "1px solid #166534" },
      });
    }
  };

  const archiveOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const updateItem = (orderId: string, itemId: number, status: OrderItemStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const items = o.items.map(i => i.id === itemId ? { ...i, status } : i);
      const allReady = items.every(i => i.status === "pret" || i.status === "servi");
      const anyPrep = items.some(i => i.status === "en_preparation");
      return { ...o, items, status: allReady ? "pret" as const : anyPrep ? "en_preparation" as const : o.status };
    }));
  };

  const borderMap: Record<string, string> = {
    en_attente: "border-l-[#F59E0B]",
    en_preparation: "border-l-[#3B82F6]",
    pret: "border-l-[#22C55E]",
    servi: "border-l-[#374151]",
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] text-white overflow-hidden">
      {/* ============================================================
          HEADER - Version responsive
          ============================================================ */}
      <header className="bg-[#161B22] border-b border-white/8 px-3 sm:px-5 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D97706]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ChefHat size={18} className="sm:size-[22px] text-[#D97706]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base text-white truncate">Cuisine · Le Palmier</h1>
              {/* 3A️⃣ : "Live" caché sur très petits écrans */}
              <span className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#22C55E]/20 flex-shrink-0">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                {!isTiny && "Live"}
              </span>
            </div>
            <p className="text-white/40 text-[10px] sm:text-xs font-mono tabular-nums">{timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* 3B️⃣ : Compteur "nouveau" simplifié sur très petits écrans */}
          {counts.en_attente > 0 && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="bg-[#F59E0B] text-black text-[10px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 whitespace-nowrap"
            >
              <Flame size={11} className="sm:size-[13px]" />
              {isTiny ? counts.en_attente : `${counts.en_attente} nouveau${counts.en_attente > 1 ? "x" : ""}`}
            </motion.span>
          )}
          <button
            onClick={onBack}
            className="text-white/40 text-[10px] sm:text-sm border border-white/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-colors whitespace-nowrap"
          >
            Quitter
          </button>
        </div>
      </header>

      {/* ============================================================
          FILTER BAR - Version responsive avec scroll horizontal
          ============================================================ */}
      <div className="bg-[#161B22]/60 border-b border-white/8 px-2 sm:px-5 py-2 sm:py-3 flex gap-1.5 sm:gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
        {(["tous", "en_attente", "en_preparation", "prets"] as KDSFilter[]).map(f => {
          const labels: Record<KDSFilter, string> = {
            tous: "Tous",
            en_attente: "En attente",
            en_preparation: "En cours",
            prets: "Prêts"
          };
          const c = counts[f];
          const activeColors: Record<KDSFilter, string> = {
            tous: "bg-white/15 text-white",
            en_attente: "bg-[#F59E0B] text-black",
            en_preparation: "bg-[#3B82F6] text-white",
            prets: "bg-[#22C55E] text-white",
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap flex-shrink-0 ${filter === f ? activeColors[f] : "bg-white/6 text-white/50 hover:bg-white/12 hover:text-white"}`}
            >
              {labels[f]}
              {c > 0 && (
                <span className={`px-1 py-0.5 rounded-full text-[10px] sm:text-xs ${filter === f ? "bg-black/20" : "bg-white/15"}`}>
                  {c}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TICKETS - Version responsive
          ============================================================ */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <ChefHat size={48} className="sm:size-[64px] mb-4 opacity-50" />
            <p className="text-lg sm:text-xl mb-1">Cuisine au calme !</p>
            <p className="text-xs sm:text-sm">Aucun ticket en attente 🧘</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {filtered.map(order => {
                const isReady = order.status === "pret";
                const border = borderMap[order.status] || "border-l-[#374151]";
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`bg-[#161B22] rounded-2xl border-l-4 ${border} flex flex-col overflow-hidden ${isReady ? "ring-1 ring-[#22C55E]/25" : ""}`}
                  >
                    {/* Ticket header */}
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-white/8 flex flex-wrap items-start justify-between gap-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                          {/* 3C️⃣ : "Table" devient "T" sur très petits écrans */}
                          <span className="text-lg sm:text-xl text-white">
                            {isTiny ? `T${order.tableNumber}` : `Table ${order.tableNumber}`}
                          </span>
                          {isReady && (
                            <span className="bg-[#22C55E]/15 text-[#22C55E] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#22C55E]/20 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                              <CheckCircle size={10} className="sm:size-[11px]" /> PRÊT
                            </span>
                          )}
                          {order.isLate && !isReady && (
                            <span className="bg-[#EF4444]/15 text-[#EF4444] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#EF4444]/20 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                              <AlertTriangle size={10} className="sm:size-[11px]" /> Retard
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="text-white/40 text-[10px] sm:text-xs flex items-center gap-1">
                            <Clock size={9} className="sm:size-[10px]" /> {order.sentAt}
                          </span>
                          <TicketTimer orderId={order.id} />
                        </div>
                      </div>
                      <span className="text-white/30 text-[10px] sm:text-xs flex-shrink-0">{order.id}</span>
                    </div>

                    {/* Items */}
                    <div className="p-3 sm:p-4 flex-1 space-y-2.5 sm:space-y-3">
                      {order.items.map(item => {
                        const isDone = item.status === "pret" || item.status === "servi";
                        return (
                          <div key={item.id} className={`flex items-start gap-1.5 sm:gap-2 transition-opacity ${isDone ? "opacity-50" : ""}`}>
                            <span className="bg-white/8 text-white/60 text-[11px] sm:text-sm px-1.5 sm:px-2 py-0.5 rounded-lg mt-0.5 flex-shrink-0 font-mono">
                              {item.quantity}×
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm sm:text-base leading-tight break-words ${isDone ? "line-through text-white/40" : "text-white"}`}>
                                {item.name}
                              </p>
                              {item.note && (
                                <p className="text-[#F59E0B] text-[10px] sm:text-xs mt-0.5 bg-[#F59E0B]/10 px-1.5 sm:px-2 py-0.5 rounded-lg inline-block break-words">
                                  ⚠ {item.note}
                                </p>
                              )}
                            </div>
                            {!isDone && (
                              <button
                                onClick={() => updateItem(order.id, item.id, item.status === "en_attente" ? "en_preparation" : "pret")}
                                className={`text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all flex-shrink-0 whitespace-nowrap active:scale-95 ${item.status === "en_attente" ? "bg-[#3B82F6]/15 text-[#60A5FA] hover:bg-[#3B82F6]/25 border border-[#3B82F6]/20" : "bg-[#22C55E]/15 text-[#4ADE80] hover:bg-[#22C55E]/25 border border-[#22C55E]/20"}`}
                              >
                                {item.status === "en_attente" ? "▶ En cours" : "✓ Prêt"}
                              </button>
                            )}
                            {isDone && <span className="text-[#22C55E]/60 text-xs px-1 sm:px-2 py-1 flex-shrink-0">✓</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
                      {isReady ? (
                        <>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[#4ADE80] text-[10px] sm:text-xs bg-[#22C55E]/8 border border-[#22C55E]/15 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl">
                            <CheckCircle size={12} className="sm:size-[13px]" /> Serveur notifié ✓
                          </div>
                          {/* 3E️⃣ : "Archiver le ticket" devient "Archiver" sur très petits écrans */}
                          <button
                            onClick={() => archiveOrder(order.id)}
                            className="w-full bg-white/6 text-white/50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {isTiny ? "Archiver" : "Archiver le ticket"}
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          {/* 3D️⃣ : Textes des boutons simplifiés sur très petits écrans */}
                          <button
                            onClick={() => updateAllItems(order.id, "en_preparation")}
                            className="bg-[#3B82F6]/12 text-[#60A5FA] border border-[#3B82F6]/20 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm hover:bg-[#3B82F6]/20 transition-colors active:scale-[0.97] truncate"
                          >
                            {isTiny ? "▶ Démarrer" : "▶ Tout démarrer"}
                          </button>
                          <button
                            onClick={() => updateAllItems(order.id, "pret")}
                            className="bg-[#22C55E]/12 text-[#4ADE80] border border-[#22C55E]/20 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm hover:bg-[#22C55E]/20 transition-colors active:scale-[0.97] truncate"
                          >
                            {isTiny ? "✓ Prêt" : "✓ Tout prêt"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}