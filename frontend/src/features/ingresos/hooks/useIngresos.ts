import { useState, useEffect, useCallback } from 'react'
import { ingresosService, ApiError } from '@/features/ingresos/services/ingresos'
import type { Ingreso, IngresoCreate, IngresoUpdate, PaginatedResponse } from '@/shared/types'

interface UseIngresosResult {
  ingresos: Ingreso[]
  loading: boolean
  error: ApiError | null
  pagination: PaginatedResponse<Ingreso>['pagination']
  filters: {
    fecha_inicio: string
    fecha_fin: string
    categoria_id: number | ''
  }
  setFilters: (filters: Partial<UseIngresosResult['filters']>) => void
  create: (data: IngresoCreate) => Promise<Ingreso>
  update: (id: number, data: IngresoUpdate) => Promise<Ingreso>
  remove: (id: number) => Promise<void>
  refetch: () => Promise<void>
  goToPage: (page: number) => void
}

export function useIngresos(): UseIngresosResult {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Ingreso>['pagination']>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFiltersState] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    categoria_id: '' as number | '',
  })

  const fetchIngresos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ingresosService.getAll({
        fecha_inicio: filters.fecha_inicio || undefined,
        fecha_fin: filters.fecha_fin || undefined,
        categoria_id: filters.categoria_id || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })
      setIngresos(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchIngresos()
  }, [fetchIngresos])

  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const create = async (data: IngresoCreate): Promise<Ingreso> => {
    const newIngreso = await ingresosService.create(data)
    setIngresos(prev => [newIngreso, ...prev].slice(0, pagination.limit))
    setPagination(prev => ({ ...prev, total: prev.total + 1 }))
    return newIngreso
  }

  const update = async (id: number, data: IngresoUpdate): Promise<Ingreso> => {
    const updated = await ingresosService.update(id, data)
    setIngresos(prev => prev.map(i => (i.id === id ? updated : i)))
    return updated
  }

  const remove = async (id: number): Promise<void> => {
    await ingresosService.delete(id)
    setIngresos(prev => prev.filter(i => i.id !== id))
    setPagination(prev => ({ ...prev, total: prev.total - 1 }))
  }

  return {
    ingresos,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    create,
    update,
    remove,
    refetch: fetchIngresos,
    goToPage,
  }
}