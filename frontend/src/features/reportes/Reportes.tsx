import { PageHeader } from '@/shared/components/PageHeader'

export function Reportes() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" subtitle="Estadísticas y análisis financieros" />

      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-[var(--color-text-muted)]">Próximamente: Gráficas y estadísticas detalladas</p>
        </div>
      </div>
    </div>
  )
}