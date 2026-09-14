import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  message: string
  hint?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, message, hint, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="mx-auto text-[var(--color-text-muted)] mb-4" size={40} />}
      <p className="text-[var(--color-text-muted)]">{message}</p>
      {hint && <p className="text-sm text-[var(--color-text-muted)] mt-1">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}