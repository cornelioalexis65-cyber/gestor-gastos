import { PageHeader } from '@/shared/components/PageHeader'

export function Configuracion() {
  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" subtitle="Preferencias de la aplicación" />

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Moneda</label>
              <p className="text-[var(--color-text-secondary)]">Peso mexicano (MXN $)</p>
            </div>
            <div>
              <label className="label">Formato de fecha</label>
              <p className="text-[var(--color-text-secondary)]">DD/MM/AAAA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Base de Datos</h2>
          <p className="text-[var(--color-text-secondary)]">
            Conectado a Turso (libSQL)
          </p>
        </div>
      </div>
    </div>
  )
}