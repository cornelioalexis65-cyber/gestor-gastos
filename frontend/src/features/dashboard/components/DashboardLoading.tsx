import { PageHeader } from '@/shared/components/PageHeader'

export function DashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Resumen de tus finanzas" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-6" />
              <div className="h-8 bg-[var(--color-border)] rounded w-1/2 mb-2" />
              <div className="h-3 bg-[var(--color-border)] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="h-64 bg-[var(--color-border)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}