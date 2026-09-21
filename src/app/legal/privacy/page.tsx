import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy — Vaultly",
  description:
    "How Vaultly handles your data: what is stored, what is never stored, and who processes it.",
};

const sections = [
  {
    heading: "1. What we collect",
    body: "To run your account we store the minimum: your email address, display name, and a hashed password — handled by our authentication provider, Supabase. Beyond that, we store the vault items you choose to save (titles, usernames, categories, tags and encrypted secrets).",
  },
  {
    heading: "2. What we never do",
    body: "We do not sell your data, run advertising trackers, or read the contents of your vault. Vault items are scoped to your user id by row-level security, so no other user — and no anonymous request — can read them.",
  },
  {
    heading: "3. Session cookies",
    body: "Vaultly uses essential authentication cookies to keep you signed in between visits. There are no analytics or marketing cookies. OAuth buttons (Google, GitHub) hand off directly to the chosen provider under its own privacy policy.",
  },
  {
    heading: "4. Where data lives",
    body: "Application data is hosted on Supabase (Postgres). If you deploy your own copy of this open source project, your data stays entirely in the infrastructure you control.",
  },
  {
    heading: "5. Deletion",
    body: "You can trash, restore or permanently delete any vault item from the dashboard at any time. Deleting your account removes your profile and, via cascades, everything in your vault.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 md:px-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Legal
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map(({ heading, body }) => (
          <section key={heading} className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold">{heading}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {body}
            </p>
          </section>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
          className="font-sans"
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back home
        </Button>
        <span className="text-sm text-muted-foreground">
          Also see our{" "}
          <Link
            href="/legal/terms"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          .
        </span>
      </div>
    </main>
  );
}
