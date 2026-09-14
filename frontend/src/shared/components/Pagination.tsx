import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  label?: string
}

export function Pagination({ page, totalPages, total, onPageChange, label = 'total' }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Página {page} de {totalPages} ({total} {label})
      </p>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-ghost btn-sm p-1.5"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="btn btn-ghost btn-sm p-1.5"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}