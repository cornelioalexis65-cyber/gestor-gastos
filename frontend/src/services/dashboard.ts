import { api, ApiError } from './api'
import type { DashboardSummary } from '@/types'

interface DashboardStats {
  gastosPorCategoria: Array<{ nombre: string; color: string; icono: string; total: number }>
  ingresosPorCategoria: Array<{ nombre: string; color: string; icono: string; total: number }>
  balanceMensual: Array<{ mes: string; ingresos: number; gastos: number }>
}

export const dashboardService = {
  async getSummary(fecha_inicio?: string, fecha_fin?: string): Promise<DashboardSummary> {
    const params = new URLSearchParams()
    if (fecha_inicio) params.set('fecha_inicio', fecha_inicio)
    if (fecha_fin) params.set('fecha_fin', fecha_fin)
    return api.get<DashboardSummary>(`/dashboard/summary?${params.toString()}`)
  },

  async getStats(fecha_inicio?: string, fecha_fin?: string): Promise<DashboardStats> {
    const params = new URLSearchParams()
    if (fecha_inicio) params.set('fecha_inicio', fecha_inicio)
    if (fecha_fin) params.set('fecha_fin', fecha_fin)
    return api.get<DashboardStats>(`/dashboard/stats?${params.toString()}`)
  },
}

export { ApiError }