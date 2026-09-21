"use client";

import { useState } from "react";
import { Earth } from "lucide-react";

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
  generic: Earth,
};

/**
 * Extracts a bare hostname from any user-entered website string
 * ("https://github.com" | "github.com/x" | "github.com" → "github.com").
 * Returns null when no valid host can be parsed, so no favicon is requested.
 */
function hostnameFromWebsite(website?: string): string | null {
  const value = website?.trim();
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//.test(value) ? value : `https://${value}`);
    return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)
      ? url.hostname
      : null;
  } catch {
    return null;
  }
}

export function ItemIcon({
  iconKey = "generic",
  website,
  className,
}: {
  iconKey?: VaultIconKey;
  website?: string;
  className?: string;
}) {
  const Icon = iconMap[iconKey] ?? Earth;
  const hostname = hostnameFromWebsite(website);
  const [failedHostname, setFailedHostname] = useState<string | null>(null);

  // Google's public favicon service — resolves even when the target site
  // blocks hotlinking, and errors surface via the img onError handler.
  const faviconSrc = hostname
    ? `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`
    : null;
  const showFavicon = faviconSrc !== null && failedHostname !== hostname;

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card text-foreground",
        className,
      )}
    >
      {showFavicon ? (
        <img
          src={faviconSrc}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          className="size-full p-2 object-contain"
          onError={() => setFailedHostname(hostname)}
        />
      ) : (
        <Icon className="size-5" />
      )}
    </span>
  );
}
