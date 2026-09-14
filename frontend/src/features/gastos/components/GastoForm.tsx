import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { formatCurrency } from '@/shared/utils/format'
import type { Categoria, Tarjeta } from '@/shared/types'

const gastoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  descripcion: z.string().min(1, 'La descripción es requerida').max(200),
  categoria_id: z.number().int().positive('Selecciona una categoría'),
  tipo_pago: z.enum(['efectivo', 'debito', 'credito']),
  tarjeta_id: z.number().int().positive().optional().nullable(),
}).refine(
  data => {
    if (data.tipo_pago === 'credito') {
      return data.tarjeta_id !== undefined && data.tarjeta_id !== null && data.tarjeta_id > 0
    }
    return true
  },
  {
    message: 'Debe seleccionar una tarjeta para pagos con crédito',
    path: ['tarjeta_id'],
  }
)

export type GastoFormData = z.infer<typeof gastoSchema>

interface GastoFormProps {
  initialData?: Partial<GastoFormData>
  categorias: Categoria[]
  tarjetas: Tarjeta[]
  onSubmit: (data: GastoFormData) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

export function GastoForm({ initialData, categorias, tarjetas, onSubmit, onClose, isLoading }: GastoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GastoFormData>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      fecha: format(new Date(), 'yyyy-MM-dd'),
      monto: 0,
      descripcion: '',
      categoria_id: 0,
      tipo_pago: 'efectivo',
      tarjeta_id: null,
      ...initialData,
    },
  })

  const watchedTipoPago = watch('tipo_pago')

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          setValue(key as keyof GastoFormData, value as GastoFormData[keyof GastoFormData])
        }
      })
    }
  }, [initialData, setValue])

  const categoriasGasto = categorias.filter(c => c.tipo === 'gasto' || c.tipo === 'ambos')
  const tarjetasActivas = tarjetas.filter(t => t.activa)

  const showTarjeta = watchedTipoPago === 'credito'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="fecha" className="label">Fecha *</label>
        <input
          id="fecha"
          type="date"
          className={`input ${errors.fecha ? 'input-error' : ''}`}
          {...register('fecha')}
        />
        {errors.fecha && <p className="error-message">{errors.fecha.message}</p>}
      </div>

      <div>
        <label htmlFor="monto" className="label">Monto *</label>
        <input
          id="monto"
          type="number"
          step="0.01"
          min="0.01"
          className={`input ${errors.monto ? 'input-error' : ''}`}
          placeholder="0.00"
          {...register('monto', { valueAsNumber: true })}
        />
        {errors.monto && <p className="error-message">{errors.monto.message}</p>}
      </div>

      <div>
        <label htmlFor="descripcion" className="label">Descripción *</label>
        <input
          id="descripcion"
          type="text"
          className={`input ${errors.descripcion ? 'input-error' : ''}`}
          placeholder="Ej: Supermercado, Transporte, Cena..."
          {...register('descripcion')}
        />
        {errors.descripcion && <p className="error-message">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label htmlFor="categoria_id" className="label">Categoría *</label>
        <select
          id="categoria_id"
          className={`input ${errors.categoria_id ? 'input-error' : ''}`}
          {...register('categoria_id', { valueAsNumber: true })}
        >
          <option value="">Seleccionar categoría</option>
          {categoriasGasto.map(cat => (
            <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
              {cat.nombre} ({cat.tipo === 'gasto' ? 'Gasto' : 'Ambos'})
            </option>
          ))}
        </select>
        {errors.categoria_id && <p className="error-message">{errors.categoria_id.message}</p>}
        {categoriasGasto.length === 0 && (
          <p className="text-xs text-[var(--color-warning)] mt-1">
            No hay categorías de tipo "gasto" o "ambos". Crea una en <a href="/categorias" className="underline">Categorías</a>.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="tipo_pago" className="label">Tipo de pago *</label>
        <select
          id="tipo_pago"
          className={`input ${errors.tipo_pago ? 'input-error' : ''}`}
          {...register('tipo_pago')}
        >
          <option value="efectivo">Efectivo</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito (tarjeta)</option>
        </select>
        {errors.tipo_pago && <p className="error-message">{errors.tipo_pago.message}</p>}
      </div>

      {showTarjeta && (
        <div>
          <label htmlFor="tarjeta_id" className="label">Tarjeta *</label>
          <select
            id="tarjeta_id"
            className={`input ${errors.tarjeta_id ? 'input-error' : ''}`}
            {...register('tarjeta_id', { valueAsNumber: true })}
          >
            <option value="">Seleccionar tarjeta</option>
            {tarjetasActivas.map(tarjeta => (
              <option key={tarjeta.id} value={tarjeta.id} style={{ color: tarjeta.color }}>
                {tarjeta.nombre} (Disponible: {formatCurrency(tarjeta.disponible)})
              </option>
            ))}
          </select>
          {errors.tarjeta_id && <p className="error-message">{errors.tarjeta_id.message}</p>}
          {tarjetasActivas.length === 0 && (
            <p className="text-xs text-[var(--color-warning)] mt-1">
              No hay tarjetas activas. Crea una en <a href="/tarjetas" className="underline">Tarjetas</a>.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || categoriasGasto.length === 0 || (showTarjeta && tarjetasActivas.length === 0)}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}