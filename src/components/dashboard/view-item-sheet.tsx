"use client";

import { useCallback, useState } from "react";
import {
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FolderIcon,
  KeyRoundIcon,
  PencilIcon,
  StickyNoteIcon,
  XIcon,
} from "lucide-react";

import { ItemIcon } from "@/components/dashboard/item-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  ReadOnlyTextFieldProps,
  ViewCategoryFieldProps,
  ViewItemDetailProps,
  ViewItemSheetProps,
  ViewItemTagsFieldProps,
} from "@/types/dashboard";
import type { NoteFieldProps } from "@/types/note";

import { fallbackPassword } from "@/data/password";
import { copyToClipboard } from "@/lib/vault-helpers";

function ReadOnlyTitleField({ id, label, value }: ReadOnlyTextFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput id={id} readOnly tabIndex={-1} value={value} />
      </InputGroup>
    </Field>
  );
}

function CategoryField({ value }: ViewCategoryFieldProps) {
  return (
    <Field>
      <FieldLabel>Category</FieldLabel>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <FolderIcon />
        </InputGroupAddon>
        <InputGroupInput readOnly tabIndex={-1} value={value} />
      </InputGroup>
    </Field>
  );
}

function TagsField({ item, onRemoveTag }: ViewItemTagsFieldProps) {
  return (
    <Field>
      <FieldLabel>Tags</FieldLabel>
      {item.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${tag} tag`}
                onClick={() => onRemoveTag(item.id, tag)}
              >
                <XIcon />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags.</p>
      )}
    </Field>
  );
}

function NotesField({ id, value }: NoteFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>Notes</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id={id}
          readOnly
          tabIndex={-1}
          placeholder="No notes yet."
          value={value}
        />
      </InputGroup>
    </Field>
  );
}

// Keyed per item by the parent — useState below is therefore correct lazy
// init: tab and password visibility reset whenever a new item is viewed.
function ViewItemDetail({ item, onRemoveTag, onEdit }: ViewItemDetailProps) {
  const [tab, setTab] = useState(item.type === "note" ? "note" : "login");
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = item.password ?? fallbackPassword;

  const openWebsite = useCallback(() => {
    if (!item.website) return;
    window.open(
      /^https?:\/\//.test(item.website)
        ? item.website
        : `https://${item.website}`,
      "_blank",
    );
  }, [item.website]);

  const handleEdit = useCallback(() => onEdit(item.id), [item.id, onEdit]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "login" | "note")}
        className="min-h-0 flex-1 gap-0"
      >
        <TabsList
          variant="line"
          className="w-full shrink-0 rounded-none border-b px-6"
        >
          <TabsTrigger
            value="login"
            className="gap-2 text-sm data-active:text-primary data-active:after:bg-primary hover:text-primary"
          >
            <KeyRoundIcon />
            Login / Password
          </TabsTrigger>
          <TabsTrigger
            value="note"
            className="gap-2 text-sm data-active:text-primary data-active:after:bg-primary hover:text-primary"
          >
            <StickyNoteIcon />
            Secure Note
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="flex-1 overflow-y-auto p-6">
          <FieldGroup>
            <ReadOnlyTitleField
              id="view-title"
              label="Title"
              value={item.name}
            />

            <Field>
              <FieldLabel htmlFor="view-website">Website</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="view-website"
                  tabIndex={-1}
                  value={item.website}
                  placeholder="No website"
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Open website"
                    onClick={openWebsite}
                  >
                    <ExternalLinkIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="view-username">Username / Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="view-username"
                  tabIndex={-1}
                  value={item.username}
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Copy username"
                    onClick={() => copyToClipboard("Username", item.username)}
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="view-password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="view-password"
                  type={showPassword ? "text" : "password"}
                  readOnly
                  tabIndex={-1}
                  value={passwordValue}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Copy password"
                    onClick={() => copyToClipboard("Password", passwordValue)}
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <CategoryField value={item.category} />
            <TagsField item={item} onRemoveTag={onRemoveTag} />
            <NotesField id="view-notes" value={item.notes ?? ""} />
          </FieldGroup>
        </TabsContent>

        <TabsContent value="note" className="flex-1 overflow-y-auto p-6">
          <FieldGroup>
            <ReadOnlyTitleField
              id="view-note-title"
              label="Title"
              value={item.name}
            />
            <CategoryField value={item.category} />
            <TagsField item={item} onRemoveTag={onRemoveTag} />
            <NotesField id="view-note-body" value={item.notes ?? ""} />
          </FieldGroup>
        </TabsContent>
      </Tabs>

      <SheetFooter className="shrink-0 gap-3 border-t">
        <div className="flex w-full justify-end gap-2">
          <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          <Button onClick={handleEdit}>
            <PencilIcon data-icon="inline-start" />
            Edit Item
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
}

export function ViewItemSheet({
  open,
  onOpenChange,
  item,
  onRemoveTag,
  onEdit,
}: ViewItemSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md gap-0 p-0 font-sans sm:max-w-md"
      >
        {item && (
          <>
            <SheetHeader className="flex-row items-center gap-3 px-6 pt-6 pb-3 text-left">
              <ItemIcon
                iconKey={item.iconKey}
                website={item.website}
                className="size-12 rounded-xl"
              />
              <div className="flex flex-col">
                <SheetTitle className="text-lg font-semibold">
                  View Details
                </SheetTitle>
                <SheetDescription className="font-mono">
                  View your saved information.
                </SheetDescription>
              </div>
            </SheetHeader>
            {/* Remounts per item so tab/visibility state resets (lazy init). */}
            <ViewItemDetail
              key={item.id}
              item={item}
              onRemoveTag={onRemoveTag}
              onEdit={onEdit}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
