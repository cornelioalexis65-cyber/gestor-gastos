import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../database/connection.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const router = Router()

const pagoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  monto: z.number().positive(),
  descripcion: z.string().max(200).optional(),
})

// GET /api/tarjetas/:id/pagos
router.get('/:tarjetaId/pagos', asyncHandler(async (req: Request, res: Response) => {
  const tarjetaId = parseInt(req.params.tarjetaId, 10)
  if (isNaN(tarjetaId)) throw new AppError(400, 'ID de tarjeta inválido')

  const { page = '1', limit = '50' } = req.query

  const cardResult = await db.execute({
    sql: 'SELECT id FROM tarjetas WHERE id = ?',
    args: [tarjetaId],
  })

  if (cardResult.rows.length === 0) {
    throw new AppError(404, 'Tarjeta no encontrada')
  }

  const pageNum = Math.max(1, parseInt(page as string, 10))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))
  const offset = (pageNum - 1) * limitNum

  const result = await db.execute({
    sql: `SELECT * FROM pagos_tarjeta
          WHERE tarjeta_id = ?
          ORDER BY fecha DESC, creado_en DESC
          LIMIT ? OFFSET ?`,
    args: [tarjetaId, limitNum, offset],
  })

  const countResult = await db.execute({
    sql: 'SELECT COUNT(*) as total FROM pagos_tarjeta WHERE tarjeta_id = ?',
    args: [tarjetaId],
  })
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

// POST /api/tarjetas/:id/pagos
router.post('/:tarjetaId/pagos', asyncHandler(async (req: Request, res: Response) => {
  const tarjetaId = parseInt(req.params.tarjetaId, 10)
  if (isNaN(tarjetaId)) throw new AppError(400, 'ID de tarjeta inválido')

  const data = pagoSchema.parse(req.body)

  const cardResult = await db.execute({
    sql: 'SELECT id, saldo_actual FROM tarjetas WHERE id = ? AND activa = 1',
    args: [tarjetaId],
  })

  if (cardResult.rows.length === 0) {
    throw new AppError(404, 'Tarjeta no encontrada o inactiva')
  }

  const currentSaldo = Number(cardResult.rows[0].saldo_actual)
  const montoPago = data.monto

  if (montoPago > currentSaldo) {
    throw new AppError(400, `El pago (${montoPago}) no puede ser mayor al saldo actual (${currentSaldo})`)
  }

  await db.execute('BEGIN TRANSACTION')

  try {
    const pagoResult = await db.execute({
      sql: `INSERT INTO pagos_tarjeta (tarjeta_id, fecha, monto, descripcion)
            VALUES (?, ?, ?, ?)
            RETURNING *`,
      args: [tarjetaId, data.fecha, data.monto, data.descripcion ?? null],
    })

    await db.execute({
      sql: 'UPDATE tarjetas SET saldo_actual = saldo_actual - ? WHERE id = ?',
      args: [montoPago, tarjetaId],
    })

    await db.execute('COMMIT')
    res.status(201).json(pagoResult.rows[0])
  } catch (error) {
    await db.execute('ROLLBACK')
    throw error
  }
}))

export const pagosRoutes = router