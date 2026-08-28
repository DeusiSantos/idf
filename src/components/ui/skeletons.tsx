import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ── KPI Card Skeleton ──
export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// ── Table Skeleton ──
export function TableSkeleton({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border', className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-border bg-muted/30 p-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={`r-${row}`} className="flex items-center gap-4 border-b border-border last:border-0 p-4">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton
              key={`c-${row}-${col}`}
              className={cn('h-4 flex-1', col === 0 && 'max-w-[180px]')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Dashboard Skeleton (KPI row + chart area) ──
export function DashboardSkeleton({ kpiCount = 4, className }: { kpiCount?: number; className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: kpiCount }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
      {/* Chart area */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Card List Skeleton ──
export function CardListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page Skeleton (full page loading) ──
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <DashboardSkeleton />
    </div>
  );
}
