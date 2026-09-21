"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { ItemIcon } from "@/components/dashboard/item-icon";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import type { DashboardSearchProps } from "@/types/dashboard";
import type { VaultItem } from "@/types/password";

export function DashboardSearch({
  items,
  shortcut = "⌘ K",
}: DashboardSearchProps) {
  const [open, setOpen] = useState(false);

  // Single global keydown listener for the whole app (client-event-listeners).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = useCallback((item: VaultItem) => {
    setOpen(false);
    toast.add({
      title: `Opening ${item.name}`,
      description: item.website,
      type: "info",
    });
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full min-w-0 justify-start gap-2 px-3 text-muted-foreground"
      >
        <SearchIcon data-icon="inline-start" />
        {/* Shorter placeholder on narrow viewports keeps the header from overflowing. */}
        <span className="hidden truncate sm:inline">
          Search passwords, websites, or notes...
        </span>
        <span className="truncate sm:hidden">Search...</span>
        <Kbd className="ml-auto hidden shrink-0 sm:inline-flex">
          {shortcut.split(" ").map((key) => (
            <span key={key}>{key}</span>
          ))}
        </Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search vault"
        description="Search your saved passwords, websites, and notes."
      >
        <Command>
          <CommandInput placeholder="Type to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Passwords">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.name} ${item.website} ${item.username}`}
                  onSelect={() => handleSelect(item)}
                >
                  <ItemIcon
                    iconKey={item.iconKey}
                    website={item.website}
                    className="size-6 rounded-md border-0"
                  />
                  <span className="truncate">{item.name}</span>
                  <CommandShortcut className="max-w-48 truncate">
                    {item.website}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
