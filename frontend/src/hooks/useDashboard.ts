import { useState, useEffect, useCallback } from 'react'
import { dashboardService, ApiError } from '@/services/dashboard'
import type { DashboardSummary, DashboardStats } from '@/types'

interface UseDashboardResult {
  summary: DashboardSummary | null
  stats: DashboardStats | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  setDateRange: (fecha_inicio?: string, fecha_fin?: string) => void
  dateRange: { fecha_inicio: string; fecha_fin: string }
}

export function useDashboard(): UseDashboardResult {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [dateRange, setDateRangeState] = useState({ fecha_inicio: '', fecha_fin: '' })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [summaryData, statsData] = await Promise.all([
        dashboardService.getSummary(dateRange.fecha_inicio || undefined, dateRange.fecha_fin || undefined),
        dashboardService.getStats(dateRange.fecha_inicio || undefined, dateRange.fecha_fin || undefined),
      ])
      setSummary(summaryData)
      setStats(statsData)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [dateRange.fecha_inicio, dateRange.fecha_fin])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const setDateRange = (fecha_inicio?: string, fecha_fin?: string) => {
    setDateRangeState({ fecha_inicio: fecha_inicio || '', fecha_fin: fecha_fin || '' })
  }

  return {
    summary,
    stats,
    loading,
    error,
    refetch: fetchData,
    setDateRange,
    dateRange,
  }
}