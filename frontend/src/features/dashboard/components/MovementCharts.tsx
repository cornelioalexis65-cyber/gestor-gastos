import { CategoryBarChart, BalanceLineChart, CategoryPieChart } from '@/shared/components/charts'
import type { DashboardStats } from '@/shared/types'

interface MovementChartsProps {
  stats: DashboardStats
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

export function MovementCharts({ stats }: MovementChartsProps) {
  const hasGastos = stats.gastosPorCategoria.length > 0
  const hasIngresos = stats.ingresosPorCategoria.length > 0
  const hasMovements = hasGastos || hasIngresos

  if (!hasMovements) return null

  return (
    <div className="space-y-4">
      {hasGastos && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Gastos por Categoría">
            <CategoryBarChart
              data={stats.gastosPorCategoria.slice(0, 8).map(c => ({ nombre: c.nombre, total: c.total, color: c.color }))}
              color="#6384f3"
            />
          </ChartCard>
          <ChartCard title="Distribución de Gastos">
            <CategoryPieChart
              data={stats.gastosPorCategoria.slice(0, 8).map(c => ({ nombre: c.nombre, total: c.total, color: c.color }))}
              title="Gastos"
            />
          </ChartCard>
        </div>
      )}

      {hasIngresos && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Ingresos por Categoría">
            <CategoryBarChart
              data={stats.ingresosPorCategoria.slice(0, 8).map(c => ({ nombre: c.nombre, total: c.total, color: c.color }))}
              color="#10b981"
            />
          </ChartCard>
          <ChartCard title="Distribución de Ingresos">
            <CategoryPieChart
              data={stats.ingresosPorCategoria.slice(0, 8).map(c => ({ nombre: c.nombre, total: c.total, color: c.color }))}
              title="Ingresos"
            />
          </ChartCard>
        </div>
      )}

      {stats.balanceMensual.length > 0 && (
        <ChartCard title="Balance Mensual (Últimos 12 meses)">
          <BalanceLineChart
            data={stats.balanceMensual.map(m => ({ mes: m.mes, ingresos: m.ingresos, gastos: m.gastos, balance: m.ingresos - m.gastos }))}
          />
        </ChartCard>
      )}
    </div>
  )
}