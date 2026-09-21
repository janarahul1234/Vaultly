import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found — Vaultly",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="text-sm font-medium text-muted-foreground">404</span>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        This page couldn&apos;t be found
      </h1>
      <p className="max-w-md text-muted-foreground text-sm">
        The link may be broken, or the page may have been moved. Let&apos;s get
        you back somewhere useful.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          className="font-sans"
        >
          Back home
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard" />}
          variant="outline"
          className="font-sans"
        >
          Go to dashboard
        </Button>
      </div>
    </main>
  );
}
