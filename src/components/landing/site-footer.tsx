import Link from "next/link";
import { HeartIcon } from "lucide-react";

import { footerLinks, socialLinks } from "@/data/landing";

import { VaultLogo } from "@/components/landing/brand-icons";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <VaultLogo />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-primary"
              >
                <social.icon />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-6 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2026 Vaultly. Open source. Built with
            <HeartIcon
              className="fill-red-500 stroke-red-500"
              aria-label="love"
            />
            for a safer internet.
          </p>
          <p className="ml-auto flex items-center gap-1">
            Made with
            <HeartIcon
              className="fill-red-500 stroke-red-500"
              aria-label="love"
            />
            by the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
