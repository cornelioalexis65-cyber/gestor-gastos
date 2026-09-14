import { api, ApiError } from '@/shared/services/api'
import type { Gasto, GastoCreate, GastoUpdate, PaginatedResponse } from '@/shared/types'

interface GastosFilters {
  fecha_inicio?: string
  fecha_fin?: string
  categoria_id?: number
  tarjeta_id?: number
  tipo_pago?: 'efectivo' | 'debito' | 'credito'
  page?: number
  limit?: number
}

export const gastosService = {
  async getAll(filters: GastosFilters = {}): Promise<PaginatedResponse<Gasto>> {
    const params = new URLSearchParams()
    if (filters.fecha_inicio) params.set('fecha_inicio', filters.fecha_inicio)
    if (filters.fecha_fin) params.set('fecha_fin', filters.fecha_fin)
    if (filters.categoria_id) params.set('categoria_id', String(filters.categoria_id))
    if (filters.tarjeta_id) params.set('tarjeta_id', String(filters.tarjeta_id))
    if (filters.tipo_pago) params.set('tipo_pago', filters.tipo_pago)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))

    return api.get<PaginatedResponse<Gasto>>(`/gastos?${params.toString()}`)
  },

  async getById(id: number): Promise<Gasto> {
    return api.get<Gasto>(`/gastos/${id}`)
  },

  async create(data: GastoCreate): Promise<Gasto> {
    return api.post<Gasto>('/gastos', data)
  },

  async update(id: number, data: GastoUpdate): Promise<Gasto> {
    return api.put<Gasto>(`/gastos/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`/gastos/${id}`)
  },
}

export { ApiError }