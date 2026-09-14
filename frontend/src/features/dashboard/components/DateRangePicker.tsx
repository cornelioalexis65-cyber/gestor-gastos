import { useState } from 'react'
import { Calendar } from 'lucide-react'

export interface DateRange {
  fecha_inicio: string
  fecha_fin: string
}

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (inicio: string, fin: string) => void
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const hasFilter = dateRange.fecha_inicio || dateRange.fecha_fin

  const handleChange = (type: 'inicio' | 'fin', value: string) => {
    if (type === 'inicio') {
      onDateRangeChange(value, dateRange.fecha_fin)
    } else {
      onDateRangeChange(dateRange.fecha_inicio, value)
    }
  }

  const clear = () => onDateRangeChange('', '')

  return (
    <div className="relative">
      <button
        className={`btn btn-secondary btn-sm ${open || hasFilter ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Calendar size={16} />
        {hasFilter ? 'Filtro activo' : 'Filtrar por fecha'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 p-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-10 min-w-[300px]">
          <div className="space-y-3">
            <div>
              <label className="label text-sm">Fecha inicio</label>
              <input
                type="date"
                className="input"
                value={dateRange.fecha_inicio}
                onChange={e => handleChange('inicio', e.target.value)}
                max={dateRange.fecha_fin || undefined}
              />
            </div>
            <div>
              <label className="label text-sm">Fecha fin</label>
              <input
                type="date"
                className="input"
                value={dateRange.fecha_fin}
                onChange={e => handleChange('fin', e.target.value)}
                min={dateRange.fecha_inicio || undefined}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
              {hasFilter && (
                <button className="btn btn-ghost btn-sm" onClick={clear}>
                  Limpiar
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}