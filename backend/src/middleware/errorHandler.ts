import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.js'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Error:', err)

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    res.status(400).json({
      error: 'Error de validación',
      code: 'VALIDATION_ERROR',
      details: errors,
    })
    return
  }

  // AppError (custom)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    })
    return
  }

  // Database errors
  if (err.message.includes('UNIQUE constraint failed')) {
    res.status(409).json({
      error: 'El registro ya existe',
      code: 'DUPLICATE_ENTRY',
    })
    return
  }

  if (err.message.includes('FOREIGN KEY constraint failed')) {
    res.status(400).json({
      error: 'Referencia inválida',
      code: 'INVALID_REFERENCE',
    })
    return
  }

  if (err.message.includes('CHECK constraint failed')) {
    res.status(400).json({
      error: 'Datos inválidos',
      code: 'CONSTRAINT_VIOLATION',
    })
    return
  }

  // Default: internal server error
  const message = env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message

  res.status(500).json({
    error: message,
    code: 'INTERNAL_ERROR',
  })
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

