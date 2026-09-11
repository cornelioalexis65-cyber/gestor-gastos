import { api, ApiError } from './api'
import type { Tarjeta, TarjetaCreate, TarjetaUpdate, PaginatedResponse, PagoTarjeta, PagoTarjetaCreate } from '@/types'

interface TarjetasFilters {
  page?: number
  limit?: number
}

export const tarjetasService = {
  async getAll(filters: TarjetasFilters = {}): Promise<PaginatedResponse<Tarjeta>> {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))

    return api.get<PaginatedResponse<Tarjeta>>(`/tarjetas?${params.toString()}`)
  },

  async getAllSimple(): Promise<Tarjeta[]> {
    return api.get<Tarjeta[]>('/tarjetas')
  },

  async getById(id: number): Promise<Tarjeta> {
    return api.get<Tarjeta>(`/tarjetas/${id}`)
  },

  async create(data: TarjetaCreate): Promise<Tarjeta> {
    return api.post<Tarjeta>('/tarjetas', data)
  },

  async update(id: number, data: TarjetaUpdate): Promise<Tarjeta> {
    return api.put<Tarjeta>(`/tarjetas/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`/tarjetas/${id}`)
  },

  // Pagos
  async getPagos(tarjetaId: number, filters: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<PagoTarjeta>> {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))

    return api.get<PaginatedResponse<PagoTarjeta>>(`/tarjetas/${tarjetaId}/pagos?${params.toString()}`)
  },

  async createPago(tarjetaId: number, data: PagoTarjetaCreate): Promise<PagoTarjeta> {
    return api.post<PagoTarjeta>(`/tarjetas/${tarjetaId}/pagos`, data)
  },
}

export { ApiError }