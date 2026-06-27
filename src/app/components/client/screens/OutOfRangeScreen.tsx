// src/app/components/client/screens/OutOfRangeScreen.tsx
import { motion } from "motion/react";
import { AlertTriangle, Phone } from "lucide-react";

interface OutOfRangeScreenProps {
  onRetry: () => void;
  onCallWaiter: () => void;
}

export function OutOfRangeScreen({ onRetry, onCallWaiter }: OutOfRangeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full items-center justify-center p-8 text-center"
    >
      <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={48} className="text-[#EF4444]" />
      </div>
      <h2 className="text-[#1F2937] text-xl mb-3">Vous semblez loin du restaurant</h2>
      <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
        La commande en ligne est réservée aux clients présents sur place. Rapprochez-vous ou
        demandez à votre serveur.
      </p>
      <button
        onClick={onRetry}
        className="w-full border-2 border-[#D97706] text-[#D97706] py-4 rounded-2xl mb-3 hover:bg-[#D97706]/5 transition-colors"
      >
        Réessayer
      </button>
      <button
        onClick={onCallWaiter}
        className="w-full border-2 border-[#F59E0B] text-[#F59E0B] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F59E0B]/5 transition-colors"
      >
        <Phone size={18} /> Appeler le serveur
      </button>
    </motion.div>
  );
}