// src/app/components/client/components/BadgePill.tsx

interface BadgePillProps {
  badge: string;
}

const badgeMap: Record<string, { emoji: string; label: string; cls: string }> = {
  vegetarian: { emoji: "🌿", label: "Végétarien", cls: "bg-green-50 text-green-700" },
  spicy: { emoji: "🌶", label: "Épicé", cls: "bg-red-50 text-red-600" },
  popular: { emoji: "⭐", label: "Populaire", cls: "bg-amber-50 text-amber-700" },
};

export function BadgePill({ badge }: BadgePillProps) {
  const b = badgeMap[badge];
  if (!b) return null;

  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs ${b.cls}`}>
      {b.emoji} {b.label}
    </span>
  );
}