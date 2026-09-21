import { CheckIcon, LockKeyholeIcon, ShieldLock } from "lucide-react";

import { signupFloatingTiles, signupPerks } from "@/data/user";

import { cn } from "@/lib/utils";
import type { SignupShowcaseProps } from "@/types/user";

// Decorative perks and floating tiles are static data hoisted to
// @/data/user (rendering-hoist-jsx) — this panel ships zero client JS.

export function SignupShowcase({
  headline = "Start securing your digital life",
}: SignupShowcaseProps) {
  return (
    <aside className="relative hidden flex-col gap-10 overflow-hidden bg-linear-to-b from-primary/10 via-primary/5 to-background p-10 lg:flex xl:p-8">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldLock className="size-6" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-xl font-semibold">Vaultly</span>
          <span className="text-xs text-muted-foreground">
            Your Digital Vault
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance xl:text-4xl">
          {headline}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Create your free account and keep your passwords, notes, files, and
          more in one secure place.
        </p>
      </div>

      {/* Illustration */}
      <div className="relative flex min-h-72 flex-1 items-center justify-center">
        <div className="absolute size-72 rounded-full bg-primary/15 blur-3xl" />

        {/* Browser mockup */}
        <div className="relative w-full max-w-64 rounded-2xl border bg-card/90 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="flex items-center gap-1.5 border-b px-3 py-2">
            <span className="size-2 rounded-full bg-muted-foreground/20" />
            <span className="size-2 rounded-full bg-muted-foreground/20" />
            <span className="size-2 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="h-6 w-2/3 rounded-md bg-primary/80" />
            <div className="flex flex-col gap-2 pt-1">
              <div className="h-2.5 w-full rounded-full bg-muted-foreground/15" />
              <div className="h-2.5 w-5/6 rounded-full bg-muted-foreground/15" />
              <div className="h-2.5 w-4/6 rounded-full bg-muted-foreground/15" />
              <div className="h-2.5 w-full rounded-full bg-muted-foreground/10" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <LockKeyholeIcon className="size-8" />
            </span>
          </div>
        </div>

        {/* Floating category tiles */}
        {signupFloatingTiles.map((tile) => (
          <div
            key={tile.label}
            className={cn(
              "absolute flex size-22 flex-col items-center justify-center gap-1.5 rounded-2xl border bg-card shadow-lg shadow-foreground/5",
              tile.position,
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-xl",
                tile.tint,
              )}
            >
              <tile.icon size={20} />
            </span>
            <span className="text-xs font-medium">{tile.label}</span>
          </div>
        ))}
      </div>

      {/* Perks */}
      <ul className="grid sm:grid-cols-3">
        {signupPerks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm">
            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon className="size-3" />
            </span>
            <span className="leading-tight">{perk}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs italic text-muted-foreground text-center">
        “A simpler, safer way to organize your digital life.”
      </p>
    </aside>
  );
}
