import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  note?: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  note,
  confirmLabel = 'Eliminar',
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-4">
        <p>{message}</p>
        {note && <p className="text-sm text-[var(--color-text-secondary)]">{note}</p>}
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}