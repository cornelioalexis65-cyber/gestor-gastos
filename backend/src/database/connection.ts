import { createClient } from '@libsql/client'
import { env } from '../config/env.js'

export const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
})

export async function testConnection(): Promise<boolean> {
  try {
    await db.execute('SELECT 1')
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export async function closeConnection(): Promise<void> {
  await db.close()
  console.log('🔌 Database connection closed')
}

