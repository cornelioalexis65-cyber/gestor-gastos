import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface BalanceLineChartProps {
  data: Array<{ mes: string; ingresos: number; gastos: number; balance: number }>
}

export function BalanceLineChart({ data }: BalanceLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        Sin datos para mostrar
      </div>
    )
  }

  const formatMes = (mes: string) => {
    const [year, month] = mes.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  }

  const chartData = data.map(d => ({
    mes: formatMes(d.mes),
    ingresos: d.ingresos,
    gastos: d.gastos,
    balance: d.balance,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => String(label)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => [
              typeof value === 'number'
                ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
                : '$0',
              name === 'ingresos' ? 'Ingresos' : name === 'gastos' ? 'Gastos' : 'Balance',
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Ingresos"
          />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Gastos"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#6366f1', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}