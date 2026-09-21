"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to the server/monitoring layer; `error.digest` links
    // to the matching server-side entry in production.
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="text-sm font-medium text-muted-foreground">
        Something went wrong
      </span>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        We couldn&apos;t load this page
      </h1>
      <p className="max-w-md text-muted-foreground text-sm">
        An unexpected error occurred. You can try again, or head back to a
        known-good page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="font-sans">
          Try again
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          variant="outline"
          className="font-sans"
        >
          Back home
        </Button>
      </div>
    </main>
  );
}
