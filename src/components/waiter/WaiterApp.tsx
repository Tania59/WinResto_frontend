import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Bell, Users, Clock, ChevronLeft, AlertCircle, CheckCircle2,
  PlusCircle, CreditCard, Plus, Minus, Send, X, Wifi,
  Search, Utensils, Soup, Pizza, Beer, Cake
} from "lucide-react";
import { tables, activeOrders, menuItems, formatPrice } from "../../data/mockData";
import type { TableData, MenuItem } from "../../data/mockData";

type WaiterScreen = "dashboard" | "table_detail" | "manual_order";

const statusConfig = {
  libre: {
    bg: "bg-white",
    text: "text-[#6B7280]",
    border: "border-[#E5E7EB]",
    dot: "bg-[#9CA3AF]",
    label: "Libre",
    icon: <div className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
  },
  occupee: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#3B82F6]",
    label: "Occupée",
    icon: <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
  },
  commande_attente: {
    bg: "bg-[#FFFBEB]",
    text: "text-[#B45309]",
    border: "border-[#FDE68A]",
    dot: "bg-[#D97706]",
    label: "En attente",
    icon: <Clock size={12} className="text-[#D97706]" />
  },
  paiement: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#059669]",
    border: "border-[#A7F3D0]",
    dot: "bg-[#10B981]",
    label: "Addition",
    icon: <CreditCard size={12} className="text-[#059669]" />
  },
  appel: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#DC2626]",
    border: "border-[#FECACA]",
    dot: "bg-[#EF4444]",
    label: "Appel !",
    icon: <Bell size={12} className="text-[#DC2626]" />
  },
};

