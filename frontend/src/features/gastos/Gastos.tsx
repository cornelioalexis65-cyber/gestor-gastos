import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, X, CreditCard, Receipt } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyState } from '@/shared/components/EmptyState'
import { Pagination } from '@/shared/components/Pagination'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { GastoForm } from './components/GastoForm'
import { useGastos } from './hooks/useGastos'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { tarjetasService } from '@/features/tarjetas/services/tarjetas'
import { useToast } from '@/shared/contexts/useToast'
import type { Gasto, Tarjeta } from '@/shared/types'

export function Gastos() {
  const { gastos, loading, error, pagination, filters, setFilters, create, update, remove, refetch, goToPage } = useGastos()
  const { categorias: allCategorias, loading: catLoading } = useCategorias()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [tarjetasLoading, setTarjetasLoading] = useState(true)

  // Cargar tarjetas para el selector
  const loadTarjetas = async () => {
    try {
      setTarjetasLoading(true)
      const data = await tarjetasService.getAllSimple()
      setTarjetas(data.filter(t => t.activa))
    } catch (err) {
      console.error('Error loading tarjetas:', err)
    } finally {
      setTarjetasLoading(false)
    }
  }

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    setSubmitLoading(true)
    try {
      if (editingGasto) {
        await update(editingGasto.id, data)
        showToast('success', 'Gasto actualizado correctamente')
      } else {
        await create(data)
        showToast('success', 'Gasto creado correctamente')
      }
      setModalOpen(false)
      setEditingGasto(null)
    } catch {
      showToast('error', 'Error al guardar el gasto')
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
      showToast('success', 'Gasto eliminado correctamente')
      setDeletingId(null)
    } catch {
      showToast('error', 'Error al eliminar el gasto')
    } finally {
      setSubmitLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingGasto(null)
    setModalOpen(true)
  }

  const openEditModal = (gasto: Gasto) => {
    setEditingGasto(gasto)
    setModalOpen(true)
  }

  const clearFilters = () => {
    setFilters({ fecha_inicio: '', fecha_fin: '', categoria_id: '', tarjeta_id: '', tipo_pago: '' })
  }

  const hasActiveFilters = filters.fecha_inicio || filters.fecha_fin || filters.categoria_id || filters.tarjeta_id || filters.tipo_pago

  // Cargar tarjetas al montar
  useEffect(() => {
    loadTarjetas()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="loading-spinner" size={24} />
        <span className="ml-2 text-[var(--color-text-secondary)]">Cargando gastos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-[var(--color-danger)]">Error al cargar gastos: {error.message}</p>
          <button className="btn btn-primary mt-4" onClick={refetch}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gastos"
        subtitle="Gestiona tus gastos"
        actions={
          <button className="btn btn-primary" onClick={openCreateModal} disabled={catLoading || tarjetasLoading}>
            <Plus size={18} /> Nuevo Gasto
          </button>
        }
      />

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
                    .filter(c => c.tipo === 'gasto' || c.tipo === 'ambos')
                    .map(cat => (
                      <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
                        {cat.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="tipo_pago" className="label text-sm">Tipo de pago</label>
                <select
                  id="tipo_pago"
                  className="input"
                  value={filters.tipo_pago}
                  onChange={e => setFilters({ tipo_pago: e.target.value as 'efectivo' | 'debito' | 'credito' | '' })}
                >
                  <option value="">Todos</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="tarjeta_id" className="label text-sm">Tarjeta</label>
                <select
                  id="tarjeta_id"
                  className="input"
                  value={filters.tarjeta_id}
                  onChange={e => setFilters({ tarjeta_id: e.target.value ? Number(e.target.value) : '' })}
                >
                  <option value="">Todas las tarjetas</option>
                  {tarjetas.map(t => (
                    <option key={t.id} value={t.id} style={{ color: t.color }}>
                      {t.nombre}
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

          {gastos.length === 0 ? (
            <EmptyState
              icon={Receipt}
              message={hasActiveFilters ? 'No hay gastos con los filtros actuales' : 'No hay gastos registrados'}
              action={
                !hasActiveFilters && (
                  <button className="btn btn-primary" onClick={openCreateModal} disabled={catLoading || tarjetasLoading}>
                    <Plus size={18} /> Crear el primero
                  </button>
                )
              }
            />
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Tipo pago</th>
                      <th>Tarjeta</th>
                      <th className="text-right">Monto</th>
                      <th className="w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map(gasto => (
                      <tr key={gasto.id}>
                        <td className="font-mono text-sm">{formatDate(gasto.fecha)}</td>
                        <td className="font-medium">{gasto.descripcion}</td>
                        <td>
                          <span
                            className={`badge ${gasto.categoria_color ? '' : 'badge-danger'}`}
                            style={gasto.categoria_color ? { backgroundColor: `${gasto.categoria_color}20`, color: gasto.categoria_color } : undefined}
                          >
                            {gasto.categoria_nombre}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            gasto.tipo_pago === 'credito' ? 'badge-info'
                            : gasto.tipo_pago === 'debito' ? 'badge-warning'
                            : 'badge-secondary'
                          }`}>
                            {gasto.tipo_pago === 'efectivo' ? 'Efectivo'
                            : gasto.tipo_pago === 'debito' ? 'Débito' : 'Crédito'}
                          </span>
                        </td>
                        <td>
                          {gasto.tarjeta_nombre ? (
                            <span style={{ color: gasto.tarjeta_color }}>
                              <CreditCard size={14} className="inline-block mr-1" />
                              {gasto.tarjeta_nombre}
                            </span>
                          ) : (
                            <span className="text-[var(--color-text-muted)]">—</span>
                          )}
                        </td>
                        <td className="text-right font-mono text-[var(--color-danger)]">
                          -{formatCurrency(gasto.monto)}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-ghost btn-sm p-1.5"
                              onClick={() => openEditModal(gasto)}
                              aria-label={`Editar ${gasto.descripcion}`}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                              onClick={() => confirmDelete(gasto.id)}
                              aria-label={`Eliminar ${gasto.descripcion}`}
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

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={goToPage}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingGasto(null)
        }}
        title={editingGasto ? `Editar: ${editingGasto.descripcion}` : 'Nuevo Gasto'}
        size="lg"
      >
        <GastoForm
          initialData={editingGasto || undefined}
          categorias={allCategorias}
          tarjetas={tarjetas}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalOpen(false)
            setEditingGasto(null)
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
          <p>¿Estás seguro de que quieres eliminar este gasto?</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Si era un gasto con tarjeta de crédito, se restaurará el saldo disponible.
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