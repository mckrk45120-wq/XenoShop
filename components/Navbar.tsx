"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavbarProps {
  logoText?: string;
  logoSubtext?: string;
}

export default function Navbar({ logoText = "VALO", logoSubtext = "STORE" }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,10,10,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1e1e1e" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span
            className="font-game font-bold text-2xl tracking-widest text-gradient"
            style={{ letterSpacing: "0.15em" }}
          >
            {logoText}
          </span>
          <span
            className="font-game font-light text-2xl tracking-widest"
            style={{ color: "#888", letterSpacing: "0.15em" }}
          >
            {logoSubtext}
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-game text-sm font-semibold uppercase tracking-wider transition-colors duration-200"
            style={{ color: pathname === "/" ? "#FF6B2B" : "#888" }}
          >
            หน้าหลัก
          </Link>

          {isAdmin && (
            <span
              className="font-game text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FF6B2B" }}
            >
              ADMIN
            </span>
          )}

          {!isAdmin && (
            <Link
              href="/admin"
              className="font-game text-xs font-medium uppercase tracking-widest transition-all duration-200 px-3 py-1.5 rounded"
              style={{
                color: "#444",
                border: "1px solid #222",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FF6B2B";
                e.currentTarget.style.borderColor = "#FF6B2B44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#444";
                e.currentTarget.style.borderColor = "#222";
              }}
            >
              admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
