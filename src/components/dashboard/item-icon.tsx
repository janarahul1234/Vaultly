import {
  AmazonIcon,
  GitHubIcon,
  GoogleIcon,
  LinkedInIcon,
  NetflixIcon,
  NotionIcon,
  SpotifyIcon,
  XIcon,
} from "@/components/landing/brand-icons";
import { cn } from "@/lib/utils";
import type { VaultIconKey } from "@/components/dashboard/data";
import { Earth } from "lucide-react";

// Hoisted lookup — O(1) per item, no per-render allocation (js-index-maps).
const iconMap: Record<VaultIconKey, React.FC<React.ComponentProps<"svg">>> = {
  github: GitHubIcon,
  google: GoogleIcon,
  notion: NotionIcon,
  spotify: SpotifyIcon,
  netflix: NetflixIcon,
  amazon: AmazonIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
};

export function ItemIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground",
        className,
      )}
    >
      <Earth size={20} />
    </span>
  );
}
