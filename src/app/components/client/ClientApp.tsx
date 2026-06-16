import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  ShoppingCart, ChevronLeft, Plus, Minus, Trash2, CheckCircle,
  MapPin, AlertTriangle, Phone, CreditCard, Utensils, Loader2, Sparkles,
} from "lucide-react";
import { menuItems, categories, formatPrice, restaurant } from "../../data/mockData";
import type { MenuItem } from "../../data/mockData";

type Screen = "welcome" | "menu" | "cart" | "geolocation" | "out_of_range" | "tracking";
type OrderStatus = "received" | "preparing" | "ready" | "served";

interface CartItem { item: MenuItem; qty: number; note: string; }

const BadgePill = ({ badge }: { badge: string }) => {
  const map = {
    vegetarian: { emoji: "🌿", label: "Végétarien", cls: "bg-green-50 text-green-700" },
    spicy:      { emoji: "🌶", label: "Épicé",      cls: "bg-red-50 text-red-600" },
    popular:    { emoji: "⭐", label: "Populaire",   cls: "bg-amber-50 text-amber-700" },
  } as Record<string, { emoji: string; label: string; cls: string }>;
  const b = map[badge];
  if (!b) return null;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs ${b.cls}`}>
      {b.emoji} {b.label}
    </span>
  );
};

const statusSteps = [
  { key: "received" as OrderStatus,  label: "Commande reçue",   color: "bg-[#22C55E]", textColor: "text-[#22C55E]" },
  { key: "preparing" as OrderStatus, label: "En préparation",   color: "bg-[#3B82F6]", textColor: "text-[#3B82F6]" },
  { key: "ready" as OrderStatus,     label: "Prête à servir",   color: "bg-[#D97706]", textColor: "text-[#D97706]" },
  { key: "served" as OrderStatus,    label: "Servie",            color: "bg-[#6B7280]", textColor: "text-[#6B7280]" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const screenOrder: Screen[] = ["welcome", "menu", "cart", "geolocation", "tracking"];

export function ClientApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [prevScreen, setPrevScreen] = useState<Screen>("welcome");
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [orderStatus] = useState<OrderStatus>("preparing");
  const [geoChecking, setGeoChecking] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [orderId] = useState(`CMD-${Math.floor(Math.random() * 900) + 100}`);

  const tableNumber = 5;

  const navigate = (to: Screen) => {
    setPrevScreen(screen);
    setScreen(to);
  };

  const dir = screenOrder.indexOf(screen) > screenOrder.indexOf(prevScreen) ? 1 : -1;

  const filteredItems = activeCategory === "Tout"
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory);

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1, note: "" }];
    });
    toast.success(`${item.name} ajouté`, {
      description: formatPrice(item.price),
      duration: 1800,
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  };
  const updateNote = (id: number, note: string) => setCart(prev => prev.map(c => c.item.id === id ? { ...c, note } : c));

  const handleGeoRequest = () => {
    setGeoChecking(true);
    setTimeout(() => { setGeoChecking(false); navigate("tracking"); }, 2200);
  };

  const currentStepIdx = statusSteps.findIndex(s => s.key === orderStatus);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden relative">
      <AnimatePresence mode="wait" custom={dir}>
        {/* ── WELCOME ── */}
        {screen === "welcome" && (
          <motion.div key="welcome" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            {/* Decorative top wave */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#FEF3C7] to-transparent pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-5xl mb-6 border border-amber-100"
              >
                🌴
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-2xl text-[#1F2937]">{restaurant.name}</h1>
                  <span className="bg-[#D97706] text-white px-3 py-0.5 rounded-full text-sm">Table {tableNumber}</span>
                </div>
                <p className="text-[#6B7280] text-sm mb-1">{restaurant.tagline}</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                className="text-[#1F2937] mt-6 mb-2 text-xl"
              >
                Bienvenue ! 👋
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-[#6B7280] text-sm mb-8"
              >
                Votre table est prête. Commandez à votre rythme.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("menu")}
                className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-lg shadow-[0_4px_16px_rgba(217,119,6,0.35)] hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2"
              >
                <Utensils size={20} />
                Voir le menu
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[#9CA3AF] text-xs mt-4 flex items-center gap-1"
              >
                <CheckCircle size={12} className="text-[#22C55E]" /> Aucune inscription requise
              </motion.p>
            </div>

            <div className="p-4 flex items-center justify-between">
              <button onClick={onBack} className="text-[#9CA3AF] text-xs hover:text-[#6B7280] transition-colors">← Changer de rôle</button>
              <p className="text-[#D1D5DB] text-xs">Propulsé par WinResto</p>
            </div>
          </motion.div>
        )}

        {/* ── MENU ── */}
        {screen === "menu" && (
          <motion.div key="menu" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("welcome")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors">
                  <ChevronLeft size={20} className="text-[#6B7280]" />
                </button>
                <span className="text-[#1F2937] text-sm">🌴 {restaurant.name}</span>
                <span className="bg-[#D97706]/15 text-[#D97706] px-2 py-0.5 rounded-full text-xs">Table {tableNumber}</span>
              </div>
              <motion.button
                onClick={() => navigate("cart")}
                animate={cartBounce ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative p-2 rounded-xl hover:bg-[#F3F4F6] transition-colors"
              >
                <ShoppingCart size={22} className="text-[#1F2937]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-[#D97706] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </header>

            {/* Category tabs */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-[#E5E7EB] flex-shrink-0">
              {categories.map(cat => (
                <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.95 }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all flex-shrink-0 ${activeCategory === cat ? "bg-[#D97706] text-white shadow-sm" : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"}`}>
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-28">
              {filteredItems.map((item, i) => {
                const inCart = cart.find(c => c.item.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className={`bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${!item.available ? "opacity-60" : ""}`}
                  >
                    <div className="relative">
                      <img src={item.photo} alt={item.name} className="w-full h-44 object-cover bg-[#F3F4F6]" />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white/90 text-[#6B7280] px-4 py-1.5 rounded-full text-sm">Indisponible</span>
                        </div>
                      )}
                      {item.badges.includes("popular") && item.available && (
                        <div className="absolute top-2 left-2 bg-[#D97706] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Populaire
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#1F2937] text-sm leading-tight">{item.name}</h3>
                          <p className="text-[#9CA3AF] text-xs mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.badges.filter(b => b !== "popular").map(b => <BadgePill key={b} badge={b} />)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-[#D97706] whitespace-nowrap text-sm">{formatPrice(item.price)}</span>
                          {item.available && (
                            inCart ? (
                              <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-xl p-0.5">
                                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-[#FEF3C7] transition-colors">
                                  <Minus size={13} className="text-[#6B7280]" />
                                </button>
                                <span className="text-[#1F2937] w-5 text-center text-sm">{inCart.qty}</span>
                                <button onClick={() => addToCart(item)} className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center shadow-sm">
                                  <Plus size={13} className="text-white" />
                                </button>
                              </div>
                            ) : (
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => addToCart(item)}
                                className="bg-[#D97706] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-[#F59E0B] transition-colors shadow-sm"
                              >
                                <Plus size={13} /> Ajouter
                              </motion.button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Floating cart CTA */}
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("cart")}
                    className="w-full bg-[#1F2937] text-white py-4 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-[#374151] transition-colors"
                  >
                    <span className="bg-[#D97706] px-2.5 py-0.5 rounded-lg text-sm">{cartCount}</span>
                    <span>Voir mon panier</span>
                    <span className="text-[#D97706]">{formatPrice(cartTotal)}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── CART ── */}
        {screen === "cart" && (
          <motion.div key="cart" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-2 sticky top-0 z-10 flex-shrink-0">
              <button onClick={() => navigate("menu")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors">
                <ChevronLeft size={20} className="text-[#6B7280]" />
              </button>
              <div>
                <h2 className="text-[#1F2937] text-base">Mon panier</h2>
                <p className="text-[#6B7280] text-xs">Table {tableNumber} · {cartCount} article{cartCount > 1 ? "s" : ""}</p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#9CA3AF]">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Votre panier est vide</p>
                  <button onClick={() => navigate("menu")} className="text-[#D97706] mt-2 text-sm hover:underline">Parcourir le menu →</button>
                </div>
              ) : (
                <>
                  {cart.map((c, i) => (
                    <motion.div key={c.item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl p-4 border border-[#E5E7EB]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={c.item.photo} alt={c.item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-[#F3F4F6]" />
                          <div className="min-w-0">
                            <p className="text-[#1F2937] text-sm truncate">{c.item.name}</p>
                            <p className="text-[#D97706] text-xs">{formatPrice(c.item.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#F3F4F6] rounded-xl p-0.5 flex-shrink-0">
                          <button onClick={() => updateQty(c.item.id, -1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                            <Minus size={13} className="text-[#6B7280]" />
                          </button>
                          <span className="text-[#1F2937] w-5 text-center text-sm">{c.qty}</span>
                          <button onClick={() => updateQty(c.item.id, 1)} className="w-8 h-8 bg-[#D97706] rounded-lg flex items-center justify-center">
                            <Plus size={13} className="text-white" />
                          </button>
                        </div>
                        <button onClick={() => setCart(p => p.filter(x => x.item.id !== c.item.id))} className="p-1.5 text-[#EF4444]/60 hover:text-[#EF4444] transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[#D97706] text-sm">{formatPrice(c.item.price * c.qty)}</span>
                      </div>
                      <input
                        placeholder="Note pour la cuisine (ex: sans piment)"
                        value={c.note}
                        onChange={e => updateNote(c.item.id, e.target.value)}
                        className="mt-2 w-full text-xs border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 bg-[#F9FAFB] placeholder-[#9CA3AF]"
                      />
                    </motion.div>
                  ))}

                  {/* Summary */}
                  <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                    <div className="flex justify-between text-[#6B7280] text-sm mb-2">
                      <span>Sous-total ({cartCount} art.)</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#1F2937] border-t border-[#F3F4F6] pt-2">
                      <span>Total</span>
                      <span className="text-[#D97706]">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                    <label className="text-[#9CA3AF] text-xs block mb-2 flex items-center gap-1">
                      👤 Votre prénom ? <span className="text-[#D1D5DB]">(facultatif)</span>
                    </label>
                    <input
                      placeholder="Ex: Kouassi — pour qu'on vous serve plus facilement"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 text-sm bg-[#F9FAFB] placeholder-[#9CA3AF]"
                    />
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-white border-t border-[#E5E7EB] space-y-3 flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("geolocation")}
                  className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-base shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] transition-colors"
                >
                  Envoyer la commande → {formatPrice(cartTotal)}
                </motion.button>
                <button onClick={() => navigate("menu")} className="w-full text-[#6B7280] text-sm text-center py-1 hover:text-[#D97706] transition-colors">
                  ← Continuer à parcourir le menu
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── GEOLOCATION ── */}
        {screen === "geolocation" && (
          <motion.div key="geo" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
              className="relative mb-6"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                <MapPin size={48} className="text-[#D97706]" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-2 border-[#D97706]"
              />
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-[#1F2937] text-xl mb-3">Confirmez votre présence</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-[#6B7280] text-sm leading-relaxed mb-8">
              Pour commander, <strong className="text-[#1F2937]">Le Palmier</strong> demande à vérifier que vous êtes bien sur place.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGeoRequest}
              disabled={geoChecking}
              className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-base shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {geoChecking
                ? <><Loader2 size={20} className="animate-spin" /> Vérification en cours…</>
                : <><MapPin size={20} /> Autoriser ma localisation</>}
            </motion.button>

            <p className="text-[#9CA3AF] text-xs mt-5 leading-relaxed max-w-xs">
              Votre position n'est pas enregistrée — elle est vérifiée une seule fois et non conservée.
            </p>
          </motion.div>
        )}

        {/* ── OUT OF RANGE ── */}
        {screen === "out_of_range" && (
          <motion.div key="outofrange" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full items-center justify-center p-8 text-center"
          >
            <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={48} className="text-[#EF4444]" />
            </div>
            <h2 className="text-[#1F2937] text-xl mb-3">Vous semblez loin du restaurant</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
              La commande en ligne est réservée aux clients présents sur place. Rapprochez-vous ou demandez à votre serveur.
            </p>
            <button onClick={() => navigate("geolocation")} className="w-full border-2 border-[#D97706] text-[#D97706] py-4 rounded-2xl mb-3 hover:bg-[#D97706]/5 transition-colors">
              Réessayer
            </button>
            <button className="w-full border-2 border-[#F59E0B] text-[#F59E0B] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F59E0B]/5 transition-colors">
              <Phone size={18} /> Appeler le serveur
            </button>
          </motion.div>
        )}

        {/* ── TRACKING ── */}
        {screen === "tracking" && (
          <motion.div key="tracking" custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[#6B7280] text-xs">Votre commande</p>
                <span className="bg-[#22C55E]/10 text-[#22C55E] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> En cours
                </span>
              </div>
              <h2 className="text-[#1F2937] text-base">{orderId}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Timeline */}
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                <h3 className="text-[#1F2937] text-sm mb-5">Suivi de votre commande</h3>
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const done = i < currentStepIdx;
                    const active = i === currentStepIdx;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={active ? { scale: 0.7 } : {}}
                            animate={active ? { scale: [0.9, 1.05, 1] } : {}}
                            transition={{ repeat: active ? Infinity : 0, duration: 1.5 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-[#22C55E]" : active ? "bg-[#3B82F6]" : "bg-[#F3F4F6]"}`}
                          >
                            {done
                              ? <CheckCircle size={18} className="text-white" />
                              : active
                                ? <span className="w-2.5 h-2.5 bg-white rounded-full" />
                                : <span className="w-2.5 h-2.5 bg-[#D1D5DB] rounded-full" />}
                          </motion.div>
                          {i < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1.5 rounded-full ${done ? "bg-[#22C55E]" : "bg-[#E5E7EB]"}`} />
                          )}
                        </div>
                        <div className="pb-4 pt-1.5">
                          <p className={`text-sm ${done ? step.textColor : active ? step.textColor : "text-[#9CA3AF]"}`}>
                            {step.label}
                          </p>
                          {active && (
                            <p className="text-[#6B7280] text-xs mt-0.5">Votre plat arrive bientôt ! 🍽️</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                <h3 className="text-[#1F2937] text-sm mb-3">Articles commandés</h3>
                <div className="space-y-2.5">
                  {cart.map(c => (
                    <div key={c.item.id} className="flex items-center gap-2">
                      <span className="bg-[#F3F4F6] text-[#6B7280] text-xs px-2 py-0.5 rounded-lg">{c.qty}×</span>
                      <span className="text-[#1F2937] text-sm flex-1">{c.item.name}</span>
                      {c.note && (
                        <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-0.5 rounded-full">⚠ {c.note}</span>
                      )}
                      <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-xs px-2 py-0.5 rounded-full">En prép.</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-[#F3F4F6] text-[#D97706] text-sm">
                  <span>Total payé</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-[#D97706] text-[#D97706] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-[#D97706]/5 transition-colors active:scale-[0.98]">
                  <Utensils size={16} /> Appeler
                </button>
                <button className="border-2 border-[#EF4444] text-[#EF4444] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-[#EF4444]/5 transition-colors active:scale-[0.98]">
                  <CreditCard size={16} /> Addition
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
