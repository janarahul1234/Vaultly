"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { toast } from "@/components/ui/toast";
import { signOut } from "@/lib/supabase/auth-actions";

/**
 * Shared sign-out flow used by the profile menu and the sidebar: tears down
 * the Supabase session, surfaces failures via toast, and swaps to the
 * sign-in page. `router.refresh()` re-runs the Proxy so no stale
 * server-rendered vault data survives the redirect.
 */
export function useSignOut() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);

    const result = await signOut();
    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Could not sign out",
        description: result.message,
      });
      setIsPending(false);
      return;
    }

    toast.add({
      type: "success",
      title: "Signed out",
      description: "Your vault is locked until you sign in again.",
    });
    router.replace("/signin");
    router.refresh();
  }, [isPending, router]);

  return { isPending, signOut: handleSignOut };
}
