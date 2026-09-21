import {
  ArrowRightIcon,
  CircleCheckIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { securityFloatingCards, securityPoints } from "@/data/landing";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionBadge } from "@/components/landing/section-badge";
import { cn } from "@/lib/utils";

export function Security() {
  return (
    <section id="security" className="scroll-mt-20 bg-primary/5">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <SectionBadge label="Security First" className="bg-background/60" />
          <h2 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Your data.
            <br />
            Your control.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground text-pretty">
            We use end-to-end encryption to ensure only you can access your
            data. We never store your master password, and your data always
            remains private.
          </p>
          <ul className="flex flex-col gap-2.5">
            {securityPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CircleCheckIcon className="text-primary" />
                {point}
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#faq" />}
            className="font-sans"
          >
            Learn more about security
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          {/* Concentric rings */}
          <div className="absolute inset-8 rounded-full bg-primary/10" />
          <div className="absolute inset-20 rounded-full bg-primary/15" />

          {/* Central shield */}
          <div className="relative flex size-36 items-center justify-center text-primary sm:size-44">
            <ShieldCheckIcon
              className="absolute inset-0 size-full fill-primary stroke-primary"
              strokeWidth={1.5}
            />
            <LockIcon className="relative size-12 text-primary-foreground sm:size-14" />
          </div>

          {securityFloatingCards.map((card) => (
            <Card
              key={card.label[0]}
              size="sm"
              className={cn(
                "absolute w-auto shadow-md py-2 pr-2",
                card.position,
              )}
            >
              <CardContent className="flex items-center gap-2 py-1.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    card.tint,
                  )}
                >
                  <card.icon size={20} />
                </span>
                <span className="flex flex-col text-xs leading-tight font-heading font-semibold">
                  {card.label[0]}
                  <span className="font-mono text-muted-foreground">
                    {card.label[1]}
                  </span>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
