import { useState, useEffect, useCallback } from 'react'
import { gastosService, ApiError } from '@/features/gastos/services/gastos'
import type { Gasto, GastoCreate, GastoUpdate, PaginatedResponse } from '@/shared/types'

interface UseGastosResult {
  gastos: Gasto[]
  loading: boolean
  error: ApiError | null
  pagination: PaginatedResponse<Gasto>['pagination']
  filters: {
    fecha_inicio: string
    fecha_fin: string
    categoria_id: number | ''
    tarjeta_id: number | ''
    tipo_pago: 'efectivo' | 'debito' | 'credito' | ''
  }
  setFilters: (filters: Partial<UseGastosResult['filters']>) => void
  create: (data: GastoCreate) => Promise<Gasto>
  update: (id: number, data: GastoUpdate) => Promise<Gasto>
  remove: (id: number) => Promise<void>
  refetch: () => Promise<void>
  goToPage: (page: number) => void
}

export function useGastos(): UseGastosResult {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Gasto>['pagination']>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFiltersState] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    categoria_id: '' as number | '',
    tarjeta_id: '' as number | '',
    tipo_pago: '' as 'efectivo' | 'debito' | 'credito' | '',
  })

  const fetchGastos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gastosService.getAll({
        fecha_inicio: filters.fecha_inicio || undefined,
        fecha_fin: filters.fecha_fin || undefined,
        categoria_id: filters.categoria_id || undefined,
        tarjeta_id: filters.tarjeta_id || undefined,
        tipo_pago: filters.tipo_pago || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })
      setGastos(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchGastos()
  }, [fetchGastos])

  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const create = async (data: GastoCreate): Promise<Gasto> => {
    const newGasto = await gastosService.create(data)
    setGastos(prev => [newGasto, ...prev].slice(0, pagination.limit))
    setPagination(prev => ({ ...prev, total: prev.total + 1 }))
    return newGasto
  }

  const update = async (id: number, data: GastoUpdate): Promise<Gasto> => {
    const updated = await gastosService.update(id, data)
    setGastos(prev => prev.map(g => (g.id === id ? updated : g)))
    return updated
  }

  const remove = async (id: number): Promise<void> => {
    await gastosService.delete(id)
    setGastos(prev => prev.filter(g => g.id !== id))
    setPagination(prev => ({ ...prev, total: prev.total - 1 }))
  }

  return {
    gastos,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    create,
    update,
    remove,
    refetch: fetchGastos,
    goToPage,
  }
}