import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Bell, Users, Clock, ChevronLeft, AlertCircle, CheckCircle2,
  PlusCircle, CreditCard, Plus, Minus, Send, X, Wifi
} from "lucide-react";
import { tables, activeOrders, menuItems, formatPrice } from "../../data/mockData";
import type { TableData, MenuItem } from "../../data/mockData";

type WaiterScreen = "dashboard" | "table_detail" | "manual_order";

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  libre:            { bg: "bg-white",          text: "text-[#9CA3AF]", border: "border-[#E5E7EB]",    dot: "bg-[#D1D5DB]",   label: "Libre" },
  occupee:          { bg: "bg-[#EFF6FF]",       text: "text-[#2563EB]", border: "border-[#BFDBFE]",   dot: "bg-[#3B82F6]",   label: "Occupée" },
  commande_attente: { bg: "bg-[#FFFBEB]",       text: "text-[#B45309]", border: "border-[#FDE68A]",   dot: "bg-[#D97706]",   label: "En attente" },
  paiement:         { bg: "bg-[#F0FDF4]",       text: "text-[#16A34A]", border: "border-[#BBF7D0]",   dot: "bg-[#22C55E]",   label: "Addition" },
  appel:            { bg: "bg-[#FEF2F2]",       text: "text-[#DC2626]", border: "border-[#FECACA]",   dot: "bg-[#EF4444]",   label: "🔔 Appel !" },
};

const itemStatusConfig: Record<string, { bg: string; text: string; label: string }> = {
  en_attente:    { bg: "bg-[#F3F4F6]",         text: "text-[#6B7280]", label: "En attente" },
  en_preparation:{ bg: "bg-[#EFF6FF]",          text: "text-[#2563EB]", label: "⚡ En préparation" },
  pret:          { bg: "bg-[#F0FDF4]",          text: "text-[#16A34A]", label: "✓ Prêt" },
  servi:         { bg: "bg-[#F9FAFB]",          text: "text-[#9CA3AF]", label: "Servi" },
};

interface CartItem { item: MenuItem; qty: number; note: string; }

