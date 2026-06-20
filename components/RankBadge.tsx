"use client";

import Image from "next/image";
import { Rank, RANK_COLORS } from "@/lib/types";

interface RankBadgeProps {
  rank: Rank | undefined;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export default function RankBadge({
  rank,
  size = "md",
  showName = false,
}: RankBadgeProps) {
  if (!rank) return null;

  const tier = rank.tier || "unranked";
  const color = RANK_COLORS[tier] || "#555555";

  const sizeMap = {
    sm: { img: 32, text: "text-xs" },
    md: { img: 48, text: "text-sm" },
    lg: { img: 80, text: "text-base" },
  };

  const { img, text } = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex-shrink-0 rounded-full overflow-hidden"
        style={{
          width: img,
          height: img,
          boxShadow: `0 0 12px ${color}66`,
          background: `radial-gradient(circle, ${color}22, transparent)`,
        }}
      >
        {rank.imageUrl ? (
          <Image
            src={rank.imageUrl}
            alt={rank.name}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-game font-bold text-xs"
            style={{ color }}
          >
            {rank.name.charAt(0)}
          </div>
        )}
      </div>
      {showName && (
        <span
          className={`font-game font-semibold uppercase tracking-wider ${text}`}
          style={{ color }}
        >
          {rank.name}
        </span>
      )}
    </div>
  );
}
