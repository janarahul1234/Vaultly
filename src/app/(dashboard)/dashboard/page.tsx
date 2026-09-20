import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Vaultly",
  description: "Manage your saved passwords, notes, and cards in one place.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
