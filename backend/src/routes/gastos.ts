import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../database/connection.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const router = Router()

const gastoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  monto: z.number().positive(),
  descripcion: z.string().min(1).max(200),
  categoria_id: z.number().int().positive(),
  tarjeta_id: z.number().int().positive().optional().nullable(),
  tipo_pago: z.enum(['efectivo', 'debito', 'credito']).default('efectivo'),
})

const gastoUpdateSchema = gastoSchema.partial()

interface GastoRow {
  tarjeta_id: number | null
  tipo_pago: string
  monto: number
}

// GET /api/gastos
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { fecha_inicio, fecha_fin, categoria_id, tarjeta_id, tipo_pago, page = '1', limit = '50' } = req.query

  let sql = `
    SELECT g.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono,
           t.nombre as tarjeta_nombre, t.color as tarjeta_color
    FROM gastos g
    JOIN categorias c ON g.categoria_id = c.id
    LEFT JOIN tarjetas t ON g.tarjeta_id = t.id
    WHERE 1=1
  `
  const args: (string | number)[] = []

  if (fecha_inicio) {
    sql += ' AND g.fecha >= ?'
    args.push(fecha_inicio as string)
  }
  if (fecha_fin) {
    sql += ' AND g.fecha <= ?'
    args.push(fecha_fin as string)
  }
  if (categoria_id) {
    sql += ' AND g.categoria_id = ?'
    args.push(parseInt(categoria_id as string, 10))
  }
  if (tarjeta_id) {
    sql += ' AND g.tarjeta_id = ?'
    args.push(parseInt(tarjeta_id as string, 10))
  }
  if (tipo_pago) {
    sql += ' AND g.tipo_pago = ?'
    args.push(tipo_pago as string)
  }

  sql += ' ORDER BY g.fecha DESC, g.creado_en DESC'

  const pageNum = Math.max(1, parseInt(page as string, 10))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))
  const offset = (pageNum - 1) * limitNum

  sql += ' LIMIT ? OFFSET ?'
  args.push(limitNum, offset)

  const result = await db.execute({ sql, args })

  // Count total
  let countSql = 'SELECT COUNT(*) as total FROM gastos WHERE 1=1'
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
  if (tarjeta_id) {
    countSql += ' AND tarjeta_id = ?'
    countArgs.push(parseInt(tarjeta_id as string, 10))
  }
  if (tipo_pago) {
    countSql += ' AND tipo_pago = ?'
    countArgs.push(tipo_pago as string)
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

// GET /api/gastos/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: `SELECT g.*, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono,
                 t.nombre as tarjeta_nombre, t.color as tarjeta_color
          FROM gastos g
          JOIN categorias c ON g.categoria_id = c.id
          LEFT JOIN tarjetas t ON g.tarjeta_id = t.id
          WHERE g.id = ?`,
    args: [id],
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Gasto no encontrado')
  }

  res.json(result.rows[0])
}))

// POST /api/gastos
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data = gastoSchema.parse(req.body)

  const catResult = await db.execute({
    sql: 'SELECT id FROM categorias WHERE id = ? AND tipo IN (?, ?)',
    args: [data.categoria_id, 'gasto', 'ambos'],
  })

  if (catResult.rows.length === 0) {
    throw new AppError(400, 'Categoría inválida para gastos')
  }

  if (data.tarjeta_id !== null && data.tarjeta_id !== undefined) {
    const cardResult = await db.execute({
      sql: 'SELECT id FROM tarjetas WHERE id = ? AND activa = 1',
      args: [data.tarjeta_id],
    })

    if (cardResult.rows.length === 0) {
      throw new AppError(400, 'Tarjeta no encontrada o inactiva')
    }

    if (data.tipo_pago !== 'credito') {
      throw new AppError(400, 'Si se especifica tarjeta, el tipo de pago debe ser "credito"')
    }
  } else if (data.tipo_pago === 'credito') {
    throw new AppError(400, 'Tipo de pago "credito" requiere tarjeta_id')
  }

  const result = await db.execute({
    sql: `INSERT INTO gastos (fecha, monto, descripcion, categoria_id, tarjeta_id, tipo_pago)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [data.fecha, data.monto, data.descripcion, data.categoria_id, data.tarjeta_id ?? null, data.tipo_pago],
  })

  if (data.tarjeta_id && data.tipo_pago === 'credito') {
    await db.execute({
      sql: 'UPDATE tarjetas SET saldo_actual = saldo_actual + ? WHERE id = ?',
      args: [data.monto, data.tarjeta_id],
    })
  }

  res.status(201).json(result.rows[0])
}))

