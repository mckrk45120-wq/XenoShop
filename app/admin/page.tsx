import { cookies } from "next/headers";
import { readDB } from "@/lib/db";
import AdminClient from "@/components/AdminClient";
import AdminLoginForm from "@/components/AdminLoginForm";
import Navbar from "@/components/Navbar";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminPage() {
  noStore();
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("admin_auth")?.value === "true";

  const db = await readDB();

  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar logoText={db.settings.logoText} logoSubtext={db.settings.logoSubtext} />
      <div className="pt-16">
        {isAuth ? (
          <AdminClient
            initialAccounts={db.accounts}
            initialSettings={db.settings}
            initialRanks={db.ranks}
          />
        ) : (
          <AdminLoginForm />
        )}
      </div>
    </main>
  );
}
