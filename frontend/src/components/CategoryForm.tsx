import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  tipo: z.enum(['ingreso', 'gasto', 'ambos']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido').optional(),
  icono: z.string().max(50).optional(),
})

export type CategoriaFormData = z.infer<typeof categoriaSchema>

interface CategoryFormProps {
  initialData?: Partial<CategoriaFormData>
  onSubmit: (data: CategoriaFormData) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

export function CategoryForm({ initialData, onSubmit, onClose, isLoading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: '',
      tipo: 'gasto',
      color: '#6366f1',
      icono: 'folder',
      ...initialData,
    },
  })

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) setValue(key as keyof CategoriaFormData, value)
      })
    }
  }, [initialData, setValue])

  const handleFormSubmit = async (data: CategoriaFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="label">Nombre *</label>
        <input
          id="nombre"
          type="text"
          className={`input ${errors.nombre ? 'input-error' : ''}`}
          placeholder="Ej: Comida, Transporte, Nómina..."
          {...register('nombre')}
        />
        {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
      </div>

      <div>
        <label htmlFor="tipo" className="label">Tipo *</label>
        <select
          id="tipo"
          className={`input ${errors.tipo ? 'input-error' : ''}`}
          {...register('tipo')}
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
          <option value="ambos">Ambos</option>
        </select>
        {errors.tipo && <p className="error-message">{errors.tipo.message}</p>}
      </div>

      <div>
        <label htmlFor="color" className="label">Color</label>
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
            placeholder="#6366f1"
            {...register('color')}
          />
        </div>
        {errors.color && <p className="error-message">{errors.color.message}</p>}
      </div>

      <div>
        <label htmlFor="icono" className="label">Icono (Lucide)</label>
        <input
          id="icono"
          type="text"
          className={`input ${errors.icono ? 'input-error' : ''}`}
          placeholder="folder, utensils, bus, briefcase..."
          {...register('icono')}
        />
        {errors.icono && <p className="error-message">{errors.icono.message}</p>}
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Ver iconos en <a href="https://lucide.dev/icons/" target="_blank" rel="noopener" className="underline">lucide.dev</a>
        </p>
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