// PUT /api/gastos/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const data = gastoUpdateSchema.parse(req.body)

  const currentResult = await db.execute({
    sql: 'SELECT tarjeta_id, tipo_pago, monto FROM gastos WHERE id = ?',
    args: [id],
  })

  if (currentResult.rows.length === 0) {
    throw new AppError(404, 'Gasto no encontrado')
  }

  const current = currentResult.rows[0] as unknown as GastoRow

  if (data.categoria_id !== undefined) {
    const catResult = await db.execute({
      sql: 'SELECT id FROM categorias WHERE id = ? AND tipo IN (?, ?)',
      args: [data.categoria_id, 'gasto', 'ambos'],
    })

    if (catResult.rows.length === 0) {
      throw new AppError(400, 'Categoría inválida para gastos')
    }
  }

  if (data.tarjeta_id !== undefined && data.tarjeta_id !== null) {
    const cardResult = await db.execute({
      sql: 'SELECT id FROM tarjetas WHERE id = ? AND activa = 1',
      args: [data.tarjeta_id],
    })

    if (cardResult.rows.length === 0) {
      throw new AppError(400, 'Tarjeta no encontrada o inactiva')
    }
  }

  const newTarjetaId = data.tarjeta_id ?? current.tarjeta_id
  const newTipoPago = data.tipo_pago ?? current.tipo_pago

  if (newTarjetaId && newTipoPago !== 'credito') {
    throw new AppError(400, 'Si se especifica tarjeta, el tipo de pago debe ser "credito"')
  }
  if (!newTarjetaId && newTipoPago === 'credito') {
    throw new AppError(400, 'Tipo de pago "credito" requiere tarjeta_id')
  }

  const fields: string[] = []
  const args: (string | number | null)[] = []

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
  if (data.tarjeta_id !== undefined) {
    fields.push('tarjeta_id = ?')
    args.push(data.tarjeta_id)
  }
  if (data.tipo_pago !== undefined) {
    fields.push('tipo_pago = ?')
    args.push(data.tipo_pago)
  }

  if (fields.length === 0) {
    throw new AppError(400, 'No hay datos para actualizar')
  }

  args.push(id)

  const newMonto = data.monto ?? current.monto
  const newTarjetaIdFinal = data.tarjeta_id ?? current.tarjeta_id
  const newTipoPagoFinal = data.tipo_pago ?? current.tipo_pago

  await db.execute('BEGIN TRANSACTION')

  try {
    if (current.tarjeta_id && current.tipo_pago === 'credito') {
      await db.execute({
        sql: 'UPDATE tarjetas SET saldo_actual = saldo_actual - ? WHERE id = ?',
        args: [current.monto, current.tarjeta_id],
      })
    }

    const result = await db.execute({
      sql: `UPDATE gastos SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
      args,
    })

    if (result.rows.length === 0) {
      throw new AppError(404, 'Gasto no encontrado')
    }

    if (newTarjetaIdFinal && newTipoPagoFinal === 'credito') {
      await db.execute({
        sql: 'UPDATE tarjetas SET saldo_actual = saldo_actual + ? WHERE id = ?',
        args: [newMonto, newTarjetaIdFinal],
      })
    }

    await db.execute('COMMIT')
    res.json(result.rows[0])
  } catch (error) {
    await db.execute('ROLLBACK')
    throw error
  }
}))

// DELETE /api/gastos/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const currentResult = await db.execute({
    sql: 'SELECT tarjeta_id, tipo_pago, monto FROM gastos WHERE id = ?',
    args: [id],
  })

  if (currentResult.rows.length === 0) {
    throw new AppError(404, 'Gasto no encontrado')
  }

  const current = currentResult.rows[0] as unknown as GastoRow

  await db.execute('BEGIN TRANSACTION')

  try {
    if (current.tarjeta_id && current.tipo_pago === 'credito') {
      await db.execute({
        sql: 'UPDATE tarjetas SET saldo_actual = saldo_actual - ? WHERE id = ?',
        args: [current.monto, current.tarjeta_id],
      })
    }

    const result = await db.execute({
      sql: 'DELETE FROM gastos WHERE id = ?',
      args: [id],
    })

    if (result.rowsAffected === 0) {
      throw new AppError(404, 'Gasto no encontrado')
    }

    await db.execute('COMMIT')
    res.status(204).send()
  } catch (error) {
    await db.execute('ROLLBACK')
    throw error
  }
}))

export const gastosRoutes = router