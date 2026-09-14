import { api, ApiError } from '@/shared/services/api'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/shared/types'

export const categoriasService = {
  async getAll(): Promise<Categoria[]> {
    return api.get<Categoria[]>('/categorias')
  },

  async getById(id: number): Promise<Categoria> {
    return api.get<Categoria>(`/categorias/${id}`)
  },

  async create(data: CategoriaCreate): Promise<Categoria> {
    return api.post<Categoria>('/categorias', data)
  },

  async update(id: number, data: CategoriaUpdate): Promise<Categoria> {
    return api.put<Categoria>(`/categorias/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`/categorias/${id}`)
  },
}

export { ApiError }