import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VALO STORE - Valorant Account Shop",
  description: "ขายบัญชี Valorant คุณภาพ ราคาสมเหตุสมผล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
