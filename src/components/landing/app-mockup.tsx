import {
  FolderIcon,
  FolderPlusIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  NotebookPenIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "All items", icon: FolderIcon, active: true, count: 5 },
  { label: "Favorites", icon: StarIcon },
  { label: "Categories", icon: TagIcon },
  { label: "Tags", icon: TagIcon },
  { label: "Trash", icon: Trash2Icon },
];

const quickActions = [
  {
    label: "Add Password",
    icon: KeyRoundIcon,
    tint: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Add Note",
    icon: NotebookPenIcon,
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Upload File",
    icon: UploadIcon,
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    label: "Create Category",
    icon: FolderPlusIcon,
    tint: "bg-violet-500/10 text-violet-600",
  },
];

const recentItems = [
  {
    name: "Gmail",
    detail: "rahul@mail.com",
    icon: LockKeyholeIcon,
    tint: "bg-red-500/10 text-red-500",
    badge: "Password",
    badgeTint: "bg-emerald-500/10 text-emerald-600",
    time: "2h ago",
  },
  {
    name: "Project Notes",
    detail: "ideas and planning",
    icon: NotebookPenIcon,
    tint: "bg-amber-500/10 text-amber-600",
    badge: "Note",
    badgeTint: "bg-amber-500/10 text-amber-600",
    time: "5h ago",
  },
  {
    name: "Design Files",
    detail: "3 items",
    icon: FolderIcon,
    tint: "bg-violet-500/10 text-violet-600",
    badge: "File",
    badgeTint: "bg-sky-500/10 text-sky-600",
    time: "1d ago",
  },
  {
    name: "Bank Account",
    detail: "****1234",
    icon: LockKeyholeIcon,
    tint: "bg-emerald-500/10 text-emerald-600",
    badge: "Password",
    badgeTint: "bg-emerald-500/10 text-emerald-600",
    time: "2d ago",
  },
];

export function AppMockup() {
  return (
    <Card className="w-full gap-0 p-0 shadow-xl shadow-primary/5">
      <CardContent className="grid grid-cols-1 gap-0 p-0 sm:grid-cols-[minmax(0,11rem)_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-e bg-muted/40 p-3 sm:flex">
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LockKeyholeIcon className="size-3.5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold">Vaultly</span>
              <span className="text-[0.6rem] text-muted-foreground">
                Your digital vault
              </span>
            </div>
          </div>
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                item.active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
              {item.count ? (
                <span className="ml-auto text-[0.65rem] text-muted-foreground">
                  {item.count}
                </span>
              ) : null}
            </div>
          ))}
          <div className="my-1 border-t" />
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground">
            <SettingsIcon className="size-3.5" />
            Settings
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Good morning, Rahul 👋</p>
              <p className="text-xs text-muted-foreground">
                Your digital vault is ready.
              </p>
            </div>
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                R
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
            <SearchIcon className="size-3.5" />
            Search your vault...
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold">Quick Actions</p>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center"
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md",
                      action.tint,
                    )}
                  >
                    <action.icon className="size-3.5" />
                  </span>
                  <span className="text-[0.6rem] leading-tight text-muted-foreground">
                    {action.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold">Recent Items</p>
            {recentItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2.5 rounded-lg border p-2"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    item.tint,
                  )}
                >
                  <item.icon className="size-3.5" />
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-xs font-medium">
                    {item.name}
                  </span>
                  <span className="truncate text-[0.65rem] text-muted-foreground">
                    {item.detail}
                  </span>
                </div>
                <Badge
                  className={cn("ml-auto border-transparent", item.badgeTint)}
                >
                  {item.badge}
                </Badge>
                <span className="w-10 shrink-0 text-right text-[0.6rem] text-muted-foreground">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
