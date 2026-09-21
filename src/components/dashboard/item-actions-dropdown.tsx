"use client";

import { memo } from "react";
import {
  ExternalLinkIcon,
  EyeIcon,
  KeyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import type { VaultItem } from "@/components/dashboard/data";

async function copyToClipboard(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.add({
      title: `${label} copied`,
      description: value,
      type: "success",
    });
  } catch {
    toast.add({
      title: "Copy failed",
      description: "Clipboard is not available.",
      type: "error",
    });
  }
}

function openWebsite(url: string) {
  if (!url) {
    toast.add({
      title: "No website",
      description: "This item does not have a website saved.",
      type: "error",
    });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

type ItemActionsDropdownProps = {
  item: VaultItem;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTrash: (id: string) => void;
};

/**
 * Row-level actions menu for the passwords table. Memoized so typing in the
 * search or favorite flips elsewhere do not re-render
 * every row's menu (rerender-memo).
 */
export const ItemActionsDropdown = memo(function ItemActionsDropdown({
  item,
  onView,
  onEdit,
  onToggleFavorite,
  onTrash,
}: ItemActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${item.name}`}
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => onView(item.id)}
          >
            <EyeIcon /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => onEdit(item.id)}
          >
            <PencilIcon /> Edit Item
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => copyToClipboard("Username", item.username)}
          >
            <UserIcon /> Copy Username
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => copyToClipboard("Password", item.password ?? "")}
          >
            <KeyIcon /> Copy Password
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => openWebsite(item.website)}
          >
            <ExternalLinkIcon /> Open Website
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            onClick={() => onToggleFavorite(item.id)}
          >
            <StarIcon
              className={cn(item.favorite && "fill-amber-400 text-amber-400")}
            />
            {item.favorite ? "Remove from Favorites" : "Add to Favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-3 py-2 gap-3 font-sans font-medium"
            variant="destructive"
            onClick={() => onTrash(item.id)}
          >
            <Trash2Icon /> Move to Trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
