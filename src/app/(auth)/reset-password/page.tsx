import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password/reset-password-form";

export const metadata: Metadata = {
  title: "Reset your password — Vaultly",
  description:
    "Choose a new password for your Vaultly account using the link we emailed you.",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/50 px-4 py-12 sm:px-6">
      <ResetPasswordForm />
    </main>
  );
}
