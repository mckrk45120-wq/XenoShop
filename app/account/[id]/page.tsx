import { readDB } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import AccountDetailClient from "@/components/AccountDetailClient";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: PageProps) {
  noStore();
  const { id } = await params;
  const db = await readDB();
  const account = db.accounts.find((a) => a.id === id);

  if (!account) notFound();

  const rank = db.ranks.find((r) => r.id === account.rank);

  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar logoText={db.settings.logoText} logoSubtext={db.settings.logoSubtext} />
      <AccountDetailClient account={account} rank={rank} settings={db.settings} />
    </main>
  );
}
