import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service — Vaultly",
  description:
    "The terms that apply when you use Vaultly, the open source password vault.",
};

const sections = [
  {
    heading: "1. The service",
    body: "Vaultly is an open source password vault that lets you store passwords, notes and other small items in a personal, access-controlled workspace. The service is provided free of charge, on an “as is” basis, without warranties of any kind.",
  },
  {
    heading: "2. Your account",
    body: "You are responsible for keeping your login credentials and master password secret, and for all activity that happens under your account. We strongly recommend using a unique, strong password and a password manager.",
  },
  {
    heading: "3. Acceptable use",
    body: "You agree not to use Vaultly to store unlawful content, to attempt to gain access to other users' vaults, or to interfere with the service. We may suspend access that abuses the platform.",
  },
  {
    heading: "4. Your data",
    body: "Your vault items belong to you. You can delete items — or permanently erase them — at any time from the dashboard. See our Privacy Policy for details on what is processed and how it is protected.",
  },
  {
    heading: "5. Changes",
    body: "This is a living document for an open source project; it may be updated as features change. Continued use of Vaultly after an update means you accept the new terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 md:px-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Legal
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
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
          Questions? Open an issue on the project repository.
        </span>
      </div>
    </main>
  );
}
