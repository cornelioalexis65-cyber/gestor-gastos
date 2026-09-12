import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CategoryPieChartProps {
  data: Array<{ nombre: string; total: number; color: string }>
  title?: string
}

export function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        Sin datos para mostrar
      </div>
    )
  }

  return (
    <div className="h-64">
      {title && <h3 className="text-center font-medium mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="total"
            nameKey="nombre"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={({ name, value, percent }: any) =>
              `${name}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)} (${((percent ?? 0) * 100).toFixed(1)}%)`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}