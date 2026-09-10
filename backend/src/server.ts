import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'
import { dashboardRoutes } from './routes/dashboard.js'
import { categoriasRoutes } from './routes/categorias.js'
import { ingresosRoutes } from './routes/ingresos.js'
import { gastosRoutes } from './routes/gastos.js'
import { tarjetasRoutes } from './routes/tarjetas.js'
import { pagosRoutes } from './routes/pagos.js'

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Stricter rate limit for API mutations (POST, PUT, DELETE, PATCH)
const mutationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Demasiadas solicitudes de modificación, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return mutationLimiter(req, res, next)
  }
  next()
})

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Request logging
app.use(requestLogger)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/categorias', categoriasRoutes)
app.use('/api/ingresos', ingresosRoutes)
app.use('/api/gastos', gastosRoutes)
app.use('/api/tarjetas', tarjetasRoutes)
app.use('/api/tarjetas', pagosRoutes) // pagos are nested under tarjetas

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

// Error handler (must be last)
app.use(errorHandler)

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${env.NODE_ENV}`)
})

export default app

