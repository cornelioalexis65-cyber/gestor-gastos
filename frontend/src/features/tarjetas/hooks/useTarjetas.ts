import { useState, useEffect, useCallback } from 'react'
import { tarjetasService, ApiError } from '@/features/tarjetas/services/tarjetas'
import type { Tarjeta, TarjetaCreate, TarjetaUpdate, PaginatedResponse } from '@/shared/types'

interface UseTarjetasResult {
  tarjetas: Tarjeta[]
  loading: boolean
  error: ApiError | null
  pagination: PaginatedResponse<Tarjeta>['pagination']
  filters: {
    page: number
    limit: number
  }
  setFilters: (filters: Partial<UseTarjetasResult['filters']>) => void
  create: (data: TarjetaCreate) => Promise<Tarjeta>
  update: (id: number, data: TarjetaUpdate) => Promise<Tarjeta>
  remove: (id: number) => Promise<void>
  refetch: () => Promise<void>
  goToPage: (page: number) => void
}

export function useTarjetas(): UseTarjetasResult {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Tarjeta>['pagination']>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFiltersState] = useState({
    page: 1,
    limit: 25,
  })

  const fetchTarjetas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tarjetasService.getAll({
        page: filters.page,
        limit: filters.limit,
      })
      setTarjetas(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [filters.page, filters.limit])

  useEffect(() => {
    fetchTarjetas()
  }, [fetchTarjetas])

  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const goToPage = (page: number) => {
    setFiltersState(prev => ({ ...prev, page }))
  }

  const create = async (data: TarjetaCreate): Promise<Tarjeta> => {
    const newTarjeta = await tarjetasService.create(data)
    setTarjetas(prev => [newTarjeta, ...prev].slice(0, pagination.limit))
    setPagination(prev => ({ ...prev, total: prev.total + 1 }))
    return newTarjeta
  }

  const update = async (id: number, data: TarjetaUpdate): Promise<Tarjeta> => {
    const updated = await tarjetasService.update(id, data)
    setTarjetas(prev => prev.map(t => (t.id === id ? updated : t)))
    return updated
  }

  const remove = async (id: number): Promise<void> => {
    await tarjetasService.delete(id)
    setTarjetas(prev => prev.filter(t => t.id !== id))
    setPagination(prev => ({ ...prev, total: prev.total - 1 }))
  }

  return {
    tarjetas,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    create,
    update,
    remove,
    refetch: fetchTarjetas,
    goToPage,
  }
}