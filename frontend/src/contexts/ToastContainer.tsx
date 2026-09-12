import { X } from 'lucide-react'
import { ToastIcons } from './ToastIcons'
import type { Toast } from './ToastContext'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const colors = {
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]',
    error: 'bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]',
    warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]',
    info: 'bg-[var(--color-info-light)] text-[var(--color-info)] border-[var(--color-info)]',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => {
        const Icon = ToastIcons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${colors[toast.type]}`}
            role="alert"
          >
            <Icon size={20} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              className="text-current opacity-70 hover:opacity-100"
              onClick={() => onRemove(toast.id)}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}