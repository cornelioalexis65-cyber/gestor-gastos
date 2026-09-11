import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, CreditCard, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { Modal } from '@/components/Modal'
import { TarjetaForm } from '@/components/TarjetaForm'
import { useTarjetas } from '@/hooks/useTarjetas'
import { tarjetasService } from '@/services/tarjetas'
import type { Tarjeta, PagoTarjeta } from '@/types'

export function Tarjetas() {
  const { tarjetas, loading, error, pagination, create, update, remove, refetch, goToPage } = useTarjetas()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTarjeta, setEditingTarjeta] = useState<Tarjeta | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [pagosModalOpen, setPagosModalOpen] = useState(false)
  const [selectedTarjetaPagos, setSelectedTarjetaPagos] = useState<Tarjeta | null>(null)
  const [pagosLoading, setPagosLoading] = useState(false)
  const [pagos, setPagos] = useState<PagoTarjeta[]>([])

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    setSubmitLoading(true)
    try {
      if (editingTarjeta) {
        await update(editingTarjeta.id, data)
      } else {
        await create(data)
      }
      setModalOpen(false)
      setEditingTarjeta(null)
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
    setEditingTarjeta(null)
    setModalOpen(true)
  }

  const openEditModal = (tarjeta: Tarjeta) => {
    setEditingTarjeta(tarjeta)
    setModalOpen(true)
  }

  const openPagosModal = async (tarjeta: Tarjeta) => {
    setSelectedTarjetaPagos(tarjeta)
    setPagosModalOpen(true)
    setPagosLoading(true)
    try {
      const data = await tarjetasService.getPagos(tarjeta.id, { page: 1, limit: 10 })
      setPagos(data.data)
    } catch (err) {
      console.error('Error loading pagos:', err)
    } finally {
      setPagosLoading(false)
    }
  }

  const closePagosModal = () => {
    setPagosModalOpen(false)
    setSelectedTarjetaPagos(null)
    setPagos([])
  }

  const handleAddPago = async (data: { fecha: string; monto: number; descripcion?: string }) => {
    if (!selectedTarjetaPagos) return
    setSubmitLoading(true)
    try {
      await tarjetasService.createPago(selectedTarjetaPagos.id, data)
      // Refresh pagos
      const data2 = await tarjetasService.getPagos(selectedTarjetaPagos.id, { page: 1, limit: 10 })
      setPagos(data2.data)
      // Refresh tarjetas to update saldo
      refetch()
    } catch (err) {
      console.error('Error creating pago:', err)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="loading-spinner" size={24} />
        <span className="ml-2 text-[var(--color-text-secondary)]">Cargando tarjetas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-[var(--color-danger)]">Error al cargar tarjetas: {error.message}</p>
          <button className="btn btn-primary mt-4" onClick={refetch}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tarjetas de Crédito</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Administra tus tarjetas</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Nueva Tarjeta
        </button>
      </div>

      {tarjetas.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-16">
            <CreditCard className="mx-auto text-[var(--color-text-muted)] mb-4" size={48} />
            <p className="text-[var(--color-text-muted)] mb-4">No hay tarjetas registradas</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={18} /> Crear la primera
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tarjetas.map(tarjeta => (
            <div
              key={tarjeta.id}
              className="card relative overflow-hidden"
              style={{ borderLeft: `4px solid ${tarjeta.color}` }}
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{tarjeta.nombre}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Corte: día {tarjeta.dia_corte} · Pago: día {tarjeta.dia_pago}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tarjeta.color }}
                  >
                    <CreditCard size={20} className="text-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Límite</span>
                    <span className="font-mono font-medium">
                      ${Number(tarjeta.limite_credito).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Usado</span>
                    <span className="font-mono font-medium text-[var(--color-danger)]">
                      -${Number(tarjeta.saldo_actual).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="font-medium">Disponible</span>
                    <span className="font-mono font-medium text-[var(--color-success)] text-lg">
                      ${Number(tarjeta.disponible).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <div className="flex gap-1">
                    <button
                      className="btn btn-ghost btn-sm p-1.5"
                      onClick={() => openEditModal(tarjeta)}
                      aria-label={`Editar ${tarjeta.nombre}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm p-1.5"
                      onClick={() => openPagosModal(tarjeta)}
                      aria-label={`Ver pagos ${tarjeta.nombre}`}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                      onClick={() => confirmDelete(tarjeta.id)}
                      aria-label={`Eliminar ${tarjeta.nombre}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span
                    className="badge"
                    style={{ backgroundColor: `${tarjeta.color}20`, color: tarjeta.color }}
                  >
                    {tarjeta.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="col-span-full flex items-center justify-between p-4 border-t border-[var(--color-border)]">
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
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTarjeta(null)
        }}
        title={editingTarjeta ? `Editar: ${editingTarjeta.nombre}` : 'Nueva Tarjeta'}
      >
        <TarjetaForm
          initialData={editingTarjeta || undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalOpen(false)
            setEditingTarjeta(null)
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
          <p>¿Estás seguro de que quieres eliminar esta tarjeta?</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Se marcará como inactiva. Los gastos y pagos asociados se conservarán.
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

      <Modal
        isOpen={pagosModalOpen}
        onClose={closePagosModal}
        title={selectedTarjetaPagos ? `Pagos: ${selectedTarjetaPagos.nombre}` : 'Pagos de tarjeta'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Registrar pago</h3>
          </div>
          <PagoForm
            tarjeta={selectedTarjetaPagos!}
            onSubmit={handleAddPago}
            onClose={closePagosModal}
            isLoading={submitLoading}
          />

          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="font-medium mb-3">Historial de pagos</h3>
            {pagosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="loading-spinner" size={20} />
              </div>
            ) : pagos.length === 0 ? (
              <p className="text-[var(--color-text-muted)] text-center py-8">No hay pagos registrados</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map(pago => (
                      <tr key={pago.id}>
                        <td className="font-mono text-sm">{format(new Date(pago.fecha), 'dd/MM/yyyy')}</td>
                        <td>{pago.descripcion || '—'}</td>
                        <td className="text-right font-mono text-[var(--color-success)]">
                          ${Number(pago.monto).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function PagoForm({
  tarjeta,
  onSubmit,
  onClose,
  isLoading,
}: {
  tarjeta: Tarjeta
  onSubmit: (data: { fecha: string; monto: number; descripcion?: string }) => Promise<void>
  onClose: () => void
  isLoading: boolean
}) {
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }
    if (montoNum > tarjeta.saldo_actual) {
      setError(`El pago no puede ser mayor al saldo actual ($${Number(tarjeta.saldo_actual).toLocaleString('es-ES', { minimumFractionDigits: 2 })})`)
      return
    }
    setError('')
    try {
      await onSubmit({ fecha, monto: montoNum, descripcion: descripcion || undefined })
      setFecha(format(new Date(), 'yyyy-MM-dd'))
      setMonto('')
      setDescripcion('')
    } catch {
      setError('Error al registrar el pago')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label text-sm">Fecha</label>
          <input
            type="date"
            className="input"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </div>
        <div>
          <label className="label text-sm">Monto</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={tarjeta.saldo_actual}
            className="input"
            placeholder="0.00"
            value={monto}
            onChange={e => setMonto(e.target.value)}
          />
        </div>
        <div>
          <label className="label text-sm">Descripción (opcional)</label>
          <input
            type="text"
            className="input"
            placeholder="Pago mensual..."
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="error-message text-sm">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar pago'}
        </button>
      </div>
    </form>
  )
}