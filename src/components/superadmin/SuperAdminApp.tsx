import { useState } from "react";
import {
  LayoutDashboard, Building2, ClipboardList, CreditCard, ShieldCheck,
  Settings, TrendingUp, Users, AlertCircle, CheckCircle, XCircle,
  ExternalLink, ChevronRight, X, Check, Ban, RefreshCw,
  Globe, ChevronLeft, ArrowRight, Eye, EyeOff, Menu
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { saasRestaurants, registrations, saasPlan, mrrMonthly, formatPrice } from "../../data/mockData";
import type { SaasRestaurant, Registration } from "../../data/mockData";

type SASection = "dashboard" | "restaurants" | "registrations" | "plans" | "signup" | "admins";

const navItems: { key: SASection; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "restaurants", label: "Restaurants", icon: Building2 },
  { key: "registrations", label: "Inscriptions", icon: ClipboardList },
  { key: "plans", label: "Plans & Tarifs", icon: CreditCard },
  { key: "admins", label: "Super Admins", icon: ShieldCheck },
  { key: "signup", label: "Page inscription", icon: Globe },
];

const planColors: Record<string, string> = {
  starter: "bg-[#3B82F6]/10 text-[#3B82F6]",
  pro: "bg-[#D97706]/10 text-[#D97706]",
  enterprise: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
};

const subscriptionColors: Record<string, string> = {
  trial: "bg-[#F59E0B]/10 text-[#F59E0B]",
  active: "bg-[#22C55E]/10 text-[#22C55E]",
  past_due: "bg-[#EF4444]/10 text-[#EF4444]",
  suspended: "bg-[#6B7280]/10 text-[#6B7280]",
};
const subscriptionLabels: Record<string, string> = {
  trial: "Essai", active: "Actif", past_due: "Impayé", suspended: "Suspendu",
};

type SignupStep = 1 | 2 | 3;

