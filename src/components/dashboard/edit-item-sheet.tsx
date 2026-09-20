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
import { toast } from "@/components/ui/toast";
import { ItemIcon } from "@/components/dashboard/item-icon";
import {
  type VaultCategory,
  type VaultItem,
  type VaultItemType,
} from "@/components/dashboard/data";
import { cn } from "@/lib/utils";
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

// Editable subset of a VaultItem — the Dashboard merges this back into the
// stored record and owns timestamps/id, mirroring the ItemDraft contract.
export type ItemEditDraft = {
  type: Exclude<VaultItemType, "card">;
  name: string;
  website: string;
  username: string;
  password: string;
  category: VaultCategory;
  tags: string[];
  notes: string;
};

const categoryOptions: VaultCategory[] = [
  "Work",
  "Personal",
  "Entertainment",
  "Shopping",
  "Social",
];

// Data-driven strength colors — same map shape as the add sheet, hoisted so
// it is never re-created per render.
const strengthMeta = {
  weak: {
    label: "Weak",
    pct: 33,
    progress:
      "text-destructive [&_[data-slot=progress-indicator]]:bg-destructive",
  },
  fair: {
    label: "Fair",
    pct: 66,
    progress:
      "text-amber-600 dark:text-amber-400 [&_[data-slot=progress-indicator]]:bg-amber-500",
  },
  strong: { label: "Strong", pct: 100, progress: "text-primary" },
} as const;

type StrengthKey = keyof typeof strengthMeta;

function scorePassword(password: string): StrengthKey | null {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  return "strong";
}

async function copyToClipboard(label: string, value: string) {
  if (!value) {
    toast.add({
      title: "Nothing to copy",
      description: `This ${label.toLowerCase()} is empty.`,
      type: "error",
    });
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    toast.add({ title: `${label} copied`, type: "success" });
  } catch {
    toast.add({
      title: "Copy failed",
      description: "Clipboard is not available.",
      type: "error",
    });
  }
}

function CategoryField({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="edit-category">
        Category <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <Select value={value || null} onValueChange={(next) => onValueChange((next as string) ?? "")}>
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

function TagsField({
  tags,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
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
            size="sm"
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

// Keyed per item by the parent — the useState lazy inits below therefore
// reset whenever a different item is opened for editing.
function EditItemDetail({
  item,
  onSave,
  onDelete,
}: {
  item: VaultItem;
  onSave: (draft: ItemEditDraft) => void;
  onDelete: (id: string) => void;
}) {
  const initialType: Exclude<VaultItemType, "card"> =
    item.type === "note" ? "note" : "login";

  const [tab, setTab] = useState<Exclude<VaultItemType, "card">>(initialType);
  const [name, setName] = useState(item.name);
  const [website, setWebsite] = useState(item.website);
  const [username, setUsername] = useState(item.username);
  const [password, setPassword] = useState(item.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState<string>(item.category);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [errors, setErrors] = useState<{
    name?: string;
    password?: string;
    notes?: string;
  }>({});

  const strength = useMemo(() => scorePassword(password), [password]);

  const clearError = useCallback((key: keyof typeof errors) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const addTag = useCallback((tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((x) => x !== tag));
  }, []);

  const openWebsite = useCallback(() => {
    const url = website.trim();
    if (!url) return;
    window.open(/^https?:\/\//.test(url) ? url : `https://${url}`, "_blank");
  }, [website]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Title is required.";
    if (tab === "login" && !password) {
      nextErrors.password = "Password is required.";
    }
    if (tab === "note" && !notes.trim()) {
      nextErrors.notes = "Note content is required.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      type: tab,
      name: name.trim(),
      website: website.trim(),
      username: username.trim(),
      password,
      category: (category || item.category) as VaultCategory,
      tags,
      notes: notes.trim(),
    });
  };

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      noValidate
      onSubmit={handleSubmit}
    >
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as Exclude<VaultItemType, "card">)}
        className="min-h-0 flex-1 gap-0"
      >
        <TabsList
          variant="line"
          className="w-full shrink-0 rounded-none border-b px-6"
        >
          <TabsTrigger
            value="login"
            className="gap-2 text-sm data-active:text-primary data-active:after:bg-primary"
          >
            <KeyRoundIcon />
            Login / Password
          </TabsTrigger>
          <TabsTrigger
            value="note"
            className="gap-2 text-sm data-active:text-primary data-active:after:bg-primary"
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
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-website">
                Website <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit-website"
                  type="url"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
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
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label="Copy username"
                    onClick={() => copyToClipboard("Username", username)}
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
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearError("password");
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                  <InputGroupButton
                    size="icon-sm"
                    aria-label="Copy password"
                    onClick={() => copyToClipboard("Password", password)}
                  >
                    <CopyIcon />
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
            <TagsField tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />

            <Field>
              <FieldLabel htmlFor="edit-notes">
                Notes <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea
                id="edit-notes"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
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
                placeholder="e.g., Wi-Fi keys, Recovery codes"
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
            <TagsField tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />

            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="edit-note-body">
                Note <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="edit-note-body"
                placeholder="Write your secure note..."
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

      <SheetFooter className="shrink-0 flex-row items-center gap-2 border-t">
        <Button
          type="button"
          variant="outline"
          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </Button>
        <SheetClose render={<Button type="button" variant="outline" className="ml-auto" />}>
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: VaultItem | null;
  onSave: (id: string, draft: ItemEditDraft) => void;
  onDelete: (id: string) => void;
}) {
  const handleSave = useCallback(
    (draft: ItemEditDraft) => {
      if (item) onSave(item.id, draft);
    },
    [item, onSave],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete(id);
      onOpenChange(false);
    },
    [onDelete, onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md gap-0 p-0 font-sans sm:max-w-md"
      >
        {item && (
          <>
            <SheetHeader className="flex-row items-center gap-3 px-6 pt-6 pb-3 text-left">
              <ItemIcon iconKey={item.iconKey} className="size-11 rounded-xl" />
              <div className="flex flex-col gap-0.5">
                <SheetTitle className="text-lg font-semibold">
                  Edit Item
                </SheetTitle>
                <SheetDescription>
                  Update your password or details.
                </SheetDescription>
              </div>
            </SheetHeader>
            {/* Remounts per item so form fields reset to the newly edited record. */}
            <EditItemDetail
              key={item.id}
              item={item}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
