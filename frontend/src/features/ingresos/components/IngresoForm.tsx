import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import type { Categoria } from '@/shared/types'

const ingresoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  descripcion: z.string().min(1, 'La descripción es requerida').max(200),
  categoria_id: z.number().int().positive('Selecciona una categoría'),
})

export type IngresoFormData = z.infer<typeof ingresoSchema>

interface IngresoFormProps {
  initialData?: Partial<IngresoFormData>
  categorias: Categoria[]
  onSubmit: (data: IngresoFormData) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

export function IngresoForm({ initialData, categorias, onSubmit, onClose, isLoading }: IngresoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IngresoFormData>({
    resolver: zodResolver(ingresoSchema),
    defaultValues: {
      fecha: format(new Date(), 'yyyy-MM-dd'),
      monto: 0,
      descripcion: '',
      categoria_id: 0,
      ...initialData,
    },
  })

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          setValue(key as keyof IngresoFormData, value as IngresoFormData[keyof IngresoFormData])
        }
      })
    }
  }, [initialData, setValue])

  const categoriasIngreso = categorias.filter(c => c.tipo === 'ingreso' || c.tipo === 'ambos')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="fecha" className="label">Fecha *</label>
        <input
          id="fecha"
          type="date"
          className={`input ${errors.fecha ? 'input-error' : ''}`}
          {...register('fecha', { valueAsDate: false })}
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
          placeholder="Ej: Nómina enero, Pago freelance..."
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
          {categoriasIngreso.map(cat => (
            <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
              {cat.nombre} ({cat.tipo === 'ingreso' ? 'Ingreso' : 'Ambos'})
            </option>
          ))}
        </select>
        {errors.categoria_id && <p className="error-message">{errors.categoria_id.message}</p>}
        {categoriasIngreso.length === 0 && (
          <p className="text-xs text-[var(--color-warning)] mt-1">
            No hay categorías de tipo "ingreso" o "ambos". Crea una en <a href="/categorias" className="underline">Categorías</a>.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || categoriasIngreso.length === 0}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}