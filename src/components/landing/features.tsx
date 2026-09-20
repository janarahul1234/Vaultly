import {
  FileTextIcon,
  FolderIcon,
  MonitorSmartphoneIcon,
  StarIcon,
  TagIcon,
  LockIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionBadge } from "@/components/landing/section-badge";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Secure Passwords",
    description:
      "Store and auto-fill your passwords safely with end-to-end encryption.",
    icon: LockIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Rich Notes",
    description: "Keep your ideas, notes, and important information organized.",
    icon: FileTextIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "File Storage",
    description: "Upload and store files, documents, and images securely.",
    icon: FolderIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Categories & Tags",
    description: "Organize everything your way with categories and tags.",
    icon: TagIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Favorites",
    description: "Quickly access your most important items.",
    icon: StarIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Multi-Device Sync",
    description: "Access your vault on all your devices, anytime, anywhere.",
    icon: MonitorSmartphoneIcon,
    tint: "bg-primary/10 text-primary",
  },
];

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
