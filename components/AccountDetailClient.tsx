"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Account, Rank, SiteSettings, RANK_COLORS } from "@/lib/types";
import RankBadge from "./RankBadge";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface AccountDetailClientProps {
  account: Account;
  rank: Rank | undefined;
  settings: SiteSettings;
}

export default function AccountDetailClient({
  account,
  rank,
  settings,
}: AccountDetailClientProps) {
  const [imgError, setImgError] = useState(false);
  const tierColor = rank ? RANK_COLORS[rank.tier] || "#FF6B2B" : "#FF6B2B";

  return (
    <div className="min-h-screen pt-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors duration-200 group"
          style={{ color: "#555" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B2B")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-game uppercase tracking-wider text-xs font-semibold">
            กลับหน้าหลัก
          </span>
        </Link>
      </div>

      {/* Main content - image left, info right */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT - Image */}
          <div className="sticky top-24">
            {/* Account number badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-game font-bold text-sm uppercase tracking-widest px-3 py-1 rounded"
                style={{
                  background: "rgba(255,107,43,0.1)",
                  color: "#FF6B2B",
                  border: "1px solid rgba(255,107,43,0.3)",
                }}
              >
                บัญชี #{account.number}
              </span>
              {account.sold && (
                <span
                  className="font-game font-bold text-sm uppercase tracking-widest px-3 py-1 rounded"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  SOLD
                </span>
              )}
            </div>

            {/* Main image */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                aspectRatio: "16/9",
                background: "#111",
                border: "1px solid #1e1e1e",
                boxShadow: `0 0 40px ${tierColor}22`,
              }}
            >
              {account.imageUrl && !imgError ? (
                <Image
                  src={account.imageUrl}
                  alt={`Account #${account.number}`}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="font-game font-bold text-8xl mb-2"
                      style={{ color: tierColor, opacity: 0.2 }}
                    >
                      #{account.number}
                    </div>
                    <p className="text-sm" style={{ color: "#333" }}>
                      ไม่มีรูปภาพ
                    </p>
                  </div>
                </div>
              )}

              {/* Rank overlay on image */}
              <div
                className="absolute bottom-4 left-4 flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
              >
                <RankBadge rank={rank} size="md" showName />
              </div>
            </div>

            {/* Decorative line */}
            <div
              className="mt-4 h-px w-full"
              style={{
                background: `linear-gradient(to right, ${tierColor}44, transparent)`,
              }}
            />
          </div>

          {/* RIGHT - Info */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <h1
                className="font-game font-bold leading-tight mb-2"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  letterSpacing: "0.05em",
                  color: "#E8E8E8",
                }}
              >
                VALORANT ACCOUNT
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-px" style={{ background: tierColor }} />
                <span
                  className="font-game text-sm uppercase tracking-widest"
                  style={{ color: tierColor }}
                >
                  {rank?.name || "Unknown Rank"}
                </span>
              </div>
            </div>

            {/* Info fields */}
            <div className="flex flex-col gap-4">
              {/* Field 1: Number */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#111", border: "1px solid #1e1e1e" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
                  <span
                    className="font-game text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#555" }}
                  >
                    หมายเลขบัญชี
                  </span>
                </div>
                <span
                  className="font-game font-bold text-4xl text-gradient"
                  style={{ letterSpacing: "0.05em" }}
                >
                  #{account.number}
                </span>
              </div>

              {/* Field 2: Price */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(255,107,43,0.08), rgba(255,107,43,0.02))",
                  border: "1px solid rgba(255,107,43,0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
                  <span
                    className="font-game text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#555" }}
                  >
                    ราคา
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-game font-bold text-5xl text-gradient"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    ฿{account.price.toLocaleString()}
                  </span>
                  <span className="font-game text-lg" style={{ color: "#555" }}>THB</span>
                </div>
              </div>

              {/* Field 3: Description */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#111", border: "1px solid #1e1e1e" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
                  <span
                    className="font-game text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#555" }}
                  >
                    รายละเอียด
                  </span>
                </div>
                <p
                  className="leading-relaxed text-sm whitespace-pre-line"
                  style={{ color: "#aaa", fontFamily: "Inter, sans-serif" }}
                >
                  {account.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>

              {/* Rank display */}
              {rank && (
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: `linear-gradient(135deg, ${tierColor}11, transparent)`,
                    border: `1px solid ${tierColor}33`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: tierColor }} />
                    <span
                      className="font-game text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#555" }}
                    >
                      แรงค์
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <RankBadge rank={rank} size="lg" />
                    <div>
                      <p
                        className="font-game font-bold text-2xl uppercase tracking-wider"
                        style={{ color: tierColor }}
                      >
                        {rank.name}
                      </p>
                      <p className="text-xs mt-0.5 capitalize" style={{ color: "#555" }}>
                        {rank.tier} tier
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            {!account.sold ? (
              <div
                className="rounded-xl p-5"
                style={{ background: "#111", border: "1px solid #1e1e1e" }}
              >
                <p
                  className="font-game text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "#555" }}
                >
                  ติดต่อซื้อ
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {settings.contactLine && (
                    <a
                      href={`https://line.me/ti/p/${settings.contactLine.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center gap-2 flex-1 no-underline"
                    >
                      <MessageCircle size={16} />
                      LINE: {settings.contactLine}
                    </a>
                  )}
                  {settings.contactDiscord && (
                    <button
                      onClick={() => navigator.clipboard.writeText(settings.contactDiscord)}
                      className="btn-secondary flex items-center justify-center gap-2 flex-1"
                    >
                      Discord: {settings.contactDiscord}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl p-5 text-center"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <p className="font-game font-bold text-2xl tracking-widest text-red-500">
                  บัญชีนี้ถูกขายไปแล้ว
                </p>
                <p className="text-sm mt-2" style={{ color: "#555" }}>
                  ดูบัญชีอื่นที่ยังพร้อมขาย
                </p>
                <Link href="/" className="btn-secondary inline-block mt-4">
                  ดูบัญชีอื่น
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
