import mysql from 'mysql2/promise'
import { env } from './env.js'

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
})

export async function testConnection(): Promise<void> {
  const connection = await pool.getConnection()
  connection.release()
}
