import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import {
  Smartphone, Monitor, ChefHat, Tablet, Shield,
  ArrowRight, Zap, Globe, BarChart2, Star
} from "lucide-react";
import { ClientApp } from "./components/client/ClientApp";
import { ServerApp } from "./components/server/ServerApp";
import { KitchenApp } from "./components/kitchen/KitchenApp";
import { AdminApp } from "./components/admin/AdminApp";
import { SuperAdminApp } from "./components/superadmin/SuperAdminApp";

type Role = "selector" | "client" | "waiter" | "kitchen" | "admin" | "superadmin";

const roles = [
  {
    id: "client" as const,
    title: "Client",
    subtitle: "Table 5 · Le Palmier",
    description: "Menu par QR code, commande et suivi en temps réel — sans inscription.",
    icon: Smartphone,
    badge: "PWA Mobile",
    badgeColor: "bg-[#22C55E]/15 text-[#16A34A]",
    accentColor: "#D97706",
    bgGrad: "from-amber-50 to-orange-50",
    borderHover: "hover:border-[#D97706]",
    arrowColor: "text-[#D97706]",
    preview: "390px · iPhone frame",
    steps: ["Scanner QR", "Choisir", "Commander", "Suivre"],  // ✅ Tout sur une ligne
  },
  {
    id: "waiter" as const,
    title: "Serveur",
    subtitle: "Fatoumata · Service en salle",
    description: "Plan de salle en temps réel, alertes commandes et appels clients.",
    icon: Tablet,
    badge: "PWA Tablette",
    badgeColor: "bg-[#3B82F6]/10 text-[#2563EB]",
    accentColor: "#3B82F6",
    bgGrad: "from-blue-50 to-sky-50",
    borderHover: "hover:border-[#3B82F6]",
    arrowColor: "text-[#3B82F6]",
    preview: "768px · tablette",
    steps: ["Surveiller", "Confirmer", "Servir"],
  },
  {
    id: "kitchen" as const,
    title: "Cuisine · KDS",
    subtitle: "Bintou · Poste cuisine",
    description: "File de tickets mode sombre, timers live, gros boutons tactiles.",
    icon: ChefHat,
    badge: "Tablette fixe",
    badgeColor: "bg-[#374151]/10 text-[#374151]",
    accentColor: "#F59E0B",
    bgGrad: "from-gray-50 to-zinc-50",
    borderHover: "hover:border-[#374151]",
    arrowColor: "text-[#374151]",
    preview: "1024px · mode sombre",
    steps: ["Recevoir", "Préparer", "Notifier"],
  },
  {
    id: "admin" as const,
    title: "Gérant · Admin",
    subtitle: "Djidjoho · Le Palmier",
    description: "Dashboard analytique, menu, tables & QR codes, staff et géofencing.",
    icon: Monitor,
    badge: "Desktop",
    badgeColor: "bg-[#D97706]/10 text-[#B45309]",
    accentColor: "#D97706",
    bgGrad: "from-amber-50 to-yellow-50",
    borderHover: "hover:border-[#D97706]",
    arrowColor: "text-[#D97706]",
    preview: "1440px · desktop",
    steps: ["Analyser", "Gérer", "Optimiser"],
  },
  {
    id: "superadmin" as const,
    title: "Super Admin",
    subtitle: "Ismaël · Équipe WinResto",
    description: "Plateforme SaaS multi-tenant : restaurants, inscriptions, plans, MRR.",
    icon: Shield,
    badge: "Back-office SaaS",
    badgeColor: "bg-[#8B5CF6]/10 text-[#7C3AED]",
    accentColor: "#8B5CF6",
    bgGrad: "from-violet-50 to-purple-50",
    borderHover: "hover:border-[#8B5CF6]",
    arrowColor: "text-[#8B5CF6]",
    preview: "1440px · desktop",
    steps: ["Valider", "Suivre", "Facturer"],
  },
];

