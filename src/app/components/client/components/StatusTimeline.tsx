// src/app/components/client/components/StatusTimeline.tsx
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { statusSteps } from "../constants";
import type { OrderStatus } from "../types";

interface StatusTimelineProps {
  currentStatus: OrderStatus;
}

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentStepIdx = statusSteps.findIndex(s => s.key === currentStatus);

  return (
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    done ? "bg-[#22C55E]" : active ? "bg-[#3B82F6]" : "bg-[#F3F4F6]"
                  }`}
                >
                  {done ? (
                    <CheckCircle size={18} className="text-white" />
                  ) : active ? (
                    <span className="w-2.5 h-2.5 bg-white rounded-full" />
                  ) : (
                    <span className="w-2.5 h-2.5 bg-[#D1D5DB] rounded-full" />
                  )}
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
  );
}