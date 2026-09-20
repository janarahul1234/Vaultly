"use client";

import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

// Cooldown window (seconds) before another confirmation link can be requested.
const RESEND_COOLDOWN_SECONDS = 30;

export function ResendEmailButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0);
  const cooling = cooldown > 0;

  // The interval only runs while the cooldown is active (primitive dep).
  useEffect(() => {
    if (!cooling) return;
    const id = setInterval(
      () => setCooldown((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [cooling]);

  const handleResend = () => {
    if (isPending || cooling) return;

    // Demo request — replace with a server action / API call.
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.add({
        type: "success",
        title: "Confirmation email resent",
        description: `A fresh link is on its way to ${email}.`,
      });
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="font-sans"
      onClick={handleResend}
      disabled={isPending || cooling}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <RefreshCwIcon data-icon="inline-start" />
      )}
      {isPending
        ? "Sending..."
        : cooling
          ? `Resend in ${cooldown}s`
          : "Resend email"}
    </Button>
  );
}
