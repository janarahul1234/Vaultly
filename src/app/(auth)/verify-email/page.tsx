import type { Metadata } from "next";
import { VerifyEmailCard } from "@/components/verify-email/verify-email-card";

export const metadata: Metadata = {
  title: "Verify your email — Vaultly",
  description:
    "Check your inbox for the Vaultly confirmation link to verify your email address and activate your account.",
};

// Hoisted so the pattern is compiled once (js-hoist-regexp).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  // The email is only serialized down to the client as a plain string
  // (server-serialization).
  const { email } = await searchParams;
  const targetEmail =
    email && EMAIL_PATTERN.test(email) ? email : "you@example.com";

  return (
    <main className="flex flex-1 items-center justify-center bg-muted/50 px-4 pb-10 sm:px-6">
      <VerifyEmailCard email={targetEmail} />
    </main>
  );
}
