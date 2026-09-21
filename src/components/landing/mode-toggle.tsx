"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Which icon shows is handled purely with dark: variants, so no state is
// needed and there's no hydration mismatch. The initial theme class is
// applied by an inline script in layout.tsx (rendering-hydration-no-flicker).
export function ModeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    // Persist the choice so the inline init script in layout.tsx restores it
    // on the next load instead of falling back to prefers-color-scheme.
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage may be unavailable (private mode / SSR) — ignore.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
