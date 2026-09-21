import { features } from "@/data/landing";

import { Card, CardContent } from "@/components/ui/card";
import { SectionBadge } from "@/components/landing/section-badge";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 md:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <SectionBadge label="Features" />
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Everything you <span className="text-primary">need, nothing</span>{" "}
            you don&apos;t.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground text-pretty">
            Vaultly combines security, simplicity, and flexibility to give you
            the best digital vault experience.
          </p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="items-start gap-3">
              <CardContent className="flex flex-col gap-2">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    feature.tint,
                  )}
                >
                  <feature.icon />
                </span>
                <h3 className="font-heading text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
