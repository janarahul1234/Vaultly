import { faqs } from "@/data/landing";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionBadge } from "@/components/landing/section-badge";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 md:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <SectionBadge label="FAQ" />
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about Vaultly.
          </p>
        </div>

        <Accordion className="gap-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="rounded-lg border bg-card px-4 py-0 not-last:border-b"
            >
              <AccordionTrigger className="py-3 hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
