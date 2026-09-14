import { useState, useEffect, useCallback } from 'react'
import { categoriasService, ApiError } from '@/features/categorias/services/categorias'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/shared/types'

interface UseCategoriasResult {
  categorias: Categoria[]
  loading: boolean
  error: ApiError | null
  create: (data: CategoriaCreate) => Promise<Categoria>
  update: (id: number, data: CategoriaUpdate) => Promise<Categoria>
  remove: (id: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriasService.getAll()
      setCategorias(data)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const create = async (data: CategoriaCreate): Promise<Categoria> => {
    const newCategoria = await categoriasService.create(data)
    setCategorias(prev => [...prev, newCategoria].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return newCategoria
  }

  const update = async (id: number, data: CategoriaUpdate): Promise<Categoria> => {
    const updated = await categoriasService.update(id, data)
    setCategorias(prev => prev.map(c => (c.id === id ? updated : c)))
    return updated
  }

  const remove = async (id: number): Promise<void> => {
    await categoriasService.delete(id)
    setCategorias(prev => prev.filter(c => c.id !== id))
  }

  return {
    categorias,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchCategorias,
  }
}