// src/app/components/client/screens/CartScreen.tsx
import { motion } from "motion/react";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { formatPrice } from "../../../data/mockData";
import { CartItem as CartItemComponent } from "../components/CartItem";
import { DEFAULT_TABLE } from "../constants";
import type { CartItem } from "../types";

interface CartScreenProps {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  clientName: string;
  onUpdateClientName: (name: string) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export function CartScreen({
  cart,
  cartCount,
  cartTotal,
  clientName,
  onUpdateClientName,
  onUpdateQty,
  onRemoveItem,
  onUpdateNote,
  onCheckout,
  onBack,
}: CartScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-2 sticky top-0 z-10 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          <ChevronLeft size={20} className="text-[#6B7280]" />
        </button>
        <div>
          <h2 className="text-[#1F2937] text-base">Mon panier</h2>
          <p className="text-[#6B7280] text-xs">
            Table {DEFAULT_TABLE} · {cartCount} article{cartCount > 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
            <p>Votre panier est vide</p>
            <button onClick={onBack} className="text-[#D97706] mt-2 text-sm hover:underline">
              Parcourir le menu →
            </button>
          </div>
        ) : (
          <>
            {cart.map((c: CartItem, i: number) => (
              <CartItemComponent
                key={c.item.id}
                item={c}
                onUpdateQty={(delta: number) => onUpdateQty(c.item.id, delta)}
                onRemove={() => onRemoveItem(c.item.id)}
                onUpdateNote={(note: string) => onUpdateNote(c.item.id, note)}
                index={i}
              />
            ))}

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

            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <label className="text-[#9CA3AF] text-xs mb-2 flex items-center gap-1">
                👤 Votre prénom ? <span className="text-[#D1D5DB]">(facultatif)</span>
              </label>
              <input
                placeholder="Ex: Kouassi — pour qu'on vous serve plus facilement"
                value={clientName}
                onChange={e => onUpdateClientName(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20 text-sm bg-[#F9FAFB] placeholder-[#9CA3AF]"
              />
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 bg-white border-t border-[#E5E7EB] space-y-3 shrink-0">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCheckout}
            className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-base shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] transition-colors"
          >
            Envoyer la commande → {formatPrice(cartTotal)}
          </motion.button>
          <button
            onClick={onBack}
            className="w-full text-[#6B7280] text-sm text-center py-1 hover:text-[#D97706] transition-colors"
          >
            ← Continuer à parcourir le menu
          </button>
        </div>
      )}
    </div>
  );
}