"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  FolderIcon,
  KeyRound,
  KeyRoundIcon,
  LayoutGridIcon,
  PlusIcon,
  RotateCcwIcon,
  StarIcon,
  StickyNote,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ItemActionsDropdown } from "@/components/dashboard/item-actions-dropdown";
import { ItemIcon } from "@/components/dashboard/item-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { categoryStyles, navHeadings } from "@/components/dashboard/data";
import type {
  FilterSelectProps,
  PasswordsPanelProps,
} from "@/types/dashboard";
import type {
  VaultCategory,
  VaultItem,
  VaultTypeFilter,
} from "@/types/password";

const typeOptions = ["All types", "Login", "Note", "Card"] as const;
const sortOptions = ["Name", "Recently Updated"] as const;
const typeFilterMap: Record<(typeof typeOptions)[number], VaultTypeFilter> = {
  "All types": "all",
  Login: "login",
  Note: "note",
  Card: "card",
};

function FilterSelect({
  label,
  icon: Icon,
  options,
  value,
  onValueChange,
}: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next ?? value)}
    >
      <SelectTrigger
        aria-label={label}
        className="gap-2 border-border bg-background font-sans"
      >
        <Icon className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function PasswordsPanel({
  items,
  trash,
  activeNav,
  onToggleFavorite,
  onTrash,
  onRestore,
  onDeleteForever,
  onAddItem,
  onView,
  onEdit,
}: PasswordsPanelProps) {
  const [typeFilter, setTypeFilter] = useState<string>(typeOptions[0]);
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [tagFilter, setTagFilter] = useState("All tags");
  const [sortValue, setSortValue] = useState<string>(sortOptions[0]);

  const categoryOptions = useMemo(
    () => [
      "All categories",
      ...Array.from(new Set(items.map((item) => item.category))),
    ],
    [items],
  );

  const tagOptions = useMemo(
    () => [
      "All tags",
      ...Array.from(new Set(items.flatMap((item) => item.tags))),
    ],
    [items],
  );

  const visibleItems = useMemo(() => {
    if (activeNav === "trash") return [];
    let list = items;
    if (activeNav === "favorites") {
      list = list.filter((item) => item.favorite);
    }
    const type = typeFilterMap[typeFilter as keyof typeof typeFilterMap];
    if (type !== "all") {
      list = list.filter((item) => item.type === type);
    }
    if (categoryFilter !== "All categories") {
      list = list.filter(
        (item) => item.category === (categoryFilter as VaultCategory),
      );
    }
    if (tagFilter !== "All tags") {
      list = list.filter((item) => item.tags.includes(tagFilter));
    }
    return [...list].sort((a, b) =>
      sortValue === "Recently Updated"
        ? a.updatedAt - b.updatedAt
        : a.name.localeCompare(b.name),
    );
  }, [items, activeNav, typeFilter, categoryFilter, tagFilter, sortValue]);

  // Categories / Tags nav renders true grouped sections, matching the
  // "grouped by…" subtitle — derived during render, not state.
  const groupedItems = useMemo(() => {
    if (activeNav !== "categories" && activeNav !== "tags") return null;
    const groups = new Map<string, VaultItem[]>();
    for (const item of visibleItems) {
      const keys = activeNav === "categories" ? [item.category] : item.tags;
      for (const key of keys) {
        const group = groups.get(key);
        if (group) group.push(item);
        else groups.set(key, [item]);
      }
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [activeNav, visibleItems]);

  const heading = navHeadings[activeNav];
  const isTrash = activeNav === "trash";
  const rowCount = isTrash ? trash.length : visibleItems.length;

  const dataCells = (item: VaultItem) => (
    <>
      <TableCell className="pl-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            item.favorite ? `Unfavorite ${item.name}` : `Favorite ${item.name}`
          }
          aria-pressed={item.favorite}
          onClick={() => onToggleFavorite(item.id)}
        >
          <StarIcon
            className={cn(
              "text-muted-foreground size-4.5",
              item.favorite && "fill-amber-400 text-amber-400",
            )}
          />
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <ItemIcon iconKey={item.iconKey} website={item.website} />
          <span className="font-medium">{item.name}</span>
        </div>
      </TableCell>
      <TableCell>
        {item.website ? (
          <Link
            href={item.website}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {item.website}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <Badge className={categoryStyles[item.category]}>{item.category}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {item.updatedLabel}
      </TableCell>
      <TableCell>
        <ItemActionsDropdown
          item={item}
          onView={onView}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
          onTrash={onTrash}
        />
      </TableCell>
    </>
  );

  return (
    <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">{heading.title}</h1>
          <p className="text-muted-foreground text-sm">{heading.subtitle}</p>
        </div>

        <ButtonGroup>
          <Button size="lg" onClick={() => onAddItem("login")}>
            <PlusIcon data-icon="inline-start" />
            Add Item
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="lg"
                  className="px-2"
                  aria-label="More item options"
                >
                  <ChevronDownIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-auto min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="px-3 py-2 gap-3 font-sans font-medium"
                  onClick={() => onAddItem("login")}
                >
                  <KeyRound /> New Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-3 py-2 gap-3 font-sans font-medium"
                  onClick={() => onAddItem("note")}
                >
                  <StickyNote /> New Note
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      {!isTrash && (
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterSelect
            label="Filter by type"
            icon={LayoutGridIcon}
            options={typeOptions}
            value={typeFilter}
            onValueChange={setTypeFilter}
          />
          <FilterSelect
            label="Filter by category"
            icon={FolderIcon}
            options={categoryOptions}
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          />
          <FilterSelect
            label="Filter by tag"
            icon={TagIcon}
            options={tagOptions}
            value={tagFilter}
            onValueChange={setTagFilter}
          />
          <FilterSelect
            label="Sort items"
            icon={ArrowUpDownIcon}
            options={sortOptions}
            value={sortValue}
            onValueChange={setSortValue}
          />
        </div>
      )}

      <div className="mt-4 rounded-xl border bg-card">
        {rowCount === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isTrash ? <Trash2Icon /> : <KeyRoundIcon />}
              </EmptyMedia>
              <EmptyTitle>
                {isTrash ? "Trash is empty" : "No items match your filters"}
              </EmptyTitle>
              <EmptyDescription>
                {isTrash
                  ? "Deleted items will appear here before they are gone forever."
                  : "Try adjusting the type, category, or tag filters."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : groupedItems ? (
          <div className="flex flex-col">
            {groupedItems.map(([groupName, groupItems], index) => (
              <section key={groupName} aria-label={groupName}>
                <div
                  className={cn(
                    "flex items-center gap-2 bg-muted/40 px-4 py-2",
                    index > 0 && "border-t",
                  )}
                >
                  {activeNav === "categories" ? (
                    <FolderIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <TagIcon className="size-4 text-muted-foreground" />
                  )}
                  <h2 className="text-sm font-medium">{groupName}</h2>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {groupItems.length}
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    {/* Hidden but measured by the table layout, keeping column
                        widths consistent across groups. */}
                    <TableRow className="hidden">
                      <TableHead className="w-10 pl-4" />
                      <TableHead>Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-0" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupItems.map((item) => (
                      <TableRow key={`${groupName}-${item.id}`}>
                        {dataCells(item)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            ))}
          </div>
        ) : isTrash ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {trash.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <ItemIcon iconKey={item.iconKey} website={item.website} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.website}
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryStyles[item.category]}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.updatedLabel}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRestore(item.id)}
                      >
                        <RotateCcwIcon data-icon="inline-start" />
                        Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteForever(item.id)}
                      >
                        <Trash2Icon data-icon="inline-start" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 pl-4" />
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleItems.map((item) => (
                <TableRow key={item.id}>{dataCells(item)}</TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="border-t px-4 py-3 text-sm text-center text-muted-foreground">
          Showing {rowCount} {rowCount === 1 ? "item" : "items"}
        </div>
      </div>
    </main>
  );
}
