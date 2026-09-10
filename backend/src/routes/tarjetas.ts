import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../database/connection.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const router = Router()

const tarjetaSchema = z.object({
  nombre: z.string().min(1).max(100),
  limite_credito: z.number().positive(),
  dia_corte: z.number().int().min(1).max(31),
  dia_pago: z.number().int().min(1).max(31),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

const tarjetaUpdateSchema = tarjetaSchema.partial()

// GET /api/tarjetas
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const result = await db.execute(`
    SELECT *,
           (limite_credito - saldo_actual) as disponible
    FROM tarjetas
    WHERE activa = 1
    ORDER BY nombre
  `)
  res.json(result.rows)
}))

// GET /api/tarjetas/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: `SELECT *,
                 (limite_credito - saldo_actual) as disponible
          FROM tarjetas WHERE id = ?`,
    args: [id],
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Tarjeta no encontrada')
  }

  res.json(result.rows[0])
}))

// POST /api/tarjetas
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data = tarjetaSchema.parse(req.body)

  const result = await db.execute({
    sql: `INSERT INTO tarjetas (nombre, limite_credito, dia_corte, dia_pago, color, saldo_actual)
          VALUES (?, ?, ?, ?, ?, 0)
          RETURNING *`,
    args: [data.nombre, data.limite_credito, data.dia_corte, data.dia_pago, data.color ?? '#3b82f6'],
  })

  const tarjeta = result.rows[0]
  res.status(201).json({
    ...tarjeta,
    disponible: data.limite_credito,
  })
}))

// PUT /api/tarjetas/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const data = tarjetaUpdateSchema.parse(req.body)

  const fields: string[] = []
  const args: (string | number)[] = []

  if (data.nombre !== undefined) {
    fields.push('nombre = ?')
    args.push(data.nombre)
  }
  if (data.limite_credito !== undefined) {
    fields.push('limite_credito = ?')
    args.push(data.limite_credito)
  }
  if (data.dia_corte !== undefined) {
    fields.push('dia_corte = ?')
    args.push(data.dia_corte)
  }
  if (data.dia_pago !== undefined) {
    fields.push('dia_pago = ?')
    args.push(data.dia_pago)
  }
  if (data.color !== undefined) {
    fields.push('color = ?')
    args.push(data.color)
  }

  if (fields.length === 0) {
    throw new AppError(400, 'No hay datos para actualizar')
  }

  args.push(id)

  const result = await db.execute({
    sql: `UPDATE tarjetas SET ${fields.join(', ')} WHERE id = ? AND activa = 1 RETURNING *`,
    args,
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Tarjeta no encontrada')
  }

  const tarjeta = result.rows[0]
  res.json({
    ...tarjeta,
    disponible: Number(tarjeta.limite_credito) - Number(tarjeta.saldo_actual),
  })
}))

// DELETE /api/tarjetas/:id (soft delete)
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: 'UPDATE tarjetas SET activa = 0 WHERE id = ?',
    args: [id],
  })

  if (result.rowsAffected === 0) {
    throw new AppError(404, 'Tarjeta no encontrada')
  }

  res.status(204).send()
}))

export const tarjetasRoutes = router