import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  LayoutDashboard, UtensilsCrossed, QrCode, Users, BarChart3,
  Settings, TrendingUp, ShoppingBag, Clock, Table2, Plus,
  Edit2, Trash2, ToggleLeft, ToggleRight, Download, MapPin,
  ChevronRight, X, Check, Upload, AlertCircle, Menu, Eye
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  menuItems, tables, staff, weeklyRevenue, hourlyOrders,
  topDishes, formatPrice, restaurant, categories
} from "../../data/mockData";
import type { MenuItem, StaffMember } from "../../data/mockData";

type AdminSection = "dashboard" | "menu" | "tables" | "stats" | "staff" | "geofencing";

const navItems: { key: AdminSection; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "tables", label: "Tables & QR", icon: QrCode },
  { key: "staff", label: "Staff", icon: Users },
  { key: "stats", label: "Statistiques", icon: BarChart3 },
  { key: "geofencing", label: "Géofencing", icon: MapPin },
];

const roleColors: Record<string, string> = {
  admin: "bg-[#D97706]/10 text-[#D97706]",
  serveur: "bg-[#3B82F6]/10 text-[#3B82F6]",
  cuisine: "bg-[#22C55E]/10 text-[#22C55E]",
};
const roleLabels: Record<string, string> = { admin: "Admin", serveur: "Serveur", cuisine: "Cuisine" };

const tableStatusColors: Record<string, string> = {
  libre: "bg-[#F3F4F6] text-[#6B7280]",
  occupee: "bg-[#3B82F6]/10 text-[#3B82F6]",
  commande_attente: "bg-[#D97706]/10 text-[#D97706]",
  paiement: "bg-[#22C55E]/10 text-[#22C55E]",
  appel: "bg-[#EF4444]/10 text-[#EF4444]",
};
const tableStatusLabels: Record<string, string> = { libre: "Libre", occupee: "Occupée", commande_attente: "Attente", paiement: "Addition", appel: "Appel" };

