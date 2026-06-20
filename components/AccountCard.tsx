"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Account, Rank, RANK_COLORS } from "@/lib/types";
import RankBadge from "./RankBadge";

interface AccountCardProps {
  account: Account;
  rank: Rank | undefined;
  index: number;
}

export default function AccountCard({ account, rank, index }: AccountCardProps) {
  const router = useRouter();
  const tierColor = rank ? RANK_COLORS[rank.tier] || "#555555" : "#555555";

  return (
    <div
      onClick={() => router.push(`/account/${account.id}`)}
      className="relative group cursor-pointer rounded-lg overflow-hidden card-hover"
      style={{
        background: "#111111",
        border: `1px solid #1e1e1e`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Sold overlay */}
      {account.sold && (
        <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
          <span className="font-game font-bold text-2xl tracking-widest text-red-500 rotate-[-15deg] border-2 border-red-500 px-4 py-1">
            SOLD
          </span>
        </div>
      )}

      {/* Image area - 16:9 ratio */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {account.imageUrl ? (
          <Image
            src={account.imageUrl}
            alt={`Account #${account.number}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #0f0f0f, #1a1a1a)`,
            }}
          >
            <div className="text-center opacity-30">
              <div className="font-game text-6xl font-bold text-white/20">
                #{account.number}
              </div>
            </div>
          </div>
        )}

        {/* Rank badge overlay top-left */}
        <div className="absolute top-3 left-3 z-10">
          <RankBadge rank={rank} size="sm" />
        </div>

        {/* Number badge top-right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="font-game text-sm font-bold px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#FF6B2B",
              border: "1px solid #FF6B2B44",
            }}
          >
            #{account.number}
          </span>
        </div>

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to top, ${tierColor}22, transparent)`,
          }}
        />
      </div>

      {/* Info area */}
      <div className="p-4">
        {/* Rank name */}
        <div className="flex items-center gap-2 mb-2">
          <RankBadge rank={rank} size="sm" showName />
        </div>

        {/* Description preview */}
        <p
          className="text-xs leading-relaxed mb-3 line-clamp-2"
          style={{ color: "#666" }}
        >
          {account.description || "ไม่มีรายละเอียด"}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-game text-xl font-bold text-gradient">
              ฿{account.price.toLocaleString()}
            </span>
          </div>
          <div
            className="font-game text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded"
            style={{
              background: "rgba(255, 107, 43, 0.1)",
              color: "#FF6B2B",
              border: "1px solid rgba(255, 107, 43, 0.3)",
            }}
          >
            ดูรายละเอียด
          </div>
        </div>
      </div>

      {/* Bottom glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${tierColor}, transparent)`,
        }}
      />
    </div>
  );
}
