import { PageHeader } from '@/shared/components/PageHeader'
import { DateRangePicker, type DateRange } from './DateRangePicker'

interface DashboardHeaderProps {
  dateRange: DateRange
  onDateRangeChange: (inicio: string, fin: string) => void
  onRefetch: () => void
}

export function DashboardHeader({ dateRange, onDateRangeChange, onRefetch }: DashboardHeaderProps) {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="Resumen de tus finanzas"
      actions={
        <>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
          <button className="btn btn-ghost btn-sm" onClick={onRefetch} title="Actualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </>
      }
    />
  )
}