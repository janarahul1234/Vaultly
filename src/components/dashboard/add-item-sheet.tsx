"use client";

import { useCallback, useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";

import { categoryOptions, strengthMeta } from "@/data/password";
import { noteFormCopy } from "@/data/note";
import { generatePassword, scorePassword } from "@/lib/vault-helpers";

import type { AddItemSheetProps } from "@/types/dashboard";
import {
  type CategoryFieldProps,
  type ItemFormErrors,
  type TagsFieldProps,
  type VaultCategory,
  type VaultFormType,
} from "@/types/password";
import {
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FolderIcon,
  KeyRoundIcon,
  LockIcon,
  PlusIcon,
  RefreshCwIcon,
  StickyNoteIcon,
  XIcon,
} from "lucide-react";

function CategoryField({ value, onValueChange }: CategoryFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="item-category">
        Category <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <Select
        value={value || null}
        onValueChange={(next) => onValueChange((next as string) ?? "")}
      >
        <SelectTrigger id="item-category" className="w-full font-sans">
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
  const [draft, setDraft] = useState("");

  const commit = useCallback(() => {
    const tag = draft.trim().toLowerCase();
    if (!tag) return;
    onAddTag(tag);
    setDraft("");
  }, [draft, onAddTag]);

  return (
    <Field>
      <FieldLabel htmlFor="item-tag">
        Tags <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
        </div>
      )}
      <InputGroup
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
      >
        <InputGroupInput
          id="item-tag"
          placeholder="Add tag"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Add tag"
            onClick={commit}
          >
            <PlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function AddItemSheet({
  open,
  onOpenChange,
  itemType,
  onItemTypeChange,
  onSave,
}: AddItemSheetProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<ItemFormErrors>({});

  const strength = useMemo(() => scorePassword(password), [password]);

  // Errors are cleared as the user types so stale messages never shadow
  // the strength bar or filled fields after a failed submit.
  const clearError = useCallback((key: keyof typeof errors) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setWebsite("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setCategory("");
    setTags([]);
    setNotes("");
    setErrors({});
  }, []);

  const addTag = useCallback((tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((x) => x !== tag));
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) resetForm();
      onOpenChange(next);
    },
    [onOpenChange, resetForm],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Title is required.";
    if (itemType === "login" && !password) {
      nextErrors.password = "Password is required.";
    }
    if (itemType === "note" && !notes.trim()) {
      nextErrors.notes = "Note content is required.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSave({
      type: itemType,
      name: name.trim(),
      website: website.trim(),
      username: username.trim(),
      password,
      category: (category || null) as VaultCategory | null,
      tags,
      notes: notes.trim(),
    });
    resetForm();
  };

  const openWebsite = () => {
    const url = website.trim();
    if (!url) return;
    window.open(/^https?:\/\//.test(url) ? url : `https://${url}`, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md gap-0 p-0 font-sans sm:max-w-md"
      >
        <SheetHeader className="flex-row items-center gap-3 px-6 pt-6 pb-3 text-left">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LockIcon />
          </span>
          <div className="flex flex-col">
            <SheetTitle className="text-lg font-semibold">
              Add New Item
            </SheetTitle>
            <SheetDescription className="font-mono">
              Save a new secure item.
            </SheetDescription>
          </div>
        </SheetHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={handleSubmit}
        >
          <Tabs
            value={itemType}
            onValueChange={(value) =>
              onItemTypeChange(value as VaultFormType)
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
                  <FieldLabel htmlFor="item-name">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="item-name"
                    placeholder="e.g., GitHub, Gmail, Netflix"
                    aria-invalid={!!errors.name}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      clearError("name");
                    }}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="item-website">
                    Website{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="item-website"
                      type="url"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
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
                  <FieldLabel htmlFor="item-username">
                    Username / Email{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="item-username"
                    placeholder="e.g., rahul@example.com"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="item-password">
                    Password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="item-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter or generate a password"
                      aria-invalid={!!errors.password}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearError("password");
                      }}
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
                        aria-label="Generate password"
                        onClick={() => {
                          setPassword(generatePassword());
                          setShowPassword(false);
                          clearError("password");
                        }}
                      >
                        <RefreshCwIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.password ? (
                    <FieldError>{errors.password}</FieldError>
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
                        <span className="text-sm font-medium">
                          {strengthMeta[strength].label}
                        </span>
                      </div>
                    )
                  )}
                </Field>

                <CategoryField value={category} onValueChange={setCategory} />
                <TagsField
                  tags={tags}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />

                <Field>
                  <FieldLabel htmlFor="item-notes">
                    Notes{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea
                    id="item-notes"
                    placeholder={noteFormCopy.notesPlaceholder}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="note" className="flex-1 overflow-y-auto p-6">
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="item-note-title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="item-note-title"
                    placeholder={noteFormCopy.titlePlaceholder}
                    aria-invalid={!!errors.name}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      clearError("name");
                    }}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <CategoryField value={category} onValueChange={setCategory} />
                <TagsField
                  tags={tags}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />

                <Field data-invalid={!!errors.notes}>
                  <FieldLabel htmlFor="item-note-body">
                    Note <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="item-note-body"
                    placeholder={noteFormCopy.notePlaceholder}
                    aria-invalid={!!errors.notes}
                    className="min-h-40"
                    value={notes}
                    onChange={(event) => {
                      setNotes(event.target.value);
                      clearError("notes");
                    }}
                  />
                  {errors.notes && <FieldError>{errors.notes}</FieldError>}
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>

          <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t">
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <Button type="submit">Save Item</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
