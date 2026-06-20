import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A0A0A" }}
    >
      <div className="text-center">
        <div
          className="font-game font-bold mb-4"
          style={{ fontSize: "8rem", lineHeight: 1, color: "#1e1e1e" }}
        >
          404
        </div>
        <p
          className="font-game text-xl font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#555" }}
        >
          ไม่พบหน้านี้
        </p>
        <p className="text-sm mb-8" style={{ color: "#333" }}>
          บัญชีหรือหน้าที่คุณกำลังมองหาไม่มีอยู่
        </p>
        <Link href="/" className="btn-primary">
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
