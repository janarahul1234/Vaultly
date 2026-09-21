import {
  ArrowRightIcon,
  CloudIcon,
  HeartIcon,
  LockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppMockup } from "@/components/landing/app-mockup";
import { SectionBadge } from "@/components/landing/section-badge";

const trustPoints = [
  {
    label: ["End-to-end", "encryption"],
    icon: LockIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    label: ["Access", "anywhere"],
    icon: CloudIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    label: ["Open source", "& free"],
    icon: HeartIcon,
    tint: "bg-primary/10 text-primary",
  },
];

// Static handwritten-style arrow pointing at the mockup.
const AnnotationArrow = () => (
  <svg
    aria-hidden
    viewBox="0 0 64 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-10 text-primary rotate-230 -translate-y-3"
  >
    <path d="M10 32 12 20M10 32l13 3" />
    <path d="M60 8C42 4 20 12 10 32" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <SectionBadge label="Your Digital Vault" />
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Keep your digital life{" "}
            <span className="text-primary">safe and simple.</span>
          </h1>
          <p className="max-w-md text-base text-muted-foreground text-pretty">
            Store your passwords, notes, files, and more in one secure place.
            Accessible anytime, anywhere.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="#get-started" />}
              className="font-sans"
            >
              Get started for free
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-8 pt-2">
            {trustPoints.map((point) => (
              <div key={point.label[0]} className="flex items-center gap-2">
                <span
                  className={`flex size-8 items-center justify-center rounded-full ${point.tint}`}
                >
                  <point.icon size={20} />
                </span>
                <span className="flex flex-col text-xs leading-tight font-heading font-medium">
                  {point.label[0]}
                  <span className="text-muted-foreground">
                    {point.label[1]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <AppMockup />
          <div className="mt-6 flex items-end justify-end pr-6">
            <AnnotationArrow />
            <p className="max-w-48 text-right text-sm italic text-primary">
              All your important things, in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
