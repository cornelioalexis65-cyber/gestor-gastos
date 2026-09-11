import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { format } from 'date-fns'
import { Modal } from '@/components/Modal'
import { IngresoForm } from '@/components/IngresoForm'
import { useIngresos } from '@/hooks/useIngresos'
import { useCategorias } from '@/hooks/useCategorias'
import type { Ingreso } from '@/types'

export function Ingresos() {
  const { ingresos, loading, error, pagination, filters, setFilters, create, update, remove, refetch, goToPage } = useIngresos()
  const { categorias: allCategorias, loading: catLoading } = useCategorias()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    setSubmitLoading(true)
    try {
      if (editingIngreso) {
        await update(editingIngreso.id, data)
      } else {
        await create(data)
      }
      setModalOpen(false)
      setEditingIngreso(null)
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
      setDeletingId(null)
    } finally {
      setSubmitLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingIngreso(null)
    setModalOpen(true)
  }

  const openEditModal = (ing: Ingreso) => {
    setEditingIngreso(ing)
    setModalOpen(true)
  }

  const clearFilters = () => {
    setFilters({ fecha_inicio: '', fecha_fin: '', categoria_id: '' })
  }

  const hasActiveFilters = filters.fecha_inicio || filters.fecha_fin || filters.categoria_id

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="loading-spinner" size={24} />
        <span className="ml-2 text-[var(--color-text-secondary)]">Cargando ingresos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-[var(--color-danger)]">Error al cargar ingresos: {error.message}</p>
          <button className="btn btn-primary mt-4" onClick={refetch}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ingresos</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Gestiona tus ingresos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal} disabled={catLoading}>
          <Plus size={18} /> Nuevo Ingreso
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="fecha_inicio" className="label text-sm">Fecha inicio</label>
                <input
                  id="fecha_inicio"
                  type="date"
                  className="input"
                  value={filters.fecha_inicio}
                  onChange={e => setFilters({ fecha_inicio: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="fecha_fin" className="label text-sm">Fecha fin</label>
                <input
                  id="fecha_fin"
                  type="date"
                  className="input"
                  value={filters.fecha_fin}
                  onChange={e => setFilters({ fecha_fin: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="categoria_id" className="label text-sm">Categoría</label>
                <select
                  id="categoria_id"
                  className="input"
                  value={filters.categoria_id}
                  onChange={e => setFilters({ categoria_id: e.target.value ? Number(e.target.value) : '' })}
                >
                  <option value="">Todas las categorías</option>
                  {allCategorias
                    .filter(c => c.tipo === 'ingreso' || c.tipo === 'ambos')
                    .map(cat => (
                      <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
                        {cat.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                {hasActiveFilters && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={clearFilters}
                    title="Limpiar filtros"
                  >
                    <X size={16} /> Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {ingresos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)]">
                {hasActiveFilters ? 'No hay ingresos con los filtros actuales' : 'No hay ingresos registrados'}
              </p>
              {!hasActiveFilters && (
                <button className="btn btn-primary mt-4" onClick={openCreateModal} disabled={catLoading}>
                  <Plus size={18} /> Crear el primero
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th className="text-right">Monto</th>
                      <th className="w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map(ing => (
                      <tr key={ing.id}>
                        <td className="font-mono text-sm">{format(new Date(ing.fecha), 'dd/MM/yyyy')}</td>
                        <td className="font-medium">{ing.descripcion}</td>
                        <td>
                          <span
                            className={`badge ${ing.categoria_color ? '' : 'badge-primary'}`}
                            style={ing.categoria_color ? { backgroundColor: `${ing.categoria_color}20`, color: ing.categoria_color } : undefined}
                          >
                            {ing.categoria_nombre}
                          </span>
                        </td>
                        <td className="text-right font-mono text-[var(--color-success)]">
                          +${Number(ing.monto).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-ghost btn-sm p-1.5"
                              onClick={() => openEditModal(ing)}
                              aria-label={`Editar ${ing.descripcion}`}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                              onClick={() => confirmDelete(ing.id)}
                              aria-label={`Eliminar ${ing.descripcion}`}
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

              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-ghost btn-sm p-1.5"
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm p-1.5"
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingIngreso(null)
        }}
        title={editingIngreso ? `Editar: ${editingIngreso.descripcion}` : 'Nuevo Ingreso'}
      >
        <IngresoForm
          initialData={editingIngreso || undefined}
          categorias={allCategorias}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalOpen(false)
            setEditingIngreso(null)
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
          <p>¿Estás seguro de que quieres eliminar este ingreso?</p>
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