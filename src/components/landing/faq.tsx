import { MessageCircleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionBadge } from "@/components/landing/section-badge";

const faqs = [
  {
    question: "Is Vaultly really free?",
    answer:
      "Yes! Vaultly is completely free and open source. All core features — passwords, notes, files, and sync — are available at no cost, forever.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is protected with end-to-end encryption using a zero-knowledge architecture. Only you hold your master key — we can never read your vault.",
  },
  {
    question: "Can I access Vaultly on multiple devices?",
    answer:
      "Absolutely. Vaultly syncs securely across web, desktop, and mobile, so your vault is always up to date wherever you are.",
  },
  {
    question: "Is Vaultly open source?",
    answer:
      "Yes, the entire codebase is open source and auditable by anyone. You can inspect, build, and even self-host Vaultly yourself.",
  },
  {
    question: "What kind of files can I store?",
    answer:
      "You can store any file type — documents, images, videos, and more — encrypted and organized with categories and tags.",
  },
];

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