const itemStatusConfig = {
  en_attente:    { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", label: "En attente" },
  en_preparation: { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]", label: "En préparation" },
  pret:          { bg: "bg-[#ECFDF5]", text: "text-[#059669]", label: "Prêt" },
  servi:         { bg: "bg-[#F9FAFB]", text: "text-[#9CA3AF]", label: "Servi" },
};

interface CartItem { item: MenuItem; qty: number; note: string; }

export function WaiterApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<WaiterScreen>("dashboard");
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [manualCart, setManualCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

  const categories = [
    { key: "Tout", icon: <Utensils size={14} /> },
    { key: "Entrées", icon: <Soup size={14} /> },
    { key: "Plats", icon: <Pizza size={14} /> },
    { key: "Grillades", icon: "🌴" }, 
    { key: "Boissons", icon: <Beer size={14} /> },
    { key: "Desserts", icon: <Cake size={14} /> },
  ];

  const filteredMenu = menuItems.filter(item => {
    const matchCategory = activeCategory === "Tout" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

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
    <div className="flex flex-col h-full bg-[#0F172A] overflow-hidden font-sans antialiased">
      <AnimatePresence mode="wait">
       
        {screen === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0F172A] rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
                  🌴
                </div>
                <div>
                  <p className="text-[#0F172A] text-xs sm:text-sm font-semibold flex items-center gap-2">
                    Service en cours
                    <span className="flex items-center gap-1 text-[#10B981] text-[10px] sm:text-xs font-normal">
                      <Wifi size={11} /> Live
                    </span>
                  </p>
                  <p className="text-[#64748B] text-[10px] sm:text-xs">{timeStr} · Fatoumata Traoré</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {callCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-[#EF4444] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium flex items-center gap-1"
                  >
                    <Bell size={12} /> {callCount} appel{callCount > 1 ? "s" : ""}
                  </motion.span>
                )}
                <button
                  onClick={onBack}
                  className="text-[#64748B] text-[10px] sm:text-xs border border-[#E5E7EB] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-[#32CD32] transition-colors"
                >
                  Quitter
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 sm:p-4 flex-shrink-0">
              {[
                { label: "Tables occupées", value: occupiedCount, of: tables.length, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]", border: "border-[#BFDBFE]" },
                { label: "Commandes en attente", value: pendingCount, color: "text-[#B45309]", bg: "bg-[#FFFBEB]", border: "border-[#FDE68A]" },
                { label: "Appels", value: callCount, color: callCount > 0 ? "text-[#DC2626]" : "text-[#94A3B8]", bg: callCount > 0 ? "bg-[#FEF2F2]" : "bg-white", border: callCount > 0 ? "border-[#FECACA]" : "border-[#E5E7EB]" },
              ].map(stat => (
                <div key={stat.label} className={`rounded-xl p-3 text-center border ${stat.bg} ${stat.border} shadow-sm`}>
                  <p className={`text-xl sm:text-2xl font-semibold ${stat.color}`}>
                    {stat.value}{stat.of && <span className="text-base font-normal opacity-50">/{stat.of}</span>}
                  </p>
                  <p className="text-[#64748B] text-[10px] sm:text-xs mt-0.5 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 space-y-5">
              {["Terrasse", "Salle principale", "VIP"].map(zone => {
                const zoneTables = tables.filter(t => t.zone === zone);
                if (zoneTables.length === 0) return null;
                return (
                  <div key={zone}>
                    <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      {zone === "Terrasse" ? "🌿" : zone === "VIP" ? "⭐" : "🍽"} {zone}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                      {zoneTables.map((table, i) => {
                        const cfg = statusConfig[table.status];
                        return (
                          <motion.button
                            key={table.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setSelectedTable(table); setScreen("table_detail"); }}
                            className={`relative border-2 rounded-xl p-3 sm:p-4 text-center transition-all hover:shadow-md ${cfg.bg} ${cfg.border} cursor-pointer`}
                            aria-label={`Table ${table.number} - ${cfg.label}`}
                            title={`Table ${table.number} - ${cfg.label}`}
                          >
                            {table.status === "commande_attente" && (
                              <motion.div
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                                className="absolute inset-0 rounded-xl bg-[#D97706]/10"
                              />
                            )}
                            <div className="relative z-10">
                              <p className={`text-base sm:text-lg font-bold ${cfg.text}`}>{table.number}</p>
                              <div className="flex items-center justify-center gap-1 mt-0.5">
                                {cfg.icon}
                                <p className={`text-[10px] sm:text-xs ${cfg.text} opacity-80`}>{cfg.label}</p>
                              </div>
                              {table.pendingOrders > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 bg-[#D97706] text-white text-[10px] sm:text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                                >
                                  {table.pendingOrders}
                                </motion.span>
                              )}
                              {table.status === "appel" && (
                                <motion.span
                                  animate={{ scale: [1, 1.15, 1] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                  className="absolute -top-2 -left-2 bg-[#EF4444] text-white text-[10px] sm:text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                                >
                                  !
                                </motion.span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        
        {screen === "table_detail" && selectedTable && (
          <motion.div
            key="table_detail"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScreen("dashboard")}
                  aria-label="Retour au tableau de bord"
                  title="Retour au tableau de bord"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
                >
                  <ChevronLeft size={18} className="text-[#64748B]" />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[#0F172A] font-semibold text-sm sm:text-base">Table {selectedTable.number}</h2>
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium ${statusConfig[selectedTable.status].bg} ${statusConfig[selectedTable.status].text} ${statusConfig[selectedTable.status].border}`}>
                      {statusConfig[selectedTable.status].label}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-[10px] sm:text-xs">Zone {selectedTable.zone} · {selectedTable.capacity} pers.</p>
                </div>
              </div>
              <button
                className="bg-[#32CD32] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#059669] transition-colors shadow-sm"
              >
                Clôturer
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              {selectedTable.hasCall && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 flex flex-wrap items-center gap-3"
                >
                  <AlertCircle size={18} className="text-[#DC2626] flex-shrink-0" />
                  <p className="text-[#DC2626] text-sm flex-1 font-medium">Le client demande à être servi</p>
                  <button className="bg-[#DC2626] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#B91C1C] transition-colors">
                    Traiter
                  </button>
                </motion.div>
              )}

              {tableOrders.length === 0 ? (
                <div className="text-center py-12 sm:py-16 text-white/40">
                  <Users size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucune commande active</p>
                </div>
              ) : (
                tableOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm"
                  >
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-[#F1F5F9] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#0F172A] text-xs sm:text-sm font-medium">{order.id}</span>
                          {order.isLate && (
                            <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-[#FECACA] font-medium">
                              ⏱ Retard
                            </span>
                          )}
                        </div>
                        <p className="text-[#94A3B8] text-[10px] sm:text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {order.sentAt}
                          {order.clientName && <><span className="text-[#CBD5E1]">·</span> {order.clientName}</>}
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-full">
                        {order.items.length} articles
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="bg-[#F1F5F9] text-[#475569] text-[10px] sm:text-xs px-2 py-0.5 rounded-lg flex-shrink-0 font-medium">
                              {item.quantity}×
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[#0F172A] text-xs sm:text-sm truncate">{item.name}</p>
                              {item.note && (
                                <p className="text-[10px] sm:text-xs text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-lg mt-0.5 inline-block">
                                  ⚠ {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${itemStatusConfig[item.status].bg} ${itemStatusConfig[item.status].text}`}>
                            {itemStatusConfig[item.status].label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <button
                        onClick={() => toast.success("Articles marqués comme servis", { description: `${order.id} · Table ${order.tableNumber}` })}
                        className="w-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-colors font-medium"
                      >
                        <CheckCircle2 size={15} /> Tout marquer comme servi
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-3 sm:p-4 bg-white border-t border-[#E5E7EB] grid grid-cols-2 gap-3 flex-shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
              <button
                onClick={() => setScreen("manual_order")}
                className="border-2 border-[#32CD32] text-[#1A1A1A] py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium hover:bg-[#32CD32] transition-colors"
              >
                <PlusCircle size={16} /> Commande manuelle
              </button>
              <button
                className="bg-[#32CD32] text-white py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium hover:bg-[#32CD32] transition-colors shadow-sm"
              >
                <CreditCard size={16} /> Paiement
              </button>
            </div>
          </motion.div>
        )}

       
        {screen === "manual_order" && selectedTable && (
          <motion.div
            key="manual_order"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full relative"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScreen("table_detail")}
                  aria-label="Retour à la table"
                  title="Retour à la table"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
                >
                  <ChevronLeft size={18} className="text-[#64748B]" />
                </button>
                <div>
                  <h2 className="text-[#0F172A] font-semibold text-sm sm:text-base">Commande manuelle</h2>
                  <p className="text-[#64748B] text-[10px] sm:text-xs">Table {selectedTable.number}</p>
                </div>
              </div>
              {manualCount > 0 && (
                <span className="bg-[#2563EB] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                  {manualCount} art. · {formatPrice(manualTotal)}
                </span>
              )}
            </header>

            <div className="bg-white border-b border-[#E5E7EB] px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0 space-y-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[#F1F5F9] border border-[#E5E7EB] rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map(({ key, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 transition-colors ${
                      activeCategory === key
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {icon} {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 pb-36 sm:pb-32 md:pb-28">
              {filteredMenu.filter(i => i.available).length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <p className="text-sm">Aucun article disponible</p>
                </div>
              ) : (
                filteredMenu.filter(i => i.available).map((item, idx) => {
                  const inCart = manualCart.find(c => c.item.id === item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="bg-white rounded-xl p-2 sm:p-3 border border-[#E5E7EB] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl flex-shrink-0 bg-[#F1F5F9]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[#0F172A] text-xs sm:text-sm font-medium truncate">{item.name}</p>
                          <p className="text-[#2563EB] text-[10px] sm:text-xs font-semibold">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-1.5 bg-[#F1F5F9] rounded-xl p-0.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setManualCart(p =>
                                p.map(c => c.item.id === item.id ? { ...c, qty: c.qty - 1 } : c)
                                 .filter(c => c.qty > 0)
                              );
                            }}
                            aria-label={`Retirer une portion de ${item.name}`}
                            title={`Retirer une portion de ${item.name}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                          >
                            <Minus size={13} className="text-[#64748B]" />
                          </button>
                          <span className="text-[#0F172A] w-5 text-center text-xs sm:text-sm font-medium">{inCart.qty}</span>
                          <button
                            onClick={() => addToManualCart(item)}
                            aria-label={`Ajouter une portion de ${item.name}`}
                            title={`Ajouter une portion de ${item.name}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2563EB] rounded-lg flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                          >
                            <Plus size={13} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToManualCart(item)}
                          aria-label={`Ajouter ${item.name}`}
                          title={`Ajouter ${item.name}`}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-[#EFF6FF] text-[#2563EB] rounded-lg flex items-center justify-center hover:bg-[#BFDBFE] transition-colors flex-shrink-0"
                        >
                          <Plus size={16} />
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            <AnimatePresence>
              {manualCount > 0 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
                >
                  <button
                    onClick={() => {
                      toast.success("Commande envoyée en cuisine", {
                        description: `Table ${selectedTable.number} · ${manualCount} articles · ${formatPrice(manualTotal)}`,
                      });
                      setManualCart([]);
                      setScreen("table_detail");
                    }}
                    className="w-full bg-[#2563EB] text-white py-3 sm:py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.25)] font-medium text-sm sm:text-base"
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