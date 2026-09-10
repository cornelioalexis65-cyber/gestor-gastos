export function Tarjetas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarjetas de Crédito</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Administra tus tarjetas</p>
        </div>
        <button className="btn btn-primary">Nueva Tarjeta</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full text-center py-12 text-[var(--color-text-muted)]">
          No hay tarjetas registradas
        </div>
      </div>
    </div>
  )
}