const platformStats = [
  { icon: Globe, value: "6 pays", label: "Afrique de l'Ouest" },
  { icon: BarChart2, value: "2 847", label: "commandes aujourd'hui" },
  { icon: Zap, value: "< 2s", label: "latence ticket cuisine" },
  { icon: Star, value: "5 rôles", label: "interfaces dédiées" },
];

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>("selector");

  const handleBack = () => {
    setCurrentRole("selector");
  };

  const roleApps: Record<Exclude<Role, "selector">, React.ReactNode> = {
    client: (
      <div className="w-full h-full flex items-center justify-center bg-[#111827] relative overflow-hidden">
        {/* Phone chrome bg */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#D97706/15,transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-white/40 text-xs tracking-widest uppercase">Vue mobile · 390px</div>
          <div className="w-97.5 max-h-211 h-[min(844px,calc(100vh-6rem))] rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border-[6px] border-[#374151] relative bg-black">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1F2937] rounded-b-2xl z-20" />
            <ClientApp onBack={handleBack} />
          </div>
        </div>
      </div>
    ),
    waiter: (
      <div className="w-full h-full bg-[#F8FAFC] overflow-hidden">
        <ServerApp onBack={handleBack} />
      </div>
    ),
    kitchen: (
      <div className="w-full h-full overflow-hidden">
        <KitchenApp onBack={handleBack} />
      </div>
    ),
    admin: (
      <div className="w-full h-full overflow-hidden">
        <AdminApp onBack={handleBack} />
      </div>
    ),
    superadmin: (
      <div className="w-full h-full overflow-hidden">
        <SuperAdminApp onBack={handleBack} />
      </div>
    ),
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <AnimatePresence mode="wait">
        {currentRole !== "selector" ? (
          <motion.div
            key={currentRole}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {roleApps[currentRole]}
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            className="min-h-full bg-[#F8FAFC] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] px-6 py-3.5 flex items-center gap-3 sticky top-0 z-10">
              <div className="w-9 h-9 bg-[#D97706] rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">W</span>
              </div>
              <div>
                <span className="text-[#1F2937]">WinResto</span>
                <span className="text-[#6B7280] text-sm ml-2 hidden sm:inline">· Commande à table par QR code</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 bg-[#22C55E]/10 text-[#16A34A] text-xs px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  MVP v1.0 · Maquette interactive
                </span>
              </div>
            </header>

            {/* Hero */}
            <div className="relative overflow-hidden bg-[#111827] text-white">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#D97706/20,transparent)]" />
              <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="inline-flex items-center gap-2 bg-[#D97706]/20 text-[#F59E0B] text-sm px-4 py-1.5 rounded-full mb-5 border border-[#D97706]/20"
                >
                  🌴 Cotonou, Bénin · Marché initial Afrique de l'Ouest
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl mb-4 leading-tight"
                >
                  La restauration<br />
                  <span className="text-[#D97706]">réinventée</span> par le QR code
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-white/60 text-base max-w-xl mx-auto leading-relaxed"
                >
                  5 interfaces dédiées, 0 application native. Explorez chaque rôle dans son contexte réel — de la table du client à la cuisine, jusqu'au back-office SaaS.
                </motion.p>

                {/* Platform stats */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-2xl mx-auto"
                >
                  {platformStats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                      <stat.icon size={16} className="mx-auto text-[#D97706] mb-1.5" />
                      <div className="text-white text-lg">{stat.value}</div>
                      <div className="text-white/40 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Role selector */}
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
              <p className="text-center text-[#6B7280] text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-widest">Choisissez votre rôle</p>
              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {roles.map((role, i) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => setCurrentRole(role.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3, ease: "easeOut" }}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-white rounded-2xl border-2 border-[#E5E7EB] ${role.borderHover} p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br ${role.bgGrad} rounded-xl flex items-center justify-center border border-black/5 shrink-0`}>
                          <Icon size={18} className="sm:size-[22px]" style={{ color: role.accentColor }} />
                        </div>
                        <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full ${role.badgeColor} shrink-0 ml-2`}>
                          {role.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[#1F2937] text-sm sm:text-base mb-0.5 truncate">{role.title}</h3>
                      <p className="text-[10px] sm:text-xs mb-2 sm:mb-3 truncate" style={{ color: role.accentColor }}>
                        {role.subtitle}
                      </p>
                      <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                        {role.description}
                      </p>

                      {/* Steps - Version compacte */}
                      <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                        {role.steps.map((step, si) => (
                          <div key={step} className="flex items-center gap-1">
                            <span className="text-[#9CA3AF] text-[10px] sm:text-xs bg-[#F3F4F6] px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap">
                              {step}
                            </span>
                            {si < role.steps.length - 1 && (
                              <ArrowRight size={8} className="sm:size-[10px] text-[#D1D5DB] shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#F3F4F6]">
                        <span className="text-[#9CA3AF] text-[10px] sm:text-xs truncate">{role.preview}</span>
                        <motion.span
                          className={role.arrowColor}
                          animate={{ x: 0 }}
                          whileHover={{ x: 3 }}
                        >
                          <ArrowRight size={14} className="sm:size-[17px]" />
                        </motion.span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feature tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-5xl mx-auto mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2 justify-center"
              >
                {[
                  "QR Code par table", "0 inscription client", "KDS temps réel",
                  "Géofencing", "Multi-tenant SaaS", "Recharts analytics",
                  "Mode sombre cuisine", "Plans tarifaires", "Workflow validation",
                  "Toasts temps réel", "Horloge live", "Timers cuisine",
                ].map((feat) => (
                  <span key={feat} className="bg-white border border-[#E5E7EB] text-[#6B7280] text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:border-[#D97706]/50 hover:text-[#D97706] transition-colors cursor-default">
                    {feat}
                  </span>
                ))}
              </motion.div>
            </div>

            <footer className="text-center py-3 sm:py-4 text-[#9CA3AF] text-[10px] sm:text-xs border-t border-[#E5E7EB] px-4">
              WinResto MVP v1.0 · Solution SaaS de commande à table · Cotonou, Bénin 🌍
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}