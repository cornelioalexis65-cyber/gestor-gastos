import { Wallet, TrendingUp, TrendingDown, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency } from '@/shared/utils/format'
import type { DashboardSummary } from '@/shared/types'

interface SummaryCardsProps {
  summary: DashboardSummary | null
}

interface SummaryCardProps {
  label: string
  value: string
  helper: string
  helperClass: string
  valueClass: string
  icon: LucideIcon
  iconClass: string
}

function SummaryCard({ label, value, helper, helperClass, valueClass, icon: Icon, iconClass }: SummaryCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
          <div className={`${iconClass} w-9 h-9 rounded-lg flex items-center justify-center`}>
            <Icon size={18} />
          </div>
        </div>
        <p className={`text-2xl font-bold font-mono mt-2 ${valueClass}`}>{value}</p>
        <p className={`text-xs mt-1 ${helperClass}`}>{helper}</p>
      </div>
    </div>
  )
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const balance = summary?.balance ?? 0
  const ingresos = summary?.ingresos ?? 0
  const gastos = summary?.gastos ?? 0
  const movIngresos = summary?.ingresosRecientes?.length ?? 0
  const movGastos = summary?.gastosRecientes?.length ?? 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Balance Actual"
        value={formatCurrency(balance)}
        helper={balance >= 0 ? 'Positivo' : 'Negativo'}
        helperClass={balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}
        valueClass={balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}
        icon={Wallet}
        iconClass="bg-[var(--color-primary-light)] text-[var(--color-primary)]"
      />
      <SummaryCard
        label="Ingresos Totales"
        value={formatCurrency(ingresos)}
        helper={`${movIngresos} movimientos recientes`}
        helperClass="text-[var(--color-text-muted)]"
        valueClass="text-[var(--color-success)]"
        icon={TrendingUp}
        iconClass="bg-[var(--color-success-light)] text-[var(--color-success)]"
      />
      <SummaryCard
        label="Gastos Totales"
        value={formatCurrency(gastos)}
        helper={`${movGastos} movimientos recientes`}
        helperClass="text-[var(--color-text-muted)]"
        valueClass="text-[var(--color-danger)]"
        icon={TrendingDown}
        iconClass="bg-[var(--color-danger-light)] text-[var(--color-danger)]"
      />
      <SummaryCard
        label="Diferencia"
        value={`${ingresos >= gastos ? '+' : ''}${formatCurrency(ingresos - gastos)}`}
        helper={ingresos >= gastos ? 'Superávit' : 'Déficit'}
        helperClass={ingresos >= gastos ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}
        valueClass={ingresos >= gastos ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}
        icon={Scale}
        iconClass="bg-[var(--color-warning-light)] text-[var(--color-warning)]"
      />
    </div>
  )
}