import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { CategoryForm } from './components/CategoryForm'
import { useCategorias } from './hooks/useCategorias'
import { useToast } from '@/shared/contexts/useToast'
import type { Categoria, CategoriaCreate } from '@/shared/types'
import type { CategoriaFormData } from './components/CategoryForm'

export function Categorias() {
  const { categorias, loading, error, create, update, remove, refetch } = useCategorias()
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async (data: CategoriaFormData) => {
    setSubmitLoading(true)
    try {
      if (editingCategoria) {
        await update(editingCategoria.id, data)
        showToast('success', 'Categoría actualizada correctamente')
      } else {
        await create(data as CategoriaCreate)
        showToast('success', 'Categoría creada correctamente')
      }
      setModalOpen(false)
      setEditingCategoria(null)
    } catch {
      showToast('error', 'Error al guardar la categoría')
    } finally {
      setSubmitLoading(false)
    }
  }

  const confirmDelete = (id: number) => {
    setDeletingId(id)
  }

  const executeDelete = async () => {
    if (!deletingId) return
    setSubmitLoading(true)
    try {
      await remove(deletingId)
      showToast('success', 'Categoría eliminada correctamente')
      setDeletingId(null)
    } catch {
      showToast('error', 'Error al eliminar la categoría')
    } finally {
      setSubmitLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCategoria(null)
    setModalOpen(true)
  }

  const openEditModal = (cat: Categoria) => {
    setEditingCategoria(cat)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="loading-spinner" size={24} />
        <span className="ml-2 text-[var(--color-text-secondary)]">Cargando categorías...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-[var(--color-danger)]">Error al cargar categorías: {error.message}</p>
          <button className="btn btn-primary mt-4" onClick={refetch}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Organiza tus movimientos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {categorias.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)]">No hay categorías registradas</p>
              <button className="btn btn-primary mt-4" onClick={openCreateModal}>
                <Plus size={18} /> Crear la primera
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Color</th>
                    <th>Icono</th>
                    <th className="w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(cat => (
                    <tr key={cat.id}>
                      <td className="font-medium">{cat.nombre}</td>
                      <td>
                        <span
                          className={`badge ${
                            cat.tipo === 'ingreso' ? 'badge-success'
                            : cat.tipo === 'gasto' ? 'badge-danger'
                            : 'badge-info'
                          }`}
                        >
                          {cat.tipo === 'ingreso' ? 'Ingreso'
                          : cat.tipo === 'gasto' ? 'Gasto' : 'Ambos'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-[var(--color-border)]"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-mono text-sm">{cat.color}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-sm">{cat.icono}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="btn btn-ghost btn-sm p-1.5"
                            onClick={() => openEditModal(cat)}
                            aria-label={`Editar ${cat.nombre}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                            onClick={() => confirmDelete(cat.id)}
                            aria-label={`Eliminar ${cat.nombre}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingCategoria(null)
        }}
        title={editingCategoria ? `Editar: ${editingCategoria.nombre}` : 'Nueva Categoría'}
      >
        <CategoryForm
          initialData={editingCategoria || undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalOpen(false)
            setEditingCategoria(null)
          }}
          isLoading={submitLoading}
        />
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p>¿Estás seguro de que quieres eliminar esta categoría?</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            No se puede eliminar si tiene ingresos o gastos asociados.
          </p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={executeDelete}
              disabled={submitLoading}
            >
              {submitLoading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}