import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { SectionBadge } from "@/components/landing/section-badge";

const testimonials = [
  {
    quote:
      "Vaultly has completely simplified how I manage my digital life. Clean, fast, and super secure!",
    name: "Priya S.",
    role: "Student",
    initials: "PS",
  },
  {
    quote:
      "The open source approach gives me confidence. Finally a password manager I can trust.",
    name: "Aman Verma",
    role: "Developer",
    initials: "AV",
  },
  {
    quote: "Simple, beautiful, and does everything I need. Highly recommended!",
    name: "Neha K.",
    role: "Freelancer",
    initials: "NK",
  },
];

function StarRating() {
  return (
    <div
      className="flex items-center gap-1 text-amber-400"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="fill-current" size={20} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 md:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <SectionBadge label="Testimonials" />
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Loved by users everywhere.
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what our community has to say about Vaultly.
          </p>
        </div>
        <div className="grid w-full gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="items-stretch">
              <CardHeader>
                <p className="text-sm text-foreground/80 text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </CardHeader>
              <CardFooter className="border-t-0 bg-transparent">
                <div className="flex w-full items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-heading font-semibold">
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <StarRating />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
