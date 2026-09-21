import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SectionBadgeProps } from "@/types/landing";

export function SectionBadge({ label, className }: SectionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 bg-background px-2.5 py-3 font-medium", className)}
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      {label}
    </Badge>
  );
}
