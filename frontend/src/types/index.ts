export interface Categoria {
  id: number
  nombre: string
  tipo: 'ingreso' | 'gasto' | 'ambos'
  color: string
  icono: string
  creado_en: string
  actualizado_en: string
}

export interface CategoriaCreate {
  nombre: string
  tipo: 'ingreso' | 'gasto' | 'ambos'
  color?: string
  icono?: string
}

export type CategoriaUpdate = Partial<CategoriaCreate>

export interface Ingreso {
  id: number
  fecha: string
  monto: number
  descripcion: string
  categoria_id: number
  categoria_nombre?: string
  categoria_color?: string
  categoria_icono?: string
  creado_en: string
  actualizado_en: string
}

export interface IngresoCreate {
  fecha: string
  monto: number
  descripcion: string
  categoria_id: number
}

export type IngresoUpdate = Partial<IngresoCreate>

export interface Gasto {
  id: number
  fecha: string
  monto: number
  descripcion: string
  categoria_id: number
  tarjeta_id: number | null
  tipo_pago: 'efectivo' | 'debito' | 'credito'
  categoria_nombre?: string
  categoria_color?: string
  categoria_icono?: string
  tarjeta_nombre?: string
  tarjeta_color?: string
  creado_en: string
  actualizado_en: string
}

export interface GastoCreate {
  fecha: string
  monto: number
  descripcion: string
  categoria_id: number
  tarjeta_id?: number | null
  tipo_pago?: 'efectivo' | 'debito' | 'credito'
}

export type GastoUpdate = Partial<GastoCreate>

export interface Tarjeta {
  id: number
  nombre: string
  limite_credito: number
  dia_corte: number
  dia_pago: number
  saldo_actual: number
  color: string
  activa: boolean
  disponible: number
  creado_en: string
  actualizado_en: string
}

export interface TarjetaCreate {
  nombre: string
  limite_credito: number
  dia_corte: number
  dia_pago: number
  color?: string
}

export type TarjetaUpdate = Partial<TarjetaCreate>

export interface PagoTarjeta {
  id: number
  tarjeta_id: number
  fecha: string
  monto: number
  descripcion: string | null
  creado_en: string
}

export interface PagoTarjetaCreate {
  fecha: string
  monto: number
  descripcion?: string
}

export interface DashboardSummary {
  balance: number
  ingresos: number
  gastos: number
  diferencia: number
  ingresosRecientes: Ingreso[]
  gastosRecientes: Gasto[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  code: string
  details?: unknown
}