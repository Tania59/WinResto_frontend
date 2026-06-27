// src/app/components/server/components/StatsCards.tsx

interface StatsCardsProps {
  occupiedCount: number;
  totalTables: number;
  pendingCount: number;
  callCount: number;
}

export function StatsCards({ occupiedCount, totalTables, pendingCount, callCount }: StatsCardsProps) {
  const stats = [
    {
      label: "Tables occupées",
      value: occupiedCount,
      of: totalTables,
      color: "text-[#3B82F6]",
      bg: "bg-[#EFF6FF] border-[#BFDBFE]"
    },
    {
      label: "Commandes en attente",
      value: pendingCount,
      color: "text-[#D97706]",
      bg: "bg-[#FFFBEB] border-[#FDE68A]"
    },
    {
      label: "Appels clients",
      value: callCount,
      color: callCount > 0 ? "text-[#EF4444]" : "text-[#9CA3AF]",
      bg: callCount > 0 ? "bg-[#FEF2F2] border-[#FECACA]" : "bg-white border-[#E5E7EB]"
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 shrink-0">
      {stats.map(stat => (
        <div key={stat.label} className={`rounded-xl p-2 sm:p-3 text-center border ${stat.bg}`}>
          <p className={`text-xl sm:text-2xl ${stat.color}`}>
            {stat.value}
            {stat.of && <span className="text-xs sm:text-base opacity-50">/{stat.of}</span>}
          </p>
          <p className="text-[#6B7280] text-[10px] sm:text-xs mt-0.5 leading-tight">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}