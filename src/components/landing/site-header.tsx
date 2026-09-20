import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VaultLogo } from "@/components/landing/brand-icons";
import { ModeToggle } from "@/components/landing/mode-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#get-started" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 md:px-6">
        <a href="#" aria-label="Vaultly home" className="flex items-center">
          <VaultLogo />
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#" />}
            className="hidden sm:inline-flex font-sans"
          >
            Sign in
          </Button>
          <Button
            nativeButton={false}
            render={<a href="#get-started" />}
            className="font-sans"
          >
            Get started
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
              className="md:hidden"
            >
              <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                {navLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.label}
                    render={<a href={link.href} />}
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<a href="#" />}>
                Sign in
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
