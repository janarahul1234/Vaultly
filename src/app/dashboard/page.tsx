import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Dashboard } from "@/components/dashboard/dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — Vaultly",
  description: "Manage your saved passwords, notes, and cards in one place.",
};

export default async function DashboardPage() {
  // The Proxy already guards this route, but re-verify the token here so a
  // direct render can never leak the dashboard to an anonymous visitor.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/signin");
  }

  return <Dashboard />;
}
