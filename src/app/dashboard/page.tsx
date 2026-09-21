import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Dashboard } from "@/components/dashboard/dashboard";
import { getVaultData } from "@/lib/supabase/vault-queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — Vaultly",
  description: "Manage your saved passwords, notes, and cards in one place.",
};

// Reads the session cookie via the Supabase server client, so this route is
// always dynamic — vault data is never statically cached or shared across
// users.
export default async function DashboardPage() {
  // The Proxy already guards this route, but re-verify the token here so a
  // direct render can never leak the dashboard to an anonymous visitor.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/signin");
  }

  // Fetch on the server (Next.js-preferred read path): the initial paint has
  // real data and secrets never round-trip through a client fetch.
  const vault = await getVaultData();

  return <Dashboard data={vault} />;
}
