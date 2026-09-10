import { db } from './connection.js'

const categoriasIniciales = [
  // Ingresos
  { nombre: 'Nómina', tipo: 'ingreso', color: '#10b981', icono: 'briefcase' },
  { nombre: 'Freelance', tipo: 'ingreso', color: '#059669', icono: 'laptop' },
  { nombre: 'Inversiones', tipo: 'ingreso', color: '#047857', icono: 'trending-up' },
  { nombre: 'Regalos', tipo: 'ingreso', color: '#065f46', icono: 'gift' },
  { nombre: 'Otros Ingresos', tipo: 'ingreso', color: '#064e3b', icono: 'plus-circle' },

  // Gastos
  { nombre: 'Comida', tipo: 'gasto', color: '#ef4444', icono: 'utensils' },
  { nombre: 'Transporte', tipo: 'gasto', color: '#dc2626', icono: 'bus' },
  { nombre: 'Educación', tipo: 'gasto', color: '#b91c1c', icono: 'graduation-cap' },
  { nombre: 'Entretenimiento', tipo: 'gasto', color: '#991b1b', icono: 'film' },
  { nombre: 'Salud', tipo: 'gasto', color: '#7f1d1d', icono: 'heart-pulse' },
  { nombre: 'Servicios', tipo: 'gasto', color: '#f59e0b', icono: 'zap' },
  { nombre: 'Compras', tipo: 'gasto', color: '#d97706', icono: 'shopping-bag' },
  { nombre: 'Suscripciones', tipo: 'gasto', color: '#b45309', icono: 'credit-card' },
  { nombre: 'Vivienda', tipo: 'gasto', color: '#92400e', icono: 'home' },
  { nombre: 'Otros Gastos', tipo: 'gasto', color: '#78350f', icono: 'more-horizontal' },

  // Ambos
  { nombre: 'Transferencias', tipo: 'ambos', color: '#6366f1', icono: 'arrow-left-right' },
]

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Seeding database...')

  // Check if already seeded
  const existing = await db.execute('SELECT COUNT(*) as count FROM categorias')
  if (Number(existing.rows[0]?.count || 0) > 0) {
    console.log('  ℹ️  Database already seeded, skipping')
    return
  }

  for (const cat of categoriasIniciales) {
    await db.execute({
      sql: 'INSERT INTO categorias (nombre, tipo, color, icono) VALUES (?, ?, ?, ?)',
      args: [cat.nombre, cat.tipo, cat.color, cat.icono],
    })
  }

  console.log(`  ✓ Inserted ${categoriasIniciales.length} categories`)
  console.log('✅ Seeding completed')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDatabase()
  process.exit(0)
}

