import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatCurrency } from '@/shared/utils/format'

const tarjetaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  limite_credito: z.number().positive('El límite debe ser mayor a 0'),
  dia_corte: z.number().int().min(1, 'Día de corte inválido').max(31, 'Día de corte inválido'),
  dia_pago: z.number().int().min(1, 'Día de pago inválido').max(31, 'Día de pago inválido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido (formato #RRGGBB)'),
})

export type TarjetaFormData = z.infer<typeof tarjetaSchema>

interface TarjetaFormProps {
  initialData?: Partial<TarjetaFormData>
  onSubmit: (data: TarjetaFormData) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

export function TarjetaForm({ initialData, onSubmit, onClose, isLoading }: TarjetaFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TarjetaFormData>({
    resolver: zodResolver(tarjetaSchema),
    defaultValues: {
      nombre: '',
      limite_credito: 0,
      dia_corte: 1,
      dia_pago: 1,
      color: '#3b82f6',
      ...initialData,
    },
  })

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          setValue(key as keyof TarjetaFormData, value as TarjetaFormData[keyof TarjetaFormData])
        }
      })
    }
  }, [initialData, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="label">Nombre *</label>
        <input
          id="nombre"
          type="text"
          className={`input ${errors.nombre ? 'input-error' : ''}`}
          placeholder="Ej: Tarjeta Principal, Visa Oro..."
          {...register('nombre')}
        />
        {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="limite_credito" className="label">Límite de crédito *</label>
          <input
            id="limite_credito"
            type="number"
            step="0.01"
            min="0.01"
            className={`input ${errors.limite_credito ? 'input-error' : ''}`}
            placeholder="0.00"
            {...register('limite_credito', { valueAsNumber: true })}
          />
          {errors.limite_credito && <p className="error-message">{errors.limite_credito.message}</p>}
        </div>

        <div>
          <label htmlFor="color" className="label">Color *</label>
          <div className="flex items-center gap-3">
            <input
              id="color"
              type="color"
              className="w-10 h-10 rounded border border-[var(--color-border)] cursor-pointer"
              {...register('color')}
            />
            <input
              type="text"
              className="input flex-1 font-mono text-sm"
              placeholder="#3b82f6"
              {...register('color')}
            />
          </div>
          {errors.color && <p className="error-message">{errors.color.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dia_corte" className="label">Día de corte *</label>
          <input
            id="dia_corte"
            type="number"
            min="1"
            max="31"
            className={`input ${errors.dia_corte ? 'input-error' : ''}`}
            placeholder="1-31"
            {...register('dia_corte', { valueAsNumber: true })}
          />
          {errors.dia_corte && <p className="error-message">{errors.dia_corte.message}</p>}
        </div>

        <div>
          <label htmlFor="dia_pago" className="label">Día de pago *</label>
          <input
            id="dia_pago"
            type="number"
            min="1"
            max="31"
            className={`input ${errors.dia_pago ? 'input-error' : ''}`}
            placeholder="1-31"
            {...register('dia_pago', { valueAsNumber: true })}
          />
          {errors.dia_pago && <p className="error-message">{errors.dia_pago.message}</p>}
        </div>
      </div>

      <div className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
        <p className="text-sm font-medium mb-2">Resumen</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Límite:</span>
          <span className="font-mono font-medium">
            {formatCurrency(watch('limite_credito') || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[var(--color-text-secondary)]">Día de corte:</span>
          <span className="font-mono font-medium">{watch('dia_corte') || '-'}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[var(--color-text-secondary)]">Día de pago:</span>
          <span className="font-mono font-medium">{watch('dia_pago') || '-'}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}