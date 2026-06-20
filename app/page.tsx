import { readDB } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AccountCard from "@/components/AccountCard";
import HomeClient from "@/components/HomeClient";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  noStore();
  const db = await readDB();
  const { accounts, settings, ranks } = db;

  const activeAccounts = accounts.filter((a) => !a.sold);
  const soldAccounts = accounts.filter((a) => a.sold);

  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar logoText={settings.logoText} logoSubtext={settings.logoSubtext} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,43,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-game text-xs font-semibold uppercase tracking-widest text-orange-500">
              พร้อมขาย {activeAccounts.length} บัญชี
            </span>
          </div>

          <h1
            className="font-game font-bold mb-4 leading-tight"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "0.05em",
              color: "#E8E8E8",
            }}
          >
            {settings.heroTitle.split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                <span
                  className={
                    word === "ACCOUNT" || word === "บัญชี"
                      ? "text-gradient"
                      : ""
                  }
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: "#666", fontFamily: "Inter, sans-serif" }}
          >
            {settings.heroSubtitle}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: "บัญชีพร้อมขาย", value: activeAccounts.length },
              { label: "ขายไปแล้ว", value: soldAccounts.length },
              { label: "รับประกัน", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-game font-bold text-3xl text-gradient"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "#555" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-1 h-8 rounded-full"
              style={{ background: "linear-gradient(to bottom, #FF6B2B, transparent)" }}
            />
            <h2
              className="font-game font-bold text-2xl uppercase tracking-wider"
              style={{ letterSpacing: "0.1em", color: "#E8E8E8" }}
            >
              บัญชีทั้งหมด
            </h2>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }}
            />
          </div>

          {accounts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-game text-2xl font-semibold" style={{ color: "#333" }}>
                ยังไม่มีบัญชีในระบบ
              </p>
              <p className="text-sm mt-2" style={{ color: "#444" }}>
                แอดมินสามารถเพิ่มบัญชีได้ที่หน้า admin
              </p>
            </div>
          ) : (
            <HomeClient accounts={accounts} ranks={ranks} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderColor: "#1e1e1e", background: "#080808" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-game text-sm" style={{ color: "#444" }}>
            <span className="text-gradient font-bold">{settings.logoText}{settings.logoSubtext}</span>
            {" "}— Valorant Account Shop
          </div>
          <div className="flex gap-6 text-sm" style={{ color: "#444" }}>
            {settings.contactLine && (
              <span>LINE: {settings.contactLine}</span>
            )}
            {settings.contactDiscord && (
              <span>Discord: {settings.contactDiscord}</span>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
