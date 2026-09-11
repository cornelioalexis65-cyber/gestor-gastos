import { api, ApiError } from './api'
import type { Ingreso, IngresoCreate, IngresoUpdate, PaginatedResponse } from '@/types'

interface IngresosFilters {
  fecha_inicio?: string
  fecha_fin?: string
  categoria_id?: number
  page?: number
  limit?: number
}

export const ingresosService = {
  async getAll(filters: IngresosFilters = {}): Promise<PaginatedResponse<Ingreso>> {
    const params = new URLSearchParams()
    if (filters.fecha_inicio) params.set('fecha_inicio', filters.fecha_inicio)
    if (filters.fecha_fin) params.set('fecha_fin', filters.fecha_fin)
    if (filters.categoria_id) params.set('categoria_id', String(filters.categoria_id))
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))

    return api.get<PaginatedResponse<Ingreso>>(`/ingresos?${params.toString()}`)
  },

  async getById(id: number): Promise<Ingreso> {
    return api.get<Ingreso>(`/ingresos/${id}`)
  },

  async create(data: IngresoCreate): Promise<Ingreso> {
    return api.post<Ingreso>('/ingresos', data)
  },

  async update(id: number, data: IngresoUpdate): Promise<Ingreso> {
    return api.put<Ingreso>(`/ingresos/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`/ingresos/${id}`)
  },
}

export { ApiError }