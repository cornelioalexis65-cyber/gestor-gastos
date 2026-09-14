import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tickFormatter={v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v)} />
          <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              typeof value === 'number'
                ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
                : '$0',
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