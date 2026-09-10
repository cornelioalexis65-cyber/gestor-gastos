import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../database/connection.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const router = Router()

const categoriaSchema = z.object({
  nombre: z.string().min(1).max(100),
  tipo: z.enum(['ingreso', 'gasto', 'ambos']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icono: z.string().max(50).optional(),
})

const categoriaUpdateSchema = categoriaSchema.partial()

// GET /api/categorias
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const result = await db.execute('SELECT * FROM categorias ORDER BY nombre')
  res.json(result.rows)
}))

// GET /api/categorias/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: 'SELECT * FROM categorias WHERE id = ?',
    args: [id],
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Categoría no encontrada')
  }

  res.json(result.rows[0])
}))

// POST /api/categorias
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data = categoriaSchema.parse(req.body)

  const result = await db.execute({
    sql: `INSERT INTO categorias (nombre, tipo, color, icono) VALUES (?, ?, ?, ?)
          RETURNING *`,
    args: [data.nombre, data.tipo, data.color ?? '#6366f1', data.icono ?? 'folder'],
  })

  res.status(201).json(result.rows[0])
}))

// PUT /api/categorias/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const data = categoriaUpdateSchema.parse(req.body)

  const fields: string[] = []
  const args: (string | number)[] = []

  if (data.nombre !== undefined) {
    fields.push('nombre = ?')
    args.push(data.nombre)
  }
  if (data.tipo !== undefined) {
    fields.push('tipo = ?')
    args.push(data.tipo)
  }
  if (data.color !== undefined) {
    fields.push('color = ?')
    args.push(data.color)
  }
  if (data.icono !== undefined) {
    fields.push('icono = ?')
    args.push(data.icono)
  }

  if (fields.length === 0) {
    throw new AppError(400, 'No hay datos para actualizar')
  }

  args.push(id)

  const result = await db.execute({
    sql: `UPDATE categorias SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
    args,
  })

  if (result.rows.length === 0) {
    throw new AppError(404, 'Categoría no encontrada')
  }

  res.json(result.rows[0])
}))

// DELETE /api/categorias/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) throw new AppError(400, 'ID inválido')

  const result = await db.execute({
    sql: 'DELETE FROM categorias WHERE id = ?',
    args: [id],
  })

  if (result.rowsAffected === 0) {
    throw new AppError(404, 'Categoría no encontrada')
  }

  res.status(204).send()
}))

export const categoriasRoutes = router