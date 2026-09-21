import { Skeleton } from "@/components/ui/skeleton";

// Streamed while the dashboard Server Component awaits the vault read, so the
// shell paints instantly instead of blanking (async-server + Suspense).
export default function DashboardLoading() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden w-64 shrink-0 flex-col gap-3 border-r p-4 md:flex">
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="size-9 shrink-0 rounded-full" />
        </div>
        <div className="flex-1 space-y-4 p-6 md:p-8">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-32" />
            ))}
          </div>
          <div className="space-y-2 rounded-xl border p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
