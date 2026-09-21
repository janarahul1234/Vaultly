"use client";

import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FolderIcon,
  KeyRoundIcon,
  PlusIcon,
  StickyNoteIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { categoryOptions, strengthMeta } from "@/data/password";
import { noteFormCopy } from "@/data/note";
import { copyToClipboard, scorePassword } from "@/lib/vault-helpers";
import {
  VaultItemSchema,
  type VaultItemFormOutput,
  type VaultItemFormValues,
} from "@/lib/schemas/vault-item";

import { ItemIcon } from "@/components/dashboard/item-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";

import type {
  EditItemDetailProps,
  EditItemSheetProps,
} from "@/types/dashboard";
import {
  type CategoryFieldProps,
  type ItemEditDraft,
  type TagsFieldProps,
  type VaultFormType,
} from "@/types/password";

function CategoryField({ value, onValueChange }: CategoryFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="edit-category">
        Category <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <Select
        value={value || null}
        onValueChange={(next) => onValueChange((next as string) ?? "")}
      >
        <SelectTrigger id="edit-category" className="w-full font-sans">
          <FolderIcon className="text-muted-foreground" />
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categoryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function TagsField({ tags, onAddTag, onRemoveTag }: TagsFieldProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = useCallback(() => {
    const tag = draft.trim().toLowerCase();
    if (tag) onAddTag(tag);
    setDraft("");
    setAdding(false);
  }, [draft, onAddTag]);

  return (
    <Field>
      <FieldLabel htmlFor="edit-tag">
        Tags <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Remove ${tag} tag`}
              onClick={() => onRemoveTag(tag)}
            >
              <XIcon />
            </Button>
          </Badge>
        ))}

        {adding ? (
          <InputGroup className="w-40">
            <InputGroupInput
              id="edit-tag"
              autoFocus
              placeholder="Tag name"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commit();
                }
                if (event.key === "Escape") {
                  setDraft("");
                  setAdding(false);
                }
              }}
              onBlur={commit}
            />
          </InputGroup>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setAdding(true)}
          >
            <PlusIcon data-icon="inline-start" />
            Add tag
          </Button>
        )}
      </div>
    </Field>
  );
}

// Keyed per item by the parent — the useForm defaults below therefore
// re-seed whenever a different item is opened for editing.
function EditItemDetail({ item, onSave, onDelete }: EditItemDetailProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<VaultItemFormValues, unknown, VaultItemFormOutput>({
    resolver: zodResolver(VaultItemSchema),
    defaultValues: {
      type: item.type === "note" ? "note" : "login",
      name: item.name,
      website: item.website,
      username: item.username,
      password: item.password ?? "",
      category: item.category,
      tags: item.tags,
      notes: item.notes ?? "",
    },
  });

  // The active tab IS the in-form type discriminator — the schema's
  // conditional rules (login/password, note/content) key off it.
  const tab = useWatch({ control, name: "type" });
  const password = useWatch({ control, name: "password" });
  const category = useWatch({ control, name: "category" });
  const tags = useWatch({ control, name: "tags" });
  const strength = useMemo(() => scorePassword(password), [password]);

  const addTag = useCallback(
    (tag: string) => {
      const current = getValues("tags");
      if (!current.includes(tag)) setValue("tags", [...current, tag]);
    },
    [getValues, setValue],
  );

  const removeTag = useCallback(
    (tag: string) => {
      setValue("tags", getValues("tags").filter((x) => x !== tag));
    },
    [getValues, setValue],
  );

  const openWebsite = useCallback(() => {
    const url = getValues("website").trim();
    if (!url) return;
    window.open(/^https?:\/\//.test(url) ? url : `https://${url}`, "_blank");
  }, [getValues]);

  const onSubmit = useCallback(
    (data: VaultItemFormOutput) => {
      // Trim transforms already ran through the zod resolver; a cleared
      // category falls back to the stored one (ItemEditDraft is non-null).
      onSave({
        type: data.type,
        name: data.name,
        website: data.website,
        username: data.username,
        password: data.password,
        category: data.category ?? item.category,
        tags: data.tags,
        notes: data.notes,
      });
    },
    [onSave, item.category],
  );

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setValue("type", value as VaultFormType, { shouldValidate: true })
        }
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
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-name">
                Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="edit-name"
                placeholder="e.g., GitHub, Gmail, Netflix"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-website">
                Website{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit-website"
                  type="url"
                  placeholder="https://example.com"
                  {...register("website")}
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
              <FieldLabel htmlFor="edit-username">
                Username / Email{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit-username"
                  placeholder="e.g., rahul@example.com"
                  {...register("username")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Copy username"
                    onClick={() =>
                      copyToClipboard("Username", getValues("username"))
                    }
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="edit-password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
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
                    onClick={() => copyToClipboard("Password", password)}
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password ? (
                <FieldError>{errors.password.message}</FieldError>
              ) : (
                strength && (
                  <div className="flex items-center gap-2">
                    <Progress
                      value={strengthMeta[strength].pct}
                      className={cn(
                        "flex-1 gap-0",
                        strengthMeta[strength].progress,
                      )}
                    />
                    <span className="text-sm">
                      {strengthMeta[strength].label}
                    </span>
                  </div>
                )
              )}
            </Field>

            <CategoryField
              value={category}
              onValueChange={(value) =>
                setValue(
                  "category",
                  value as VaultItemFormValues["category"],
                  { shouldValidate: true },
                )
              }
            />
            <TagsField tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />

            <Field>
              <FieldLabel htmlFor="edit-notes">
                Notes <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea
                id="edit-notes"
                placeholder={noteFormCopy.notesPlaceholder}
                {...register("notes")}
              />
            </Field>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="note" className="flex-1 overflow-y-auto p-6">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-note-title">
                Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="edit-note-title"
                placeholder={noteFormCopy.titlePlaceholder}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <CategoryField
              value={category}
              onValueChange={(value) =>
                setValue(
                  "category",
                  value as VaultItemFormValues["category"],
                  { shouldValidate: true },
                )
              }
            />
            <TagsField tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />

            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="edit-note-body">
                Note <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="edit-note-body"
                placeholder={noteFormCopy.notePlaceholder}
                aria-invalid={!!errors.notes}
                className="min-h-40"
                {...register("notes")}
              />
              <FieldError errors={[errors.notes]} />
            </Field>
          </FieldGroup>
        </TabsContent>
      </Tabs>

      <SheetFooter className="shrink-0 flex-row items-center gap-2 border-t">
        <Button
          type="button"
          variant="destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </Button>
        <SheetClose
          render={<Button type="button" variant="ghost" className="ml-auto" />}
        >
          Cancel
        </SheetClose>
        <Button type="submit">Save Changes</Button>
      </SheetFooter>
    </form>
  );
}

export function EditItemSheet({
  open,
  onOpenChange,
  item,
  onSave,
  onDelete,
}: EditItemSheetProps) {
  const handleSave = useCallback(
    (draft: ItemEditDraft) => {
      if (item) onSave(item.id, draft);
    },
    [item, onSave],
  );

  // No local close here — the parent shows a confirmation dialog on top of
  // the open sheet, and the sheet unmounts once the confirmed item leaves
  // the vault (editItem becomes null).

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
              <div className="flex flex-col gap-0.5">
                <SheetTitle className="text-lg font-semibold">
                  Edit Item
                </SheetTitle>
                <SheetDescription className="font-mono">
                  Update your password or details.
                </SheetDescription>
              </div>
            </SheetHeader>
            {/* Remounts per item so the form re-seeds from the newly edited record. */}
            <EditItemDetail
              key={item.id}
              item={item}
              onSave={handleSave}
              onDelete={onDelete}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
