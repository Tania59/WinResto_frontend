import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, ChefHat, Clock, Flame } from "lucide-react";
import { activeOrders } from "../../data/mockData";
import type { Order, OrderItemStatus } from "../../data/mockData";

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
    <span className={`text-xs px-2 py-0.5 rounded-lg font-mono tabular-nums ${isLate ? "bg-[#EF4444]/20 text-[#EF4444]" : isWarning ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-white/10 text-white/50"}`}>
      {isLate && "⚠ "}{display}
    </span>
  );
}

export function KitchenApp({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<KDSFilter>("tous");
  const [orders, setOrders] = useState<Order[]>(activeOrders);
  const [time, setTime] = useState(new Date());

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
      {/* Header */}
      <header className="bg-[#161B22] border-b border-white/8 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D97706]/20 rounded-xl flex items-center justify-center">
            <ChefHat size={22} className="text-[#D97706]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white">Cuisine · Le Palmier</h1>
              <span className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] text-xs px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Live
              </span>
            </div>
            <p className="text-white/40 text-xs font-mono tabular-nums">{timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {counts.en_attente > 0 && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
              className="bg-[#F59E0B] text-black text-sm px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <Flame size={13} /> {counts.en_attente} nouveau{counts.en_attente > 1 ? "x" : ""}
            </motion.span>
          )}
          <button onClick={onBack} className="text-white/40 text-sm border border-white/15 px-3 py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-colors">Quitter</button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="bg-[#161B22]/60 border-b border-white/8 px-5 py-3 flex gap-2 flex-shrink-0">
        {(["tous", "en_attente", "en_preparation", "prets"] as KDSFilter[]).map(f => {
          const labels: Record<KDSFilter, string> = { tous: "Tous", en_attente: "En attente", en_preparation: "En cours", prets: "Prêts" };
          const c = counts[f];
          const activeColors: Record<KDSFilter, string> = {
            tous: "bg-white/15 text-white",
            en_attente: "bg-[#F59E0B] text-black",
            en_preparation: "bg-[#3B82F6] text-white",
            prets: "bg-[#22C55E] text-white",
          };
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${filter === f ? activeColors[f] : "bg-white/6 text-white/50 hover:bg-white/12 hover:text-white"}`}>
              {labels[f]}
              {c > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === f ? "bg-black/20" : "bg-white/15"}`}>{c}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tickets */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <ChefHat size={64} className="mb-4 opacity-50" />
            <p className="text-xl mb-1">Cuisine au calme !</p>
            <p className="text-sm">Aucun ticket en attente 🧘</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="px-4 pt-4 pb-3 border-b border-white/8 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-xl">Table {order.tableNumber}</span>
                          {isReady && (
                            <span className="bg-[#22C55E]/15 text-[#22C55E] text-xs px-2 py-0.5 rounded-full border border-[#22C55E]/20 flex items-center gap-1">
                              <CheckCircle size={11} /> PRÊT
                            </span>
                          )}
                          {order.isLate && !isReady && (
                            <span className="bg-[#EF4444]/15 text-[#EF4444] text-xs px-2 py-0.5 rounded-full border border-[#EF4444]/20 flex items-center gap-1">
                              <AlertTriangle size={11} /> Retard
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <Clock size={10} /> {order.sentAt}
                          </span>
                          <TicketTimer orderId={order.id} />
                        </div>
                      </div>
                      <span className="text-white/30 text-xs">{order.id}</span>
                    </div>

                    {/* Items */}
                    <div className="p-4 flex-1 space-y-3">
                      {order.items.map(item => {
                        const isDone = item.status === "pret" || item.status === "servi";
                        return (
                          <div key={item.id} className={`flex items-start gap-2 transition-opacity ${isDone ? "opacity-50" : ""}`}>
                            <span className="bg-white/8 text-white/60 text-sm px-2 py-0.5 rounded-lg mt-0.5 flex-shrink-0 font-mono">{item.quantity}×</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-tight ${isDone ? "line-through text-white/40" : "text-white"}`}>{item.name}</p>
                              {item.note && (
                                <p className="text-[#F59E0B] text-xs mt-0.5 bg-[#F59E0B]/10 px-2 py-0.5 rounded-lg inline-block">⚠ {item.note}</p>
                              )}
                            </div>
                            {!isDone && (
                              <button
                                onClick={() => updateItem(order.id, item.id, item.status === "en_attente" ? "en_preparation" : "pret")}
                                className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0 whitespace-nowrap active:scale-95 ${item.status === "en_attente" ? "bg-[#3B82F6]/15 text-[#60A5FA] hover:bg-[#3B82F6]/25 border border-[#3B82F6]/20" : "bg-[#22C55E]/15 text-[#4ADE80] hover:bg-[#22C55E]/25 border border-[#22C55E]/20"}`}>
                                {item.status === "en_attente" ? "▶ En cours" : "✓ Prêt"}
                              </button>
                            )}
                            {isDone && <span className="text-[#22C55E]/60 text-xs px-2 py-1 flex-shrink-0">✓</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="px-4 pb-4 space-y-2">
                      {isReady ? (
                        <>
                          <div className="flex items-center gap-2 text-[#4ADE80] text-xs bg-[#22C55E]/8 border border-[#22C55E]/15 px-3 py-2 rounded-xl">
                            <CheckCircle size={13} /> Serveur notifié ✓
                          </div>
                          <button onClick={() => archiveOrder(order.id)}
                            className="w-full bg-white/6 text-white/50 py-2.5 rounded-xl text-sm hover:bg-white/10 hover:text-white transition-colors">
                            Archiver le ticket
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => updateAllItems(order.id, "en_preparation")}
                            className="bg-[#3B82F6]/12 text-[#60A5FA] border border-[#3B82F6]/20 py-2.5 rounded-xl text-sm hover:bg-[#3B82F6]/20 transition-colors active:scale-[0.97]">
                            ▶ Tout démarrer
                          </button>
                          <button
                            onClick={() => updateAllItems(order.id, "pret")}
                            className="bg-[#22C55E]/12 text-[#4ADE80] border border-[#22C55E]/20 py-2.5 rounded-xl text-sm hover:bg-[#22C55E]/20 transition-colors active:scale-[0.97]">
                            ✓ Tout prêt
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
