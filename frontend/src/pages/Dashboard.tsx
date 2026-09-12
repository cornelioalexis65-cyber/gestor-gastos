import { useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import type { Ingreso, Gasto } from '@/types'

export function Dashboard() {
  const { summary, stats, loading, error, refetch, setDateRange, dateRange } = useDashboard()

  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleDateChange = (type: 'inicio' | 'fin', value: string) => {
    if (type === 'inicio') {
      setDateRange(value, dateRange.fecha_fin)
    } else {
      setDateRange(dateRange.fecha_inicio, value)
    }
  }

  const clearDateRange = () => {
    setDateRange('', '')
  }

  const hasDateFilter = dateRange.fecha_inicio || dateRange.fecha_fin

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Resumen de tus finanzas</p>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="loading-spinner" size={20} />
            <span className="text-sm text-[var(--color-text-secondary)]">Cargando...</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="card-body">
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-2" />
                <div className="h-8 bg-[var(--color-border)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-[var(--color-danger)]">Error al cargar dashboard: {error.message}</p>
          <button className="btn btn-primary mt-4" onClick={refetch}>Reintentar</button>
        </div>
      </div>
    )
  }

  const balance = summary?.balance ?? 0
  const ingresos = summary?.ingresos ?? 0
  const gastos = summary?.gastos ?? 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Resumen de tus finanzas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className={`btn btn-secondary btn-sm ${showDatePicker ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : ''}`}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={16} className="mr-1" />
              {hasDateFilter ? 'Filtro activo' : 'Filtrar por fecha'}
            </button>
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-1 p-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-10 min-w-[300px]">
                <div className="space-y-3">
                  <div>
                    <label className="label text-sm">Fecha inicio</label>
                    <input
                      type="date"
                      className="input"
                      value={dateRange.fecha_inicio}
                      onChange={e => handleDateChange('inicio', e.target.value)}
                      max={dateRange.fecha_fin || undefined}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Fecha fin</label>
                    <input
                      type="date"
                      className="input"
                      value={dateRange.fecha_fin}
                      onChange={e => handleDateChange('fin', e.target.value)}
                      min={dateRange.fecha_inicio || undefined}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                    {hasDateFilter && (
                      <button className="btn btn-ghost btn-sm" onClick={clearDateRange}>
                        Limpiar
                      </button>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={() => setShowDatePicker(false)}>
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={refetch} title="Actualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Balance Actual</p>
            <p className={`text-3xl font-bold font-mono mt-1 ${balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Ingresos Totales</p>
            <p className="text-3xl font-bold font-mono text-[var(--color-success)] mt-1">
              {formatCurrency(ingresos)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {summary?.ingresosRecientes?.length ?? 0} movimientos
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Gastos Totales</p>
            <p className="text-3xl font-bold font-mono text-[var(--color-danger)] mt-1">
              {formatCurrency(gastos)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {summary?.gastosRecientes?.length ?? 0} movimientos
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Diferencia</p>
            <p className={`text-3xl font-bold font-mono mt-1 ${ingresos >= gastos ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {ingresos >= gastos ? '+' : ''}{formatCurrency(ingresos - gastos)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {ingresos >= gastos ? 'Superávit' : 'Déficit'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ingresos Recientes</h2>
            <a href="/ingresos" className="text-sm text-[var(--color-primary)] hover:underline">Ver todos</a>
          </div>
          <div className="card-body p-0">
            {(summary?.ingresosRecientes?.length ?? 0) > 0 ? (
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
                    {(summary?.ingresosRecientes ?? []).slice(0, 5).map((ing: Ingreso) => (
                      <tr key={ing.id}>
                        <td className="font-mono text-sm">{format(new Date(ing.fecha), 'dd/MM/yyyy')}</td>
                        <td className="font-medium">{ing.descripcion}</td>
                        <td>
                          <span
                            className="badge"
                            style={ing.categoria_color ? { backgroundColor: `${ing.categoria_color}20`, color: ing.categoria_color } : undefined}
                          >
                            {ing.categoria_nombre}
                          </span>
                        </td>
                        <td className="text-right font-mono text-[var(--color-success)]">
                          +{Number(ing.monto).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] text-center py-8">No hay ingresos registrados</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold">Gastos Recientes</h2>
            <a href="/gastos" className="text-sm text-[var(--color-primary)] hover:underline">Ver todos</a>
          </div>
          <div className="card-body p-0">
            {(summary?.gastosRecientes?.length ?? 0) > 0 ? (
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
                    {(summary?.gastosRecientes ?? []).slice(0, 5).map((gasto: Gasto) => (
                      <tr key={gasto.id}>
                        <td className="font-mono text-sm">{format(new Date(gasto.fecha), 'dd/MM/yyyy')}</td>
                        <td className="font-medium">{gasto.descripcion}</td>
                        <td>
                          <span
                            className="badge"
                            style={gasto.categoria_color ? { backgroundColor: `${gasto.categoria_color}20`, color: gasto.categoria_color } : undefined}
                          >
                            {gasto.categoria_nombre}
                          </span>
                        </td>
                        <td className="text-right font-mono text-[var(--color-danger)]">
                          -{Number(gasto.monto).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] text-center py-8">No hay gastos registrados</p>
            )}
          </div>
        </div>
      </div>

      {stats && (stats.gastosPorCategoria.length > 0 || stats.ingresosPorCategoria.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {stats.gastosPorCategoria.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Gastos por Categoría</h2>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {stats.gastosPorCategoria.slice(0, 6).map((cat: { nombre: string; color: string; icono: string; total: number }) => {
                    const total = gastos
                    const percentage = total > 0 ? (cat.total / total) * 100 : 0
                    return (
                      <div key={cat.nombre} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.nombre}
                          </span>
                          <span className="font-mono text-[var(--color-danger)]">
                            -{formatCurrencyCompact(cat.total)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {stats.ingresosPorCategoria.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Ingresos por Categoría</h2>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {stats.ingresosPorCategoria.slice(0, 6).map((cat: { nombre: string; color: string; icono: string; total: number }) => {
                    const total = ingresos
                    const percentage = total > 0 ? (cat.total / total) * 100 : 0
                    return (
                      <div key={cat.nombre} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.nombre}
                          </span>
                          <span className="font-mono text-[var(--color-success)]">
                            +{formatCurrencyCompact(cat.total)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {stats && stats.balanceMensual.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Balance Mensual (Últimos 12 meses)</h2>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {stats.balanceMensual.slice(-6).map((mes: { mes: string; ingresos: number; gastos: number }) => (
                <div key={mes.mes} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="font-medium">{format(new Date(mes.mes + '-01'), 'MMM yyyy')}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-[var(--color-success)]">
                      <TrendingUp size={14} /> {formatCurrencyCompact(mes.ingresos)}
                    </span>
                    <span className="flex items-center gap-1 text-[var(--color-danger)]">
                      <TrendingDown size={14} /> {formatCurrencyCompact(mes.gastos)}
                    </span>
                    <span className={`font-mono font-medium ${(mes.ingresos - mes.gastos) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {(mes.ingresos - mes.gastos) >= 0 ? '+' : ''}{formatCurrencyCompact(mes.ingresos - mes.gastos)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}