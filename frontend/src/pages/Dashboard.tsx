export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Resumen de tus finanzas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Balance Actual</p>
            <p className="text-3xl font-bold font-mono mt-1">$0.00</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Ingresos Totales</p>
            <p className="text-3xl font-bold font-mono text-[var(--color-success)] mt-1">$0.00</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Gastos Totales</p>
            <p className="text-3xl font-bold font-mono text-[var(--color-danger)] mt-1">$0.00</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-[var(--color-text-secondary)]">Diferencia</p>
            <p className="text-3xl font-bold font-mono mt-1">$0.00</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Ingresos Recientes</h2>
          </div>
          <div className="card-body">
            <p className="text-[var(--color-text-muted)] text-center py-8">No hay ingresos registrados</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Gastos Recientes</h2>
          </div>
          <div className="card-body">
            <p className="text-[var(--color-text-muted)] text-center py-8">No hay gastos registrados</p>
          </div>
        </div>
      </div>
    </div>
  )
}