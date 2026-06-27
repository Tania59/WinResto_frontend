// src/app/components/client/screens/GeolocationScreen.tsx
import { motion } from "motion/react";
import { MapPin, Loader2 } from "lucide-react";

interface GeolocationScreenProps {
  checking: boolean;
  onAllowLocation: () => void;
}

export function GeolocationScreen({ checking, onAllowLocation }: GeolocationScreenProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 bg-linear-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
          <MapPin size={48} className="text-[#D97706]" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border-2 border-[#D97706]"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[#1F2937] text-xl mb-3"
      >
        Confirmez votre présence
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[#6B7280] text-sm leading-relaxed mb-8"
      >
        Pour commander, <strong className="text-[#1F2937]">Le Palmier</strong> demande à vérifier
        que vous êtes bien sur place.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAllowLocation}
        disabled={checking}
        className="w-full bg-[#D97706] text-white py-4 rounded-2xl text-base shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
      >
        {checking ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Vérification en cours…
          </>
        ) : (
          <>
            <MapPin size={20} /> Autoriser ma localisation
          </>
        )}
      </motion.button>

      <p className="text-[#9CA3AF] text-xs mt-5 leading-relaxed max-w-xs">
        Votre position n'est pas enregistrée — elle est vérifiée une seule fois et non conservée.
      </p>
    </div>
  );
} 