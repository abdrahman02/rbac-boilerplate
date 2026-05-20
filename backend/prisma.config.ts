import 'dotenv/config'
import { defineConfig } from 'prisma/config'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export default defineConfig({
  datasource: {
    url: `mysql://${requireEnv('DB_USER')}:${encodeURIComponent(requireEnv('DB_PASSWORD'))}@${requireEnv('DB_HOST')}:${requireEnv('DB_PORT')}/${requireEnv('DB_NAME')}`,
  },
})
