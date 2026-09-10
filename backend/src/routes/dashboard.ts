import { Router, Request, Response } from 'express'
import { db } from '../database/connection.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

function getQueryString(req: Request, key: string): string | undefined {
  const value = req.query[key]
  return typeof value === 'string' ? value : undefined
}

// GET /api/dashboard/summary
router.get('/summary', asyncHandler(async (req: Request, res: Response) => {
  const fecha_inicio = getQueryString(req, 'fecha_inicio')
  const fecha_fin = getQueryString(req, 'fecha_fin')

  let dateFilter = ''
  const args: (string | number)[] = []

  if (fecha_inicio && fecha_fin) {
    dateFilter = 'WHERE fecha BETWEEN ? AND ?'
    args.push(fecha_inicio, fecha_fin)
  } else if (fecha_inicio) {
    dateFilter = 'WHERE fecha >= ?'
    args.push(fecha_inicio)
  } else if (fecha_fin) {
    dateFilter = 'WHERE fecha <= ?'
    args.push(fecha_fin)
  }

  const ingresosResult = await db.execute({
    sql: `SELECT COALESCE(SUM(monto), 0) as total FROM ingresos ${dateFilter}`,
    args: [...args],
  })

  const gastosResult = await db.execute({
    sql: `SELECT COALESCE(SUM(monto), 0) as total FROM gastos ${dateFilter}`,
    args: [...args],
  })

  const ingresosRecientesResult = await db.execute({
    sql: `SELECT i.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono
          FROM ingresos i
          JOIN categorias c ON i.categoria_id = c.id
          ORDER BY i.fecha DESC, i.creado_en DESC
          LIMIT 5`,
    args: [],
  })

  const gastosRecientesResult = await db.execute({
    sql: `SELECT g.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono
          FROM gastos g
          JOIN categorias c ON g.categoria_id = c.id
          ORDER BY g.fecha DESC, g.creado_en DESC
          LIMIT 5`,
    args: [],
  })

  const ingresosTotal = Number(ingresosResult.rows[0]?.total || 0)
  const gastosTotal = Number(gastosResult.rows[0]?.total || 0)

  res.json({
    balance: ingresosTotal - gastosTotal,
    ingresos: ingresosTotal,
    gastos: gastosTotal,
    diferencia: ingresosTotal - gastosTotal,
    ingresosRecientes: ingresosRecientesResult.rows,
    gastosRecientes: gastosRecientesResult.rows,
  })
}))

// GET /api/dashboard/stats
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const fecha_inicio = getQueryString(req, 'fecha_inicio')
  const fecha_fin = getQueryString(req, 'fecha_fin')

  let dateFilter = ''
  const args: (string | number)[] = []

  if (fecha_inicio && fecha_fin) {
    dateFilter = 'WHERE fecha BETWEEN ? AND ?'
    args.push(fecha_inicio, fecha_fin)
  }

  const gastosPorCategoria = await db.execute({
    sql: `SELECT c.nombre, c.color, c.icono, COALESCE(SUM(g.monto), 0) as total
          FROM gastos g
          JOIN categorias c ON g.categoria_id = c.id
          ${dateFilter}
          GROUP BY c.id, c.nombre, c.color, c.icono
          ORDER BY total DESC`,
    args: [...args],
  })

  const ingresosPorCategoria = await db.execute({
    sql: `SELECT c.nombre, c.color, c.icono, COALESCE(SUM(i.monto), 0) as total
          FROM ingresos i
          JOIN categorias c ON i.categoria_id = c.id
          ${dateFilter}
          GROUP BY c.id, c.nombre, c.color, c.icono
          ORDER BY total DESC`,
    args: [...args],
  })

  const balanceMensual = await db.execute({
    sql: `
      SELECT
        strftime('%Y-%m', fecha) as mes,
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto END), 0) as ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto END), 0) as gastos
      FROM (
        SELECT fecha, monto, 'ingreso' as tipo FROM ingresos
        UNION ALL
        SELECT fecha, monto, 'gasto' as tipo FROM gastos
      )
      ${dateFilter ? dateFilter.replace('WHERE', 'WHERE') : ''}
      GROUP BY strftime('%Y-%m', fecha)
      ORDER BY mes DESC
      LIMIT 12
    `,
    args: [...args],
  })

  res.json({
    gastosPorCategoria: gastosPorCategoria.rows,
    ingresosPorCategoria: ingresosPorCategoria.rows,
    balanceMensual: balanceMensual.rows.reverse(),
  })
}))

export const dashboardRoutes = router