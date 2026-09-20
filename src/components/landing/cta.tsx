import { ArrowRightIcon, FolderOpenIcon, LockKeyholeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "@/components/landing/section-badge";

export function CallToAction() {
  return (
    <section
      id="get-started"
      className="scroll-mt-20 px-4 py-16 md:px-6 lg:py-20"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-3xl bg-primary/5 px-6 py-16 text-center lg:py-20">
        {/* Decorative floating tiles */}
        <div className="pointer-events-none absolute top-1/2 left-8 hidden -translate-y-1/2 -rotate-12 lg:block">
          <span className="flex size-18 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-white shadow-lg shadow-primary/10">
            <LockKeyholeIcon size={32} />
          </span>
        </div>
        <div className="pointer-events-none absolute top-1/2 right-8 hidden translate-y-[-25%] rotate-12 lg:block">
          <span className="flex size-18 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-white shadow-lg shadow-primary/10">
            <FolderOpenIcon size={32} />
          </span>
        </div>

        <SectionBadge label="Ready to get started?" />
        <h2 className="font-heading max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Take control of your digital life today.
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground text-pretty">
          Join thousands of users already using Vaultly to stay secure and
          organized.
        </p>
        <Button
          size="lg"
          className="font-sans mt-2"
          nativeButton={false}
          render={<a href="#" />}
        >
          Get started for free
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <p className="text-xs text-muted-foreground">
          No credit card required. Always free and open source.
        </p>
      </div>
    </section>
  );
}
