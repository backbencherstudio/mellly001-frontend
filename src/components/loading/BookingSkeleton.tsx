import { Skeleton } from "@/components/ui/skeleton";

export default function BookingSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading bookings" aria-busy="true">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-40 shrink-0 rounded-lg" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="rounded-2xl border bg-white p-5">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:gap-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-56 max-w-full" />
                <Skeleton className="h-3 w-24" />
              </div>

              <div className="flex flex-col justify-between gap-4 sm:items-end">
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="space-y-3 sm:text-right">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24 sm:ml-auto" />
                </div>
              </div>
            </div>

            <div className="my-4 border-t" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-40 max-w-[60%]" />
              <Skeleton className="h-5 w-20 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}