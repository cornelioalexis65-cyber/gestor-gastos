import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { EmptyState } from '@/shared/components/EmptyState'
import type { DashboardSummary, Ingreso, Gasto } from '@/shared/types'

interface RecentMovementsProps {
  summary: DashboardSummary | null
}

function MovementsTable({
  rows,
  emptyMessage,
  amountClass,
  sign,
  emptyIcon,
}: {
  rows: Array<Ingreso | Gasto>
  emptyMessage: string
  amountClass: string
  sign: '+' | '-'
  emptyIcon: LucideIcon
}) {
  if (rows.length === 0) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th className="text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map(row => (
            <tr key={row.id}>
              <td className="font-mono text-sm">{formatDate(row.fecha)}</td>
              <td className="font-medium">{row.descripcion}</td>
              <td>
                <span
                  className="badge"
                  style={row.categoria_color ? { backgroundColor: `${row.categoria_color}20`, color: row.categoria_color } : undefined}
                >
                  {row.categoria_nombre}
                </span>
              </td>
              <td className={`text-right font-mono ${amountClass}`}>
                {sign}
                {formatCurrency(Number(row.monto))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RecentMovements({ summary }: RecentMovementsProps) {
  const ingresos = summary?.ingresosRecientes ?? []
  const gastos = summary?.gastosRecientes ?? []

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ingresos Recientes</h2>
          <a href="/ingresos" className="text-sm text-[var(--color-primary)] hover:underline">
            Ver todos
          </a>
        </div>
        <div className="card-body p-0">
          <MovementsTable
            rows={ingresos}
            emptyMessage="No hay ingresos registrados"
            amountClass="text-[var(--color-success)]"
            sign="+"
            emptyIcon={TrendingUp}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold">Gastos Recientes</h2>
          <a href="/gastos" className="text-sm text-[var(--color-primary)] hover:underline">
            Ver todos
          </a>
        </div>
        <div className="card-body p-0">
          <MovementsTable
            rows={gastos}
            emptyMessage="No hay gastos registrados"
            amountClass="text-[var(--color-danger)]"
            sign="-"
            emptyIcon={TrendingDown}
          />
        </div>
      </div>
    </div>
  )
}