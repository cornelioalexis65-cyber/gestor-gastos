import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../database/connection.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const router = Router()

const ingresoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  monto: z.number().positive(),
  descripcion: z.string().min(1).max(200),
  categoria_id: z.number().int().positive(),
})

const ingresoUpdateSchema = ingresoSchema.partial()

// GET /api/ingresos
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { fecha_inicio, fecha_fin, categoria_id, page = '1', limit = '50' } = req.query

  let sql = `
    SELECT i.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono
    FROM ingresos i
    JOIN categorias c ON i.categoria_id = c.id
    WHERE 1=1
  `
  const args: (string | number)[] = []

  if (fecha_inicio) {
    sql += ' AND i.fecha >= ?'
    args.push(fecha_inicio as string)
  }
  if (fecha_fin) {
    sql += ' AND i.fecha <= ?'
    args.push(fecha_fin as string)
  }
  if (categoria_id) {
    sql += ' AND i.categoria_id = ?'
    args.push(parseInt(categoria_id as string, 10))
  }

  sql += ' ORDER BY i.fecha DESC, i.creado_en DESC'

  const pageNum = Math.max(1, parseInt(page as string, 10))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))
  const offset = (pageNum - 1) * limitNum

  sql += ' LIMIT ? OFFSET ?'
  args.push(limitNum, offset)

  const result = await db.execute({ sql, args })

  // Count total
  let countSql = 'SELECT COUNT(*) as total FROM ingresos WHERE 1=1'
  const countArgs: (string | number)[] = []
  if (fecha_inicio) {
    countSql += ' AND fecha >= ?'
    countArgs.push(fecha_inicio as string)
  }
  if (fecha_fin) {
    countSql += ' AND fecha <= ?'
    countArgs.push(fecha_fin as string)
  }
  if (categoria_id) {
    countSql += ' AND categoria_id = ?'
    countArgs.push(parseInt(categoria_id as string, 10))
  }

  const countResult = await db.execute({ sql: countSql, args: countArgs })
  const total = Number(countResult.rows[0]?.total || 0)

  res.json({
    data: result.rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  })
}))

// GET /api/ingresos/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: `SELECT i.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono
          FROM ingresos i
          JOIN categorias c ON i.categoria_id = c.id
          WHERE i.id = ?`,
    args: [id],
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Ingreso no encontrado')
  }

  res.json(result.rows[0])
}))

// POST /api/ingresos
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data = ingresoSchema.parse(req.body)

  const catResult = await db.execute({
    sql: 'SELECT id FROM categorias WHERE id = ? AND tipo IN (?, ?)',
    args: [data.categoria_id, 'ingreso', 'ambos'],
  })

  if (catResult.rows.length === 0) {
    throw new AppError(400, 'Categoría inválida para ingresos')
  }

  const result = await db.execute({
    sql: `INSERT INTO ingresos (fecha, monto, descripcion, categoria_id) VALUES (?, ?, ?, ?)
          RETURNING *`,
    args: [data.fecha, data.monto, data.descripcion, data.categoria_id],
  })

  res.status(201).json(result.rows[0])
}))

// PUT /api/ingresos/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const data = ingresoUpdateSchema.parse(req.body)

  if (data.categoria_id !== undefined) {
    const catResult = await db.execute({
      sql: 'SELECT id FROM categorias WHERE id = ? AND tipo IN (?, ?)',
      args: [data.categoria_id, 'ingreso', 'ambos'],
    })

    if (catResult.rows.length === 0) {
      throw new AppError(400, 'Categoría inválida para ingresos')
    }
  }

  const fields: string[] = []
  const args: (string | number)[] = []

  if (data.fecha !== undefined) {
    fields.push('fecha = ?')
    args.push(data.fecha)
  }
  if (data.monto !== undefined) {
    fields.push('monto = ?')
    args.push(data.monto)
  }
  if (data.descripcion !== undefined) {
    fields.push('descripcion = ?')
    args.push(data.descripcion)
  }
  if (data.categoria_id !== undefined) {
    fields.push('categoria_id = ?')
    args.push(data.categoria_id)
  }

  if (fields.length === 0) {
    throw new AppError(400, 'No hay datos para actualizar')
  }

  args.push(id)

  const result = await db.execute({
    sql: `UPDATE ingresos SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
    args,
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Ingreso no encontrado')
  }

  res.json(result.rows[0])
}))

// DELETE /api/ingresos/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: 'DELETE FROM ingresos WHERE id = ?',
    args: [id],
  })

  if (result.rowsAffected === 0) {
    throw new AppError(404, 'Ingreso no encontrado')
  }

  res.status(204).send()
}))

export const ingresosRoutes = router