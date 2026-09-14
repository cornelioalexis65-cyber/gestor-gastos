import { useDashboard } from './hooks/useDashboard'
import { ErrorState } from '@/shared/components/ErrorState'
import { DashboardHeader } from './components/DashboardHeader'
import { SummaryCards } from './components/SummaryCards'
import { RecentMovements } from './components/RecentMovements'
import { MovementCharts } from './components/MovementCharts'
import { DashboardLoading } from './components/DashboardLoading'

export function Dashboard() {
  const { summary, stats, loading, error, refetch, setDateRange, dateRange } = useDashboard()

  if (loading) return <DashboardLoading />
  if (error) return <ErrorState error={error} onRetry={refetch} label="Error al cargar dashboard" />

  return (
    <div className="space-y-6">
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefetch={refetch}
      />
      <SummaryCards summary={summary} />
      <RecentMovements summary={summary} />
      {stats && <MovementCharts stats={stats} />}
    </div>
  )
}