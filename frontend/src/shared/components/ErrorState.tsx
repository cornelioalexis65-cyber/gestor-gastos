interface ErrorStateProps {
  error: { message: string } | null
  onRetry: () => void
  label?: string
}

export function ErrorState({ error, onRetry, label = 'Error al cargar los datos' }: ErrorStateProps) {
  return (
    <div className="card">
      <div className="card-body text-center py-8">
        <p className="text-[var(--color-danger)]">
          {label}: {error?.message}
        </p>
        <button className="btn btn-primary mt-4" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    </div>
  )
}