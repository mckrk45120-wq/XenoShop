"use client";

import { useState } from "react";
import { Account, Rank } from "@/lib/types";
import AccountCard from "./AccountCard";

interface HomeClientProps {
  accounts: Account[];
  ranks: Rank[];
}

const TIER_ORDER = [
  "radiant",
  "immortal",
  "ascendant",
  "diamond",
  "platinum",
  "gold",
  "silver",
  "bronze",
  "iron",
  "unranked",
];

export default function HomeClient({ accounts, ranks }: HomeClientProps) {
  const [filter, setFilter] = useState<"all" | "available" | "sold">("available");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "rank">("newest");

  const rankMap = Object.fromEntries(ranks.map((r) => [r.id, r]));

  let filtered = accounts.filter((a) => {
    if (filter === "available") return !a.sold;
    if (filter === "sold") return a.sold;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rank") {
      const ra = rankMap[a.rank];
      const rb = rankMap[b.rank];
      const ia = ra ? TIER_ORDER.indexOf(ra.tier) : 99;
      const ib = rb ? TIER_ORDER.indexOf(rb.tier) : 99;
      return ia - ib;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          {(["available", "all", "sold"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-game text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded transition-all duration-200"
              style={{
                background: filter === f ? "linear-gradient(135deg, #ff6b2b, #ea580c)" : "transparent",
                color: filter === f ? "white" : "#666",
              }}
            >
              {f === "available" ? "พร้อมขาย" : f === "sold" ? "ขายแล้ว" : "ทั้งหมด"}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs" style={{ color: "#555" }}>เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="font-game text-xs uppercase tracking-wider px-3 py-2 rounded"
            style={{ background: "#111", border: "1px solid #1e1e1e", color: "#888", minWidth: 140 }}
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price-asc">ราคา: ต่ำ → สูง</option>
            <option value="price-desc">ราคา: สูง → ต่ำ</option>
            <option value="rank">แรงค์</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-game text-xl font-semibold" style={{ color: "#333" }}>
            ไม่พบบัญชี
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((account, i) => (
            <AccountCard
              key={account.id}
              account={account}
              rank={rankMap[account.rank]}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