export function AdminApp({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuList, setMenuList] = useState<MenuItem[]>(menuItems);
  const [staffList, setStaffList] = useState<StaffMember[]>(staff);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuFilter, setMenuFilter] = useState("Tout");
  const [radius, setRadius] = useState(150);
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [statsRange, setStatsRange] = useState("7j");
  const [serviceOpen, setServiceOpen] = useState(true);
  const [adminTime, setAdminTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setAdminTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const adminTimeStr = adminTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const toggleAvailability = (id: number) => {
    setMenuList(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
    const item = menuList.find(i => i.id === id);
    if (item) toast(item.available ? `"${item.name}" marqué indisponible` : `"${item.name}" remis disponible`, { duration: 2000 });
  };

  const todayRevenue = weeklyRevenue[weeklyRevenue.length - 1].revenue;
  const todayOrders = weeklyRevenue[weeklyRevenue.length - 1].orders;
  const avgCart = Math.round(todayRevenue / todayOrders);
  const occupiedTables = tables.filter(t => t.status !== "libre").length;

  const filteredMenu = menuFilter === "Tout" ? menuList : menuList.filter(i => i.category === menuFilter);
  const maxSales = topDishes[0].sold;

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-16"} bg-white border-r border-[#E5E7EB] flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden`}>
        <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🌴</span>
          {sidebarOpen && <div className="min-w-0"><p className="text-[#1F2937] truncate">Le Palmier</p><p className="text-[#6B7280] text-xs">Back-office</p></div>}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${section === key ? "bg-[#D97706]/10 text-[#D97706]" : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]"}`}>
              {section === key && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D97706] rounded-r-full" />}
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-[#E5E7EB]">
          <button onClick={onBack} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors`}>
            <ChevronRight size={18} className="flex-shrink-0 rotate-180" />
            {sidebarOpen && <span>Quitter</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <Menu size={18} className="text-[#6B7280]" />
            </button>
            <div>
              <h1 className="text-[#1F2937]">Bonjour, Djidjoho 👋</h1>
              <p className="text-[#6B7280] text-sm">Dim. 14 juin 2026 · {adminTimeStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setServiceOpen(!serviceOpen);
                toast(serviceOpen ? "Service fermé" : "Service ouvert", {
                  description: serviceOpen ? "Les clients ne peuvent plus commander" : "Les commandes sont acceptées",
                });
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${serviceOpen ? "bg-[#22C55E]/10 text-[#16A34A] border-[#22C55E]/20" : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"}`}
            >
              <span className={`w-2 h-2 rounded-full ${serviceOpen ? "bg-[#22C55E] animate-pulse" : "bg-[#9CA3AF]"}`} />
              {serviceOpen ? "Service ouvert" : "Service fermé"}
            </button>
            <div className="w-9 h-9 bg-[#D97706] rounded-full flex items-center justify-center text-white text-sm">DM</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ── DASHBOARD ── */}
          {section === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "CA du jour", value: formatPrice(todayRevenue), icon: TrendingUp, color: "text-[#D97706]", bg: "bg-[#D97706]/10" },
                  { label: "Commandes", value: todayOrders, icon: ShoppingBag, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
                  { label: "Panier moyen", value: formatPrice(avgCart), icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
                  { label: "Tables occupées", value: `${occupiedTables}/${tables.length}`, icon: Table2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
                ].map((kpi, i) => (
                  <motion.div key={kpi.label}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#6B7280] text-sm">{kpi.label}</span>
                      <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                        <kpi.icon size={18} className={kpi.color} />
                      </div>
                    </div>
                    <p className={`text-2xl ${kpi.color}`}>{kpi.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">CA de la semaine</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => [formatPrice(v), "CA"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }} />
                      <Line type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2.5} dot={{ fill: "#D97706", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">Plats les plus vendus</h3>
                  <div className="space-y-3">
                    {topDishes.map((dish, i) => (
                      <div key={dish.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[#6B7280] text-sm w-5">{i + 1}.</span>
                            <span className="text-[#1F2937] text-sm">{dish.name}</span>
                          </div>
                          <span className="text-[#6B7280] text-sm">{dish.sold} vendus</span>
                        </div>
                        <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D97706] rounded-full transition-all" style={{ width: `${(dish.sold / maxSales) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#1F2937]">Activité récente (2h)</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { time: "20:05", table: 15, item: "3× Jollof rice, 4× Eau minérale", status: "En attente", statusColor: "bg-[#F59E0B]/10 text-[#F59E0B]" },
                    { time: "19:58", table: 11, item: "2× Atiéké poisson, 2× Jus gingembre", status: "En prép.", statusColor: "bg-[#3B82F6]/10 text-[#3B82F6]" },
                    { time: "19:45", table: 7, item: "3× Jollof rice, 1× Soupe poisson", status: "En attente", statusColor: "bg-[#F59E0B]/10 text-[#F59E0B]" },
                    { time: "19:32", table: 2, item: "2× Riz Poulet DG, 2× Bissap", status: "En prép.", statusColor: "bg-[#3B82F6]/10 text-[#3B82F6]" },
                    { time: "19:15", table: 4, item: "1× Tilapia, 2× Brochettes, 2× Bière", status: "En prép.", statusColor: "bg-[#3B82F6]/10 text-[#3B82F6]" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[#6B7280] text-sm w-12">{row.time}</span>
                        <span className="bg-[#D97706]/10 text-[#D97706] text-sm px-2 py-0.5 rounded-lg">T.{row.table}</span>
                        <span className="text-[#6B7280] text-sm">{row.item}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${row.statusColor}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MENU ── */}
          {section === "menu" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Gestion du menu</h2>
                <button onClick={() => { setEditingItem(null); setShowMenuModal(true); }}
                  className="bg-[#D97706] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#F59E0B] transition-colors">
                  <Plus size={16} /> Ajouter un plat
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setMenuFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${menuFilter === cat ? "bg-[#D97706] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D97706]"}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="text-left px-4 py-3 text-[#6B7280] text-sm">Plat</th>
                        <th className="text-left px-4 py-3 text-[#6B7280] text-sm hidden md:table-cell">Catégorie</th>
                        <th className="text-right px-4 py-3 text-[#6B7280] text-sm">Prix</th>
                        <th className="text-center px-4 py-3 text-[#6B7280] text-sm">Badges</th>
                        <th className="text-center px-4 py-3 text-[#6B7280] text-sm">Dispo</th>
                        <th className="text-center px-4 py-3 text-[#6B7280] text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenu.map(item => (
                        <tr key={item.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={item.photo} alt={item.name} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                              <div>
                                <p className="text-[#1F2937] text-sm">{item.name}</p>
                                <p className="text-[#6B7280] text-xs line-clamp-1">{item.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full text-xs">{item.category}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-[#D97706] text-sm whitespace-nowrap">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-center flex-wrap">
                              {item.badges.includes("vegetarian") && <span className="text-xs">🌿</span>}
                              {item.badges.includes("spicy") && <span className="text-xs">🌶</span>}
                              {item.badges.includes("popular") && <span className="text-xs">⭐</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => toggleAvailability(item.id)}
                              className={`transition-colors ${item.available ? "text-[#22C55E]" : "text-[#9CA3AF]"}`}>
                              {item.available ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => { setEditingItem(item); setShowMenuModal(true); }} className="p-1.5 text-[#6B7280] hover:text-[#D97706] hover:bg-[#D97706]/10 rounded-lg transition-colors">
                                <Edit2 size={15} />
                              </button>
                              <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABLES & QR ── */}
          {section === "tables" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Tables & QR codes</h2>
                <button className="bg-[#D97706] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#F59E0B] transition-colors">
                  <Plus size={16} /> Ajouter une table
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map(table => (
                  <div key={table.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[#1F2937]">Table {table.number}</p>
                        <p className="text-[#6B7280] text-sm">{table.zone} · {table.capacity} pers.</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${tableStatusColors[table.status]}`}>{tableStatusLabels[table.status]}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowQRModal(table.number)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 rounded-lg text-sm hover:border-[#D97706] hover:text-[#D97706] transition-colors flex items-center justify-center gap-1">
                        <QrCode size={14} /> Voir QR
                      </button>
                      <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 rounded-lg text-sm hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors flex items-center justify-center gap-1">
                        <Edit2 size={14} /> Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STATS ── */}
          {section === "stats" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Statistiques</h2>
                <div className="flex items-center gap-2">
                  {["Aujourd'hui", "7j", "30j"].map(r => (
                    <button key={r} onClick={() => setStatsRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${statsRange === r ? "bg-[#D97706] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280]"}`}>
                      {r}
                    </button>
                  ))}
                  <button className="border border-[#E5E7EB] text-[#6B7280] px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:border-[#D97706] transition-colors">
                    <Download size={14} /> Exporter CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "CA total", value: formatPrice(weeklyRevenue.reduce((s, d) => s + d.revenue, 0)), color: "text-[#D97706]" },
                  { label: "Commandes", value: weeklyRevenue.reduce((s, d) => s + d.orders, 0), color: "text-[#3B82F6]" },
                  { label: "Panier moyen", value: formatPrice(4823), color: "text-[#F59E0B]" },
                  { label: "Heure de pointe", value: "20h–21h", color: "text-[#22C55E]" },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-[#6B7280] text-sm mb-2">{kpi.label}</p>
                    <p className={`text-xl ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">CA par jour</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => [formatPrice(v), "CA"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }} />
                      <Bar dataKey="revenue" fill="#D97706" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">Commandes par heure</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }} />
                      <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                <h3 className="text-[#1F2937] mb-4">Top plats — classement</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        <th className="text-left pb-3 text-[#6B7280] text-sm">#</th>
                        <th className="text-left pb-3 text-[#6B7280] text-sm">Plat</th>
                        <th className="text-right pb-3 text-[#6B7280] text-sm">Qté vendue</th>
                        <th className="text-right pb-3 text-[#6B7280] text-sm">CA généré</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDishes.map((d, i) => (
                        <tr key={d.name} className="border-b border-[#F9FAFB]">
                          <td className="py-2.5 text-[#D97706]">{i + 1}</td>
                          <td className="py-2.5 text-[#1F2937] text-sm">{d.name}</td>
                          <td className="py-2.5 text-right text-[#6B7280] text-sm">{d.sold}</td>
                          <td className="py-2.5 text-right text-[#D97706] text-sm">{formatPrice(d.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── STAFF ── */}
          {section === "staff" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Gestion du staff</h2>
                <button onClick={() => setShowStaffModal(true)} className="bg-[#D97706] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#F59E0B] transition-colors">
                  <Plus size={16} /> Inviter un membre
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      <th className="text-left px-5 py-3 text-[#6B7280] text-sm">Membre</th>
                      <th className="text-left px-5 py-3 text-[#6B7280] text-sm hidden md:table-cell">Rôle</th>
                      <th className="text-left px-5 py-3 text-[#6B7280] text-sm hidden lg:table-cell">Dernière connexion</th>
                      <th className="text-center px-5 py-3 text-[#6B7280] text-sm">Statut</th>
                      <th className="text-center px-5 py-3 text-[#6B7280] text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(member => (
                      <tr key={member.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#D97706]/20 rounded-full flex items-center justify-center text-[#D97706] text-sm flex-shrink-0">
                              {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-[#1F2937] text-sm">{member.name}</p>
                              <p className="text-[#6B7280] text-xs">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${roleColors[member.role]}`}>{roleLabels[member.role]}</span>
                        </td>
                        <td className="px-5 py-3.5 text-[#6B7280] text-sm hidden lg:table-cell">{member.lastSeen}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button onClick={() => setStaffList(prev => prev.map(m => m.id === member.id ? { ...m, active: !m.active } : m))}
                            className={`text-sm transition-colors ${member.active ? "text-[#22C55E]" : "text-[#9CA3AF]"}`}>
                            {member.active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 text-[#6B7280] hover:text-[#D97706] rounded-lg transition-colors"><Edit2 size={14} /></button>
                            <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── GEOFENCING ── */}
          {section === "geofencing" && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-[#1F2937]">Zone de service — Géofencing</h2>
              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-[#e8f4e8] to-[#d4e8d4]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-2 border-[#D97706]/40 bg-[#D97706]/5 flex items-center justify-center"
                        style={{ width: `${radius * 0.64}px`, height: `${radius * 0.64}px` }}>
                        <div className="w-8 h-8 bg-[#D97706] rounded-full flex items-center justify-center shadow-lg">
                          <MapPin size={18} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-[#1F2937] border border-[#E5E7EB]">
                    📍 Avenue Jean-Paul II, Cotonou
                  </div>
                </div>
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[#1F2937] text-sm">Rayon autorisé</label>
                      <span className="text-[#D97706] text-sm">{radius} mètres</span>
                    </div>
                    <input type="range" min={50} max={500} step={10} value={radius} onChange={e => setRadius(Number(e.target.value))}
                      className="w-full accent-[#D97706]" />
                    <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                      <span>50m</span><span>500m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                    <div>
                      <p className="text-[#1F2937] text-sm">Activer la vérification de présence</p>
                      <p className="text-[#6B7280] text-xs mt-0.5">Les clients devront autoriser leur localisation</p>
                    </div>
                    <button onClick={() => setGeoEnabled(!geoEnabled)}
                      className={`transition-colors ${geoEnabled ? "text-[#22C55E]" : "text-[#9CA3AF]"}`}>
                      {geoEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>

                  {geoEnabled && (
                    <div className="flex items-start gap-2 text-[#6B7280] text-xs bg-[#FEF3C7] text-[#92400E] p-3 rounded-lg">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      En activant cette option, vos clients devront autoriser la localisation pour passer commande.
                    </div>
                  )}

                  <button
                    onClick={() => toast.success("Géofencing sauvegardé", { description: `Rayon : ${radius}m · ${geoEnabled ? "Activé" : "Désactivé"}` })}
                    className="bg-[#D97706] text-white px-6 py-3 rounded-xl hover:bg-[#F59E0B] transition-colors">
                    Sauvegarder les paramètres
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* QR Modal */}
      {showQRModal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1F2937]">QR Code — Table {showQRModal}</h3>
              <button onClick={() => setShowQRModal(null)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg"><X size={18} /></button>
            </div>
            <div className="w-48 h-48 bg-[#1F2937] rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="grid grid-cols-7 gap-0.5 p-3">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center text-white text-xs">🌴</div>
              </div>
            </div>
            <p className="text-[#6B7280] text-sm mb-4">lepalmier.winresto.com/table/{showQRModal}</p>
            <div className="flex gap-3">
              <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2.5 rounded-xl text-sm hover:border-[#D97706] transition-colors flex items-center justify-center gap-1.5">
                <Download size={15} /> Télécharger
              </button>
              <button className="flex-1 bg-[#D97706] text-white py-2.5 rounded-xl text-sm hover:bg-[#F59E0B] transition-colors">Imprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Add/Edit Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1F2937]">{editingItem ? "Modifier le plat" : "Ajouter un plat"}</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#D97706] transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-[#9CA3AF] mb-2" />
                <p className="text-[#6B7280] text-sm">Glisser-déposer une photo ou cliquer</p>
              </div>
              <div>
                <label className="text-[#6B7280] text-sm block mb-1.5">Nom du plat</label>
                <input defaultValue={editingItem?.name} placeholder="Ex: Riz au Poulet DG" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm block mb-1.5">Description</label>
                <textarea defaultValue={editingItem?.description} rows={2} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#6B7280] text-sm block mb-1.5">Catégorie</label>
                  <select defaultValue={editingItem?.category} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm bg-white">
                    {["Entrées", "Plats", "Grillades", "Boissons", "Desserts"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7280] text-sm block mb-1.5">Prix (FCFA)</label>
                  <input type="number" defaultValue={editingItem?.price} placeholder="3500" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[#6B7280] text-sm block mb-2">Badges</label>
                <div className="flex gap-2">
                  {[{ id: "vegetarian", label: "🌿 Végétarien" }, { id: "spicy", label: "🌶 Épicé" }, { id: "popular", label: "⭐ Populaire" }].map(b => (
                    <label key={b.id} className="flex items-center gap-1.5 cursor-pointer bg-[#F3F4F6] px-3 py-1.5 rounded-lg text-sm">
                      <input type="checkbox" defaultChecked={editingItem?.badges.includes(b.id as "vegetarian" | "spicy" | "popular")} className="accent-[#D97706]" />
                      {b.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowMenuModal(false)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-3 rounded-xl hover:bg-[#F3F4F6] transition-colors">Annuler</button>
                <button className="flex-1 bg-[#D97706] text-white py-3 rounded-xl hover:bg-[#F59E0B] transition-colors">
                  {editingItem ? "Enregistrer" : "Ajouter le plat"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Invite Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1F2937]">Inviter un membre</h3>
              <button onClick={() => setShowStaffModal(false)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#6B7280] text-sm block mb-1.5">Email</label>
                <input type="email" placeholder="prenom@lepalmier.com" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm block mb-1.5">Rôle</label>
                <select className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm bg-white">
                  <option value="serveur">Serveur</option>
                  <option value="cuisine">Cuisine</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-[#6B7280] text-sm block mb-1.5">PIN (optionnel)</label>
                <input type="number" maxLength={4} placeholder="1234" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowStaffModal(false)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-3 rounded-xl hover:bg-[#F3F4F6] transition-colors">Annuler</button>
                <button className="flex-1 bg-[#D97706] text-white py-3 rounded-xl hover:bg-[#F59E0B] transition-colors">Envoyer l'invitation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
