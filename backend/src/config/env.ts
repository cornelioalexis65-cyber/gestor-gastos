import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  PORT: number
  NODE_ENV: string
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
  CORS_ORIGIN: string
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env: EnvConfig = {
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  TURSO_DATABASE_URL: getEnv('TURSO_DATABASE_URL'),
  TURSO_AUTH_TOKEN: getEnv('TURSO_AUTH_TOKEN'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
}

export function validateEnv(): void {
  const required = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach((key) => console.error(`  - ${key}`))
    console.error('\nCopy .env.example to .env and fill in your values')
    process.exit(1)
  }
}