export function WaiterApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<WaiterScreen>("dashboard");
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [manualCart, setManualCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [time, setTime] = useState(new Date());
  const [newOrderPulse, setNewOrderPulse] = useState(true);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate new order arriving after 6s
  useEffect(() => {
    const t = setTimeout(() => {
      toast("🔔 Nouvelle commande", {
        description: "Table 5 · 3 articles",
        action: { label: "Voir", onClick: () => {} },
        duration: 5000,
      });
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const occupiedCount = tables.filter(t => t.status !== "libre").length;
  const pendingCount = tables.filter(t => t.status === "commande_attente").length;
  const callCount = tables.filter(t => t.status === "appel").length;

  const tableOrders = selectedTable ? activeOrders.filter(o => o.tableId === selectedTable.id) : [];

  const categories = ["Tout", "Entrées", "Plats", "Grillades", "Boissons", "Desserts"];
  const filteredMenu = activeCategory === "Tout" ? menuItems : menuItems.filter(i => i.category === activeCategory);

  const addToManualCart = (item: MenuItem) => {
    setManualCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1, note: "" }];
    });
  };

  const manualTotal = manualCart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const manualCount = manualCart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ── DASHBOARD ── */}
        {screen === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="flex flex-col h-full">

            <header className="bg-white border-b border-[#E5E7EB] px-5 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D97706] rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">🌴</div>
                <div>
                  <p className="text-[#1F2937] text-sm flex items-center gap-2">
                    Service en cours
                    <span className="flex items-center gap-1 text-[#22C55E] text-xs">
                      <Wifi size={11} /> Live
                    </span>
                  </p>
                  <p className="text-[#6B7280] text-xs">{timeStr} · Fatoumata Traoré</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {callCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="bg-[#EF4444] text-white text-xs px-2.5 py-1 rounded-full"
                  >
                    {callCount} appel{callCount > 1 ? "s" : ""}
                  </motion.span>
                )}
                <button onClick={onBack} className="text-[#6B7280] text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">Quitter</button>
              </div>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 p-4 flex-shrink-0">
              {[
                { label: "Tables occupées", value: occupiedCount, of: tables.length, color: "text-[#3B82F6]", bg: "bg-[#EFF6FF] border-[#BFDBFE]" },
                { label: "Commandes en attente", value: pendingCount, color: "text-[#D97706]", bg: "bg-[#FFFBEB] border-[#FDE68A]" },
                { label: "Appels clients", value: callCount, color: callCount > 0 ? "text-[#EF4444]" : "text-[#9CA3AF]", bg: callCount > 0 ? "bg-[#FEF2F2] border-[#FECACA]" : "bg-white border-[#E5E7EB]" },
              ].map(stat => (
                <div key={stat.label} className={`rounded-xl p-3 text-center border ${stat.bg}`}>
                  <p className={`text-2xl ${stat.color}`}>
                    {stat.value}{stat.of ? <span className="text-base opacity-50">/{stat.of}</span> : ""}
                  </p>
                  <p className="text-[#6B7280] text-xs mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
              {["Terrasse", "Salle principale", "VIP"].map(zone => (
                <div key={zone}>
                  <p className="text-[#9CA3AF] text-xs mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                    {zone === "Terrasse" ? "🌿" : zone === "VIP" ? "⭐" : "🍽"} {zone}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {tables.filter(t => t.zone === zone).map((table, i) => {
                      const cfg = statusConfig[table.status];
                      const isWaiting = table.status === "commande_attente";
                      const isCall = table.status === "appel";
                      return (
                        <motion.button
                          key={table.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setSelectedTable(table); setScreen("table_detail"); }}
                          className={`relative border-2 rounded-xl p-3 text-center transition-all hover:shadow-md ${cfg.bg} ${cfg.border} cursor-pointer`}
                        >
                          {isWaiting && (
                            <motion.div
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute inset-0 rounded-xl bg-[#D97706]/8"
                            />
                          )}
                          <p className={`text-lg relative z-10 ${cfg.text}`}>{table.number}</p>
                          <p className={`text-xs relative z-10 ${cfg.text} opacity-70 mt-0.5 truncate`}>{cfg.label}</p>
                          {table.pendingOrders > 0 && (
                            <motion.span
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-[#D97706] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-20"
                            >
                              {table.pendingOrders}
                            </motion.span>
                          )}
                          {isCall && (
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                              className="absolute -top-2 -left-2 bg-[#EF4444] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-20"
                            >
                              !
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TABLE DETAIL ── */}
        {screen === "table_detail" && selectedTable && (
          <motion.div key="table_detail"
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => setScreen("dashboard")} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors">
                  <ChevronLeft size={20} className="text-[#6B7280]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#1F2937]">Table {selectedTable.number}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusConfig[selectedTable.status].bg} ${statusConfig[selectedTable.status].text} ${statusConfig[selectedTable.status].border}`}>
                      {statusConfig[selectedTable.status].label}
                    </span>
                  </div>
                  <p className="text-[#6B7280] text-xs">Zone {selectedTable.zone} · {selectedTable.capacity} pers.</p>
                </div>
              </div>
              <button className="bg-[#22C55E] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#16A34A] transition-colors">Clôturer</button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTable.hasCall && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3.5 flex items-center gap-3"
                >
                  <AlertCircle size={18} className="text-[#EF4444] flex-shrink-0" />
                  <p className="text-[#DC2626] text-sm flex-1">Le client demande à être servi</p>
                  <button className="bg-[#EF4444] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors">Traiter</button>
                </motion.div>
              )}

              {tableOrders.length === 0 ? (
                <div className="text-center py-16 text-[#9CA3AF]">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Aucune commande active</p>
                </div>
              ) : (
                tableOrders.map((order, i) => (
                  <motion.div key={order.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1F2937] text-sm">{order.id}</span>
                          {order.isLate && (
                            <span className="bg-[#FEF2F2] text-[#DC2626] text-xs px-2 py-0.5 rounded-full border border-[#FECACA]">
                              ⏱ Retard
                            </span>
                          )}
                        </div>
                        <p className="text-[#9CA3AF] text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {order.sentAt}
                          {order.clientName && <><span className="text-[#D1D5DB]">·</span> {order.clientName}</>}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="bg-[#F3F4F6] text-[#6B7280] text-xs px-2 py-0.5 rounded-lg flex-shrink-0">{item.quantity}×</span>
                            <div className="min-w-0">
                              <p className="text-[#1F2937] text-sm truncate">{item.name}</p>
                              {item.note && (
                                <p className="text-xs text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-lg mt-0.5 inline-block">⚠ {item.note}</p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${itemStatusConfig[item.status].bg} ${itemStatusConfig[item.status].text}`}>
                            {itemStatusConfig[item.status].label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => toast.success("Articles marqués comme servis", { description: `${order.id} · Table ${order.tableNumber}` })}
                        className="w-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-colors"
                      >
                        <CheckCircle2 size={15} /> Tout marquer comme servi
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-[#E5E7EB] grid grid-cols-2 gap-3 flex-shrink-0">
              <button onClick={() => setScreen("manual_order")} className="border-2 border-[#D97706] text-[#D97706] py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#FEF3C7] transition-colors">
                <PlusCircle size={16} /> Commande manuelle
              </button>
              <button className="bg-[#22C55E] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#16A34A] transition-colors">
                <CreditCard size={16} /> Paiement
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MANUAL ORDER ── */}
        {screen === "manual_order" && selectedTable && (
          <motion.div key="manual_order"
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => setScreen("table_detail")} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors">
                  <ChevronLeft size={20} className="text-[#6B7280]" />
                </button>
                <div>
                  <h2 className="text-[#1F2937]">Commande manuelle</h2>
                  <p className="text-[#6B7280] text-xs">Table {selectedTable.number}</p>
                </div>
              </div>
              {manualCount > 0 && (
                <span className="bg-[#D97706] text-white text-sm px-3 py-1 rounded-full">
                  {manualCount} art. · {formatPrice(manualTotal)}
                </span>
              )}
            </header>

            <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-[#E5E7EB] bg-white flex-shrink-0">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex-shrink-0 transition-colors ${activeCategory === cat ? "bg-[#D97706] text-white" : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
              {filteredMenu.filter(i => i.available).map((item, idx) => {
                const inCart = manualCart.find(c => c.item.id === item.id);
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={item.photo} alt={item.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0 bg-[#F3F4F6]" />
                      <div className="min-w-0">
                        <p className="text-[#1F2937] text-sm truncate">{item.name}</p>
                        <p className="text-[#D97706] text-xs">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-xl p-0.5">
                        <button onClick={() => setManualCart(p => p.map(c => c.item.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}
                          className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <Minus size={13} className="text-[#6B7280]" />
                        </button>
                        <span className="text-[#1F2937] w-5 text-center text-sm">{inCart.qty}</span>
                        <button onClick={() => addToManualCart(item)} className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center">
                          <Plus size={13} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToManualCart(item)}
                        className="w-9 h-9 bg-[#D97706]/10 text-[#D97706] rounded-lg flex items-center justify-center hover:bg-[#D97706]/20 transition-colors">
                        <Plus size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {manualCount > 0 && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB]"
                >
                  <button
                    onClick={() => {
                      toast.success("Commande envoyée en cuisine", {
                        description: `Table ${selectedTable.number} · ${manualCount} articles · ${formatPrice(manualTotal)}`,
                      });
                      setManualCart([]);
                      setScreen("table_detail");
                    }}
                    className="w-full bg-[#D97706] text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F59E0B] transition-colors shadow-[0_4px_16px_rgba(217,119,6,0.3)]"
                  >
                    <Send size={18} /> Envoyer en cuisine — {formatPrice(manualTotal)}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
