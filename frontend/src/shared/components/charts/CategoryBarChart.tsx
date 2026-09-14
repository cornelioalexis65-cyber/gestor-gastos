import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, formatCurrencyCompact } from '@/shared/utils/format'

interface CategoryBarChartProps {
  data: Array<{ nombre: string; total: number; color: string }>
  color?: string
}

export function CategoryBarChart({ data, color = '#6366f1' }: CategoryBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        Sin datos para mostrar
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tickFormatter={value => formatCurrencyCompact(Number(value))} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              typeof value === 'number' ? formatCurrency(value) : '$0',
              'Monto',
            ]}
          />
          <Legend />
          <Bar
            dataKey="total"
            fill={color}
            radius={[0, 4, 4, 0]}
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}