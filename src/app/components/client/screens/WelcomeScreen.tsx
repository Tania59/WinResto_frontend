// src/app/components/client/screens/WelcomeScreen.tsx
import { motion } from "motion/react";
import { Utensils, CheckCircle } from "lucide-react";
import { RESTAURANT_NAME, DEFAULT_TABLE } from "../constants";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-[#FEF3C7] to-transparent pointer-events-none" />

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
            <h1 className="text-2xl text-[#1F2937]">{RESTAURANT_NAME}</h1>
            <span className="bg-[#D97706] text-white px-3 py-0.5 rounded-full text-sm">Table {DEFAULT_TABLE}</span>
          </div>
          <p className="text-[#6B7280] text-sm mb-1">Cuisine authentique et conviviale</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="text-[#1F2937] mt-6 mb-2 text-xl"
        >
          Bienvenue ! 👋
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[#6B7280] text-sm mb-8"
        >
          Votre table est prête. Commandez à votre rythme.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-lg shadow-[0_4px_16px_rgba(217,119,6,0.35)] hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2"
        >
          <Utensils size={20} />
          Voir le menu
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#9CA3AF] text-xs mt-4 flex items-center gap-1"
        >
          <CheckCircle size={12} className="text-[#22C55E]" /> Aucune inscription requise
        </motion.p>
      </div>

      <div className="p-4 flex items-center justify-center">
        <p className="text-[#D1D5DB] text-xs">Propulsé par WinResto</p>
      </div>
    </div>
  );
}