export function SuperAdminApp({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<SASection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [regs, setRegs] = useState(registrations);
  const [regTab, setRegTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [rejectModal, setRejectModal] = useState<Registration | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<SaasRestaurant | null>(null);
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const pendingCount = regs.filter(r => r.status === "pending").length;
  const activeRestaurants = saasRestaurants.filter(r => r.status === "active").length;
  const totalMRR = saasRestaurants.filter(r => r.status === "active").reduce((s, r) => s + r.mrr, 0);

  const approveReg = (id: number) => {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };
  const rejectReg = (id: number) => {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    setRejectModal(null);
    setRejectReason("");
  };

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-[#1F2937] flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">W</div>
          {sidebarOpen && <div className="min-w-0"><p className="text-white truncate">WinResto</p><p className="text-white/50 text-xs">Back-office SaaS</p></div>}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${section === key ? "bg-[#D97706] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {key === "registrations" && pendingCount > 0 && sidebarOpen && (
                <span className="ml-auto bg-[#EF4444] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <ChevronLeft size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Quitter</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6]">
              <Menu size={18} className="text-[#6B7280]" />
            </button>
            <div>
              <h1 className="text-[#1F2937]">Bonjour, Ismaël 👋</h1>
              <p className="text-[#6B7280] text-sm">Dimanche 14 juin 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm px-3 py-1.5 rounded-full">Super Admin</span>
            <div className="w-9 h-9 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm">IS</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ── PLATFORM DASHBOARD ── */}
          {section === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Restaurants actifs", value: activeRestaurants, icon: Building2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
                  { label: "MRR", value: formatPrice(totalMRR), icon: TrendingUp, color: "text-[#D97706]", bg: "bg-[#D97706]/10" },
                  { label: "Inscriptions en attente", value: pendingCount, icon: AlertCircle, color: pendingCount > 0 ? "text-[#EF4444]" : "text-[#6B7280]", bg: pendingCount > 0 ? "bg-[#EF4444]/10" : "bg-[#F3F4F6]" },
                  { label: "Commandes aujourd'hui", value: "2 847", icon: Users, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#6B7280] text-sm">{kpi.label}</span>
                      <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                        <kpi.icon size={18} className={kpi.color} />
                      </div>
                    </div>
                    <p className={`text-2xl ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">MRR mensuel</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mrrMonthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => [formatPrice(v), "MRR"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }} />
                      <Line type="monotone" dataKey="mrr" stroke="#D97706" strokeWidth={2.5} dot={{ fill: "#D97706", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#1F2937] mb-4">Inscriptions récentes</h3>
                  <div className="space-y-3">
                    {registrations.slice(0, 3).map(reg => (
                      <div key={reg.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-[#1F2937] text-sm">{reg.restaurantName}</p>
                          <p className="text-[#6B7280] text-xs">{reg.country} · {reg.submittedAt}</p>
                        </div>
                        <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs px-2.5 py-1 rounded-full">{reg.status === "pending" ? "En attente" : reg.status}</span>
                      </div>
                    ))}
                    <button onClick={() => setSection("registrations")} className="text-[#D97706] text-sm flex items-center gap-1 mt-2 hover:underline">
                      Voir toutes les inscriptions <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
                <h3 className="text-[#1F2937] mb-4">Abonnements problématiques</h3>
                <div className="space-y-2">
                  {saasRestaurants.filter(r => r.status === "past_due" || r.status === "suspended").map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={16} className={r.status === "past_due" ? "text-[#EF4444]" : "text-[#6B7280]"} />
                        <div>
                          <p className="text-[#1F2937] text-sm">{r.name}</p>
                          <p className="text-[#6B7280] text-xs">{r.subdomain}.winresto.com</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${subscriptionColors[r.status]}`}>{subscriptionLabels[r.status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── RESTAURANTS ── */}
          {section === "restaurants" && !selectedRestaurant && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Restaurants ({saasRestaurants.length})</h2>
                <button className="bg-[#D97706] text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:bg-[#F59E0B] transition-colors">
                  + Créer manuellement
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="text-left px-5 py-3 text-[#6B7280] text-sm">Restaurant</th>
                        <th className="text-left px-5 py-3 text-[#6B7280] text-sm hidden md:table-cell">Plan</th>
                        <th className="text-left px-5 py-3 text-[#6B7280] text-sm">Statut</th>
                        <th className="text-right px-5 py-3 text-[#6B7280] text-sm hidden lg:table-cell">Commandes/mois</th>
                        <th className="text-center px-5 py-3 text-[#6B7280] text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saasRestaurants.map(r => (
                        <tr key={r.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="text-[#1F2937] text-sm">{r.name}</p>
                            <a href="#" className="text-[#3B82F6] text-xs hover:underline flex items-center gap-1">
                              {r.subdomain}.winresto.com <ExternalLink size={10} />
                            </a>
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${planColors[r.plan]}`}>{r.plan}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${subscriptionColors[r.status]}`}>{subscriptionLabels[r.status]}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-[#6B7280] text-sm hidden lg:table-cell">{r.ordersThisMonth.toLocaleString("fr-FR")}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setSelectedRestaurant(r)} className="p-1.5 text-[#6B7280] hover:text-[#3B82F6] rounded-lg transition-colors" title="Voir détail">
                                <Eye size={15} />
                              </button>
                              {r.status === "active" && (
                                <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] rounded-lg transition-colors" title="Suspendre">
                                  <Ban size={15} />
                                </button>
                              )}
                              {r.status === "suspended" && (
                                <button className="p-1.5 text-[#6B7280] hover:text-[#22C55E] rounded-lg transition-colors" title="Réactiver">
                                  <RefreshCw size={15} />
                                </button>
                              )}
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

          {/* Restaurant detail */}
          {section === "restaurants" && selectedRestaurant && (
            <div className="space-y-4 max-w-3xl">
              <button onClick={() => setSelectedRestaurant(null)} className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1F2937] text-sm transition-colors">
                <ChevronLeft size={16} /> Retour à la liste
              </button>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-[#1F2937] text-xl">{selectedRestaurant.name}</h2>
                    <a href="#" className="text-[#3B82F6] text-sm hover:underline flex items-center gap-1">
                      {selectedRestaurant.subdomain}.winresto.com <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${planColors[selectedRestaurant.plan]}`}>{selectedRestaurant.plan}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${subscriptionColors[selectedRestaurant.status]}`}>{subscriptionLabels[selectedRestaurant.status]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Tables", value: selectedRestaurant.tables },
                    { label: "Commandes/mois", value: selectedRestaurant.ordersThisMonth },
                    { label: "MRR", value: formatPrice(selectedRestaurant.mrr) },
                    { label: "Inscrit le", value: selectedRestaurant.registeredAt },
                  ].map(m => (
                    <div key={m.label} className="bg-[#F9FAFB] rounded-lg p-3">
                      <p className="text-[#6B7280] text-xs mb-1">{m.label}</p>
                      <p className="text-[#1F2937] text-sm">{m.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="border border-[#EF4444] text-[#EF4444] px-4 py-2 rounded-lg text-sm hover:bg-[#EF4444]/5 transition-colors flex items-center gap-1.5">
                    <Ban size={14} /> Suspendre
                  </button>
                  <button className="border border-[#D97706] text-[#D97706] px-4 py-2 rounded-lg text-sm hover:bg-[#D97706]/5 transition-colors">
                    Changer de plan
                  </button>
                  <button className="bg-[#1F2937] text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors flex items-center gap-1.5">
                    <ExternalLink size={14} /> Accéder au back-office
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── REGISTRATIONS ── */}
          {section === "registrations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">
                  Inscriptions
                  {pendingCount > 0 && <span className="ml-2 bg-[#EF4444] text-white text-sm px-2.5 py-0.5 rounded-full">{pendingCount} en attente</span>}
                </h2>
              </div>

              <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {(["pending", "approved", "rejected"] as const).map(tab => {
                  const labels = { pending: "En attente", approved: "Approuvées", rejected: "Rejetées" };
                  return (
                    <button key={tab} onClick={() => setRegTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${regTab === tab ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}>
                      {labels[tab]}
                      {tab === "pending" && pendingCount > 0 && <span className="ml-1.5 bg-[#EF4444] text-white text-xs px-1.5 rounded-full">{pendingCount}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {regs.filter(r => r.status === regTab).length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                    <CheckCircle size={40} className="mx-auto text-[#22C55E] mb-3 opacity-50" />
                    <p className="text-[#6B7280]">Aucune inscription dans cette catégorie</p>
                  </div>
                ) : (
                  regs.filter(r => r.status === regTab).map(reg => (
                    <div key={reg.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-[#1F2937]">{reg.restaurantName}</h3>
                          <p className="text-[#6B7280] text-sm">Gérant : {reg.ownerName}</p>
                          <p className="text-[#6B7280] text-sm">{reg.email} · {reg.phone}</p>
                          <p className="text-[#6B7280] text-sm">{reg.city}, {reg.country}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe size={14} className="text-[#6B7280]" />
                            <span className="text-[#6B7280] text-sm">{reg.subdomain}.winresto.com</span>
                            {reg.subdomainAvailable
                              ? <span className="text-[#22C55E] text-xs flex items-center gap-0.5"><Check size={11} /> Disponible</span>
                              : <span className="text-[#EF4444] text-xs flex items-center gap-0.5"><X size={11} /> Déjà pris</span>}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={14} className="text-[#6B7280]" />
                            <span className={`text-xs px-2.5 py-1 rounded-full ${planColors[reg.plan.toLowerCase()]}`}>{reg.plan}</span>
                          </div>
                          <p className="text-[#9CA3AF] text-xs">Soumis le {reg.submittedAt}</p>
                        </div>
                      </div>
                      {regTab === "pending" && (
                        <div className="flex gap-3 pt-3 border-t border-[#F3F4F6]">
                          <button onClick={() => approveReg(reg.id)}
                            className="flex-1 bg-[#22C55E] text-white py-2.5 rounded-xl text-sm hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2">
                            <CheckCircle size={15} /> Approuver
                          </button>
                          <button onClick={() => setRejectModal(reg)}
                            className="flex-1 border-2 border-[#EF4444] text-[#EF4444] py-2.5 rounded-xl text-sm hover:bg-[#EF4444]/5 transition-colors flex items-center justify-center gap-2">
                            <XCircle size={15} /> Rejeter
                          </button>
                          {!reg.subdomainAvailable && (
                            <button className="px-4 py-2.5 border border-[#D97706] text-[#D97706] rounded-xl text-sm hover:bg-[#D97706]/5 transition-colors whitespace-nowrap">
                              Modifier sous-domaine
                            </button>
                          )}
                        </div>
                      )}
                      {regTab === "approved" && (
                        <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6] text-[#22C55E] text-sm">
                          <CheckCircle size={15} /> Approuvé · Email de bienvenue envoyé
                        </div>
                      )}
                      {regTab === "rejected" && (
                        <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6] text-[#EF4444] text-sm">
                          <XCircle size={15} /> Rejeté · Motif envoyé par email
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── PLANS ── */}
          {section === "plans" && (
            <div className="space-y-4">
              <h2 className="text-[#1F2937]">Plans tarifaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {saasPlan.map(plan => (
                  <div key={plan.id} className={`bg-white rounded-xl border-2 p-5 ${plan.id === "pro" ? "border-[#D97706]" : "border-[#E5E7EB]"} relative`}>
                    {plan.id === "pro" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-xs px-3 py-1 rounded-full">Populaire</div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-[#1F2937]">{plan.name}</h3>
                        <p className="text-[#D97706]">{formatPrice(plan.price)}<span className="text-[#6B7280] text-sm">/mois</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${plan.active ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                          {plan.active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[#6B7280] text-sm">
                          <Check size={14} className="text-[#22C55E] flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-[#F3F4F6] flex gap-2">
                      <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 rounded-lg text-sm hover:border-[#D97706] hover:text-[#D97706] transition-colors">
                        Modifier
                      </button>
                      <button className={`px-3 py-2 rounded-lg text-sm transition-colors border ${plan.active ? "border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/5" : "border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/5"}`}>
                        {plan.active ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUPER ADMINS ── */}
          {section === "admins" && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2937]">Super Admins</h2>
                <button className="bg-[#D97706] text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:bg-[#F59E0B] transition-colors">
                  + Ajouter
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                {[
                  { name: "Ismaël Gbaguidi", email: "ismael@winresto.com", role: "super_admin", lastSeen: "Aujourd'hui 20:05" },
                  { name: "Raïssa Tokplo", email: "raissa@winresto.com", role: "support", lastSeen: "Aujourd'hui 18:30" },
                ].map((admin, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center text-[#8B5CF6] text-sm">
                        {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[#1F2937] text-sm">{admin.name}</p>
                        <p className="text-[#6B7280] text-xs">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${admin.role === "super_admin" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "bg-[#3B82F6]/10 text-[#3B82F6]"}`}>
                        {admin.role === "super_admin" ? "Super Admin" : "Support"}
                      </span>
                      <p className="text-[#9CA3AF] text-xs hidden sm:block">{admin.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SIGNUP PAGE PREVIEW ── */}
          {section === "signup" && (
            <div className="max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#D97706] rounded-xl flex items-center justify-center text-white">W</div>
                <div>
                  <h2 className="text-[#1F2937]">WinResto</h2>
                  <p className="text-[#6B7280] text-sm">Commencez gratuitement — 14 jours d'essai</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-0 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <button onClick={() => setSignupStep(step as SignupStep)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors flex-shrink-0 ${signupStep === step ? "bg-[#D97706] text-white" : signupStep > step ? "bg-[#22C55E] text-white" : "bg-[#E5E7EB] text-[#6B7280]"}`}>
                      {signupStep > step ? <Check size={15} /> : step}
                    </button>
                    {step < 3 && <div className={`h-0.5 flex-1 mx-2 ${signupStep > step ? "bg-[#22C55E]" : "bg-[#E5E7EB]"}`} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#6B7280] -mt-6 mb-6">
                <span>Votre restaurant</span>
                <span>Votre compte</span>
                <span>Adresse web</span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                {signupStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-[#1F2937]">Votre restaurant</h3>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Nom du restaurant *</label>
                      <input placeholder="Ex: Le Palmier" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Pays *</label>
                      <select className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm bg-white">
                        <option>Bénin</option>
                        <option>Côte d'Ivoire</option>
                        <option>Sénégal</option>
                        <option>Mali</option>
                        <option>Burkina Faso</option>
                        <option>Togo</option>
                        <option>Guinée</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Ville *</label>
                      <input placeholder="Ex: Cotonou" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Téléphone</label>
                      <input placeholder="+229 97 00 00 00" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                    </div>
                    <button onClick={() => setSignupStep(2)} className="w-full bg-[#D97706] text-white py-3.5 rounded-xl hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2">
                      Suivant <ArrowRight size={16} />
                    </button>
                  </div>
                )}
                {signupStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-[#1F2937]">Votre compte</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[#6B7280] text-sm block mb-1.5">Prénom *</label>
                        <input placeholder="Djidjoho" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                      </div>
                      <div>
                        <label className="text-[#6B7280] text-sm block mb-1.5">Nom *</label>
                        <input placeholder="Mensah" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Email *</label>
                      <input type="email" placeholder="vous@restaurant.com" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Mot de passe *</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Minimum 8 caractères" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 text-sm" />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setSignupStep(1)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-3.5 rounded-xl text-sm">Retour</button>
                      <button onClick={() => setSignupStep(3)} className="flex-1 bg-[#D97706] text-white py-3.5 rounded-xl hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2">
                        Suivant <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
                {signupStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-[#1F2937]">Votre adresse web</h3>
                    <div>
                      <label className="text-[#6B7280] text-sm block mb-1.5">Sous-domaine *</label>
                      <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#D97706]/30">
                        <input
                          placeholder="lepalmier"
                          value={subdomainInput}
                          onChange={e => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          className="flex-1 px-4 py-3 focus:outline-none text-sm"
                        />
                        <span className="bg-[#F3F4F6] px-3 py-3 text-[#6B7280] text-sm border-l border-[#E5E7EB] whitespace-nowrap">.winresto.com</span>
                      </div>
                      {subdomainInput && (
                        <p className="text-[#22C55E] text-xs mt-1.5 flex items-center gap-1">
                          <Check size={11} /> {subdomainInput}.winresto.com est disponible
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[#6B7280] text-sm block mb-3">Choisissez votre plan</label>
                      <div className="space-y-2">
                        {saasPlan.map(plan => (
                          <label key={plan.id} className="flex items-center justify-between p-3 border-2 border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#D97706] transition-colors has-[:checked]:border-[#D97706] has-[:checked]:bg-[#FEF9EE]">
                            <div className="flex items-center gap-3">
                              <input type="radio" name="plan" value={plan.id} className="accent-[#D97706]" defaultChecked={plan.id === "starter"} />
                              <div>
                                <p className="text-[#1F2937] text-sm">{plan.name}</p>
                                <p className="text-[#6B7280] text-xs">{plan.features[0]}</p>
                              </div>
                            </div>
                            <span className="text-[#D97706] text-sm whitespace-nowrap">{formatPrice(plan.price)}/mois</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setSignupStep(2)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-3.5 rounded-xl text-sm">Retour</button>
                      <button onClick={() => { alert("Demande envoyée ! Vous recevrez un email de confirmation sous 24h."); setSignupStep(1); setSubdomainInput(""); }}
                        className="flex-1 bg-[#D97706] text-white py-3.5 rounded-xl hover:bg-[#F59E0B] transition-colors text-sm">
                        Envoyer ma demande
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1F2937]">Rejeter — {rejectModal.restaurantName}</h3>
              <button onClick={() => setRejectModal(null)} className="p-1.5 hover:bg-[#F3F4F6] rounded-lg"><X size={18} /></button>
            </div>
            <div className="mb-4">
              <label className="text-[#6B7280] text-sm block mb-1.5">Motif du rejet (envoyé par email)</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                placeholder="Ex: Sous-domaine déjà utilisé, merci de choisir un autre nom..."
                className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-3 rounded-xl text-sm">Annuler</button>
              <button onClick={() => rejectReg(rejectModal.id)} disabled={!rejectReason.trim()}
                className="flex-1 bg-[#EF4444] text-white py-3 rounded-xl text-sm hover:bg-red-600 transition-colors disabled:opacity-50">
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
