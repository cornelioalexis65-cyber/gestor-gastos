import { format } from 'date-fns'

const currency = 'MXN'
const locale = 'es-MX'

const currencyFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const currencyFormatterCompact = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatCurrencyCompact(value: number): string {
  return currencyFormatterCompact.format(value)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(isoDate: string): string {
  return format(new Date(isoDate), 'dd/MM/yyyy')
}

export function formatMonthYearLabel(mes: string): string {
  const [year, month] = mes.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString(locale, { month: 'short', year: '2-digit' })
}

export function formatDateInput(isoDate: string): string {
  return isoDate.slice(0, 10)
}