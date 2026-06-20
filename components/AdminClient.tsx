"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Account, Rank, SiteSettings, RANK_COLORS } from "@/lib/types";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  LogOut,
  Settings,
  ShoppingBag,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AdminClientProps {
  initialAccounts: Account[];
  initialSettings: SiteSettings;
  initialRanks: Rank[];
}

type Tab = "accounts" | "settings" | "ranks";

const emptyAccount = {
  price: 0,
  rank: "unranked",
  description: "",
  imageUrl: "",
  sold: false,
};

export default function AdminClient({
  initialAccounts,
  initialSettings,
  initialRanks,
}: AdminClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("accounts");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [settings, setSettings] = useState(initialSettings);
  const [ranks, setRanks] = useState(initialRanks);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // New account form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAccount, setNewAccount] = useState({ ...emptyAccount });

  // Edit account
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Account>>({});

  // Edit rank
  const [editingRankId, setEditingRankId] = useState<string | null>(null);
  const [editRankUrl, setEditRankUrl] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  };

  // ACCOUNTS
  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (!res.ok) throw new Error();
      const { account } = await res.json();
      setAccounts((prev) => [...prev, account]);
      setNewAccount({ ...emptyAccount });
      setShowNewForm(false);
      showToast("เพิ่มบัญชีสำเร็จ");
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("ต้องการลบบัญชีนี้?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      showToast("ลบบัญชีสำเร็จ");
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error();
      const { account } = await res.json();
      setAccounts((prev) => prev.map((a) => (a.id === id ? account : a)));
      setEditingId(null);
      showToast("อัปเดตบัญชีสำเร็จ");
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditData({
      price: account.price,
      rank: account.rank,
      description: account.description,
      imageUrl: account.imageUrl,
      sold: account.sold,
    });
  };

  // SETTINGS
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      showToast("บันทึกการตั้งค่าสำเร็จ");
      router.refresh();
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  // RANKS
  const handleUpdateRank = async (id: string, imageUrl: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ranks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, imageUrl }),
      });
      if (!res.ok) throw new Error();
      setRanks((prev) => prev.map((r) => (r.id === id ? { ...r, imageUrl } : r)));
      setEditingRankId(null);
      showToast("อัปเดตรูปแรงค์สำเร็จ");
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  const rankMap = Object.fromEntries(ranks.map((r) => [r.id, r]));

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-game font-bold text-3xl uppercase tracking-widest text-gradient"
              style={{ letterSpacing: "0.15em" }}
            >
              ADMIN PANEL
            </h1>
            <p className="text-sm mt-1" style={{ color: "#555" }}>
              จัดการข้อมูลบัญชี Valorant
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut size={14} />
            ออกจากระบบ
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-8 w-fit"
          style={{ background: "#111", border: "1px solid #1e1e1e" }}
        >
          {([
            { key: "accounts", label: "บัญชี", icon: ShoppingBag },
            { key: "settings", label: "การตั้งค่า", icon: Settings },
            { key: "ranks", label: "แรงค์", icon: Shield },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="font-game text-sm font-semibold uppercase tracking-wider px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
              style={{
                background: tab === key ? "linear-gradient(135deg, #ff6b2b, #ea580c)" : "transparent",
                color: tab === key ? "white" : "#555",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ---- TAB: ACCOUNTS ---- */}
        {tab === "accounts" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: "#555" }}>
                {accounts.length} บัญชี · {accounts.filter((a) => !a.sold).length} พร้อมขาย
              </p>
              <button
                onClick={() => setShowNewForm((v) => !v)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={14} />
                เพิ่มบัญชีใหม่
              </button>
            </div>

            {/* New account form */}
            {showNewForm && (
              <div
                className="rounded-xl p-6 mb-6"
                style={{ background: "#111", border: "1px solid rgba(255,107,43,0.3)" }}
              >
                <h3
                  className="font-game font-bold text-lg uppercase tracking-wider mb-5"
                  style={{ color: "#FF6B2B" }}
                >
                  เพิ่มบัญชีใหม่
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>
                      ราคา (THB)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newAccount.price || ""}
                      onChange={(e) => setNewAccount((p) => ({ ...p, price: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>
                      แรงค์
                    </label>
                    <select
                      value={newAccount.rank}
                      onChange={(e) => setNewAccount((p) => ({ ...p, rank: e.target.value }))}
                    >
                      {ranks.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>
                      URL รูปภาพ
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newAccount.imageUrl}
                      onChange={(e) => setNewAccount((p) => ({ ...p, imageUrl: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>
                      รายละเอียด
                    </label>
                    <textarea
                      placeholder="รายละเอียดบัญชี..."
                      value={newAccount.description}
                      onChange={(e) => setNewAccount((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={14} />
                    {loading ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={14} />
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}

            {/* Account list */}
            <div className="flex flex-col gap-4">
              {accounts.length === 0 && (
                <div className="text-center py-16" style={{ color: "#333" }}>
                  <p className="font-game text-xl">ยังไม่มีบัญชี</p>
                </div>
              )}
              {accounts.map((account) => {
                const rank = rankMap[account.rank];
                const tierColor = rank ? RANK_COLORS[rank.tier] || "#FF6B2B" : "#FF6B2B";
                const isEditing = editingId === account.id;

                return (
                  <div
                    key={account.id}
                    className="rounded-xl overflow-hidden"
                    style={{ background: "#111", border: `1px solid ${isEditing ? "rgba(255,107,43,0.3)" : "#1e1e1e"}` }}
                  >
                    {!isEditing ? (
                      <div className="flex items-start gap-4 p-5">
                        {/* Thumbnail */}
                        <div
                          className="relative rounded-lg flex-shrink-0 overflow-hidden"
                          style={{
                            width: 96,
                            height: 54,
                            background: "#0f0f0f",
                            border: "1px solid #1e1e1e",
                          }}
                        >
                          {account.imageUrl ? (
                            <Image src={account.imageUrl} alt="" fill className="object-cover" />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center font-game text-xs font-bold"
                              style={{ color: "#333" }}
                            >
                              #{account.number}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-game font-bold text-sm" style={{ color: "#FF6B2B" }}>
                              #{account.number}
                            </span>
                            <span className="font-game text-xs uppercase tracking-wider" style={{ color: tierColor }}>
                              {rank?.name || account.rank}
                            </span>
                            <span className="font-game font-bold text-sm text-gradient">
                              ฿{account.price.toLocaleString()}
                            </span>
                            {account.sold ? (
                              <span className="inline-flex items-center gap-1 text-xs font-game px-2 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                                <XCircle size={10} /> SOLD
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-game px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                                <CheckCircle size={10} /> พร้อมขาย
                              </span>
                            )}
                          </div>
                          <p className="text-xs line-clamp-1" style={{ color: "#555" }}>
                            {account.description || "ไม่มีรายละเอียด"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEdit(account)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#555", background: "transparent" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#FF6B2B"; e.currentTarget.style.background = "rgba(255,107,43,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.background = "transparent"; }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#555", background: "transparent" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.background = "transparent"; }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5">
                        <h4 className="font-game font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "#FF6B2B" }}>
                          แก้ไขบัญชี #{account.number}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>ราคา (THB)</label>
                            <input
                              type="number"
                              value={editData.price ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, price: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>แรงค์</label>
                            <select
                              value={editData.rank ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, rank: e.target.value }))}
                            >
                              {ranks.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>URL รูปภาพ</label>
                            <input
                              type="text"
                              value={editData.imageUrl ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, imageUrl: e.target.value }))}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>รายละเอียด</label>
                            <textarea
                              value={editData.description ?? ""}
                              onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editData.sold ?? false}
                                onChange={(e) => setEditData((p) => ({ ...p, sold: e.target.checked }))}
                                className="w-4 h-4 rounded"
                                style={{ accentColor: "#FF6B2B" }}
                              />
                              <span className="font-game text-sm uppercase tracking-wider" style={{ color: "#888" }}>
                                ขายแล้ว (Sold)
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleUpdateAccount(account.id)}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                          >
                            <Save size={14} />
                            {loading ? "กำลังบันทึก..." : "บันทึก"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <X size={14} /> ยกเลิก
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- TAB: SETTINGS ---- */}
        {tab === "settings" && (
          <div
            className="rounded-xl p-6"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          >
            <h3 className="font-game font-bold text-lg uppercase tracking-wider mb-6" style={{ color: "#FF6B2B" }}>
              การตั้งค่าเว็บไซต์
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {([
                { key: "siteName", label: "ชื่อเว็บ" },
                { key: "logoText", label: "โลโก้ (ส่วนแรก)" },
                { key: "logoSubtext", label: "โลโก้ (ส่วนหลัง)" },
                { key: "heroTitle", label: "หัวข้อหลัก" },
                { key: "heroSubtitle", label: "คำอธิบายหลัก" },
                { key: "contactLine", label: "LINE ID" },
                { key: "contactDiscord", label: "Discord" },
              ] as const).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-game uppercase tracking-wider mb-1" style={{ color: "#555" }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    value={settings[key]}
                    onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="btn-primary mt-6 flex items-center gap-2"
            >
              <Save size={14} />
              {loading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </button>
          </div>
        )}

        {/* ---- TAB: RANKS ---- */}
        {tab === "ranks" && (
          <div>
            <p className="text-sm mb-6" style={{ color: "#555" }}>
              เปลี่ยน URL รูปภาพของแต่ละแรงค์ได้ที่นี่ (รองรับ URL จากอินเทอร์เน็ตหรือ /ranks/xxx.png)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ranks.map((rank) => {
                const color = RANK_COLORS[rank.tier] || "#555";
                const isEditing = editingRankId === rank.id;
                return (
                  <div
                    key={rank.id}
                    className="rounded-xl p-3"
                    style={{
                      background: "#111",
                      border: `1px solid ${isEditing ? "rgba(255,107,43,0.4)" : "#1e1e1e"}`,
                    }}
                  >
                    {/* Rank icon */}
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `radial-gradient(circle, ${color}22, transparent)`,
                        boxShadow: `0 0 10px ${color}44`,
                      }}
                    >
                      {rank.imageUrl ? (
                        <Image src={rank.imageUrl} alt={rank.name} fill className="object-contain p-1" />
                      ) : (
                        <span className="font-game font-bold text-lg" style={{ color }}>
                          {rank.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <p className="font-game text-xs font-semibold text-center uppercase tracking-wider mb-2" style={{ color }}>
                      {rank.name}
                    </p>

                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingRankId(rank.id);
                          setEditRankUrl(rank.imageUrl);
                        }}
                        className="w-full font-game text-xs uppercase tracking-wider py-1.5 rounded transition-all"
                        style={{
                          background: "transparent",
                          color: "#444",
                          border: "1px solid #222",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#FF6B2B"; e.currentTarget.style.borderColor = "#FF6B2B44"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "#222"; }}
                      >
                        แก้ไขรูป
                      </button>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          placeholder="URL รูปภาพ"
                          value={editRankUrl}
                          onChange={(e) => setEditRankUrl(e.target.value)}
                          style={{ fontSize: "0.65rem", padding: "4px 8px" }}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateRank(rank.id, editRankUrl)}
                            className="flex-1 font-game text-xs uppercase py-1 rounded"
                            style={{ background: "#FF6B2B", color: "white" }}
                          >
                            <Save size={10} className="inline" />
                          </button>
                          <button
                            onClick={() => setEditingRankId(null)}
                            className="flex-1 font-game text-xs uppercase py-1 rounded"
                            style={{ background: "#1e1e1e", color: "#888" }}
                          >
                            <X size={10} className="inline" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 rounded-xl font-game text-sm font-semibold tracking-wider shadow-xl z-50"
          style={{
            background: toast.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
            color: toast.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
