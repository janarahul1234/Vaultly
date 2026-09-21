"use client";

import { useCallback, useState } from "react";
import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { DeleteItemDialogProps } from "@/types/dashboard";

/**
 * Destructive confirmation for removing a vault item. Centered AlertDialog
 * per the design: soft red trash badge, centered copy naming the item, and
 * equal-width Cancel / Delete actions. Reusable as a controlled or a
 * trigger-wrapped dialog so it works from the table menu and the edit sheet.
 */
export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  title = "Delete this item?",
  actionLabel = "Delete",
  trigger,
}: DeleteItemDialogProps) {
  // Uncontrolled fallback when no `open` prop is supplied (trigger mode).
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    },
    [onOpenChange],
  );

  const handleConfirm = useCallback(() => {
    if (item) onConfirm(item.id);
  }, [item, onConfirm]);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? <AlertDialogTrigger render={trigger} /> : null}
      <AlertDialogContent
        size="sm"
        className="max-w-[calc(100vw-2rem)] gap-0 rounded-2xl p-6 sm:max-w-md"
      >
        {/* size="sm" keeps the base header as a centered single-column stack
            (the two-column media layout is gated on size="default"). */}
        <AlertDialogHeader className="gap-0">
          <AlertDialogMedia className="mx-auto mb-5 size-14 rounded-full bg-destructive/10 text-destructive [&_svg]:size-7">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2">
            {item ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{item.name}&rdquo;
                </span>
                ? This action cannot be undone.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mx-0 mb-0 mt-2 grid grid-cols-2 border-0 bg-transparent px-0 pb-0">
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          {/* Solid red per the design — overrides the tinted destructive variant. */}
          <AlertDialogAction
            variant="destructive"
            className="w-full bg-destructive text-white hover:bg-destructive/90 hover:text-white"
            onClick={handleConfirm}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
