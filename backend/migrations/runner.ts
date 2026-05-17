import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') })
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT'] ?? 3306),
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  multipleStatements: true,
})

async function ensureMigrationsTable(conn: mysql.PoolConnection): Promise<void> {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

async function getExecutedMigrations(conn: mysql.PoolConnection): Promise<Set<string>> {
  const [rows] = await conn.execute<mysql.RowDataPacket[]>(
    'SELECT name FROM _migrations ORDER BY id',
  )
  return new Set(rows.map((r) => r['name'] as string))
}

async function run(): Promise<void> {
  const conn = await pool.getConnection()

  try {
    await ensureMigrationsTable(conn)
    const executed = await getExecutedMigrations(conn)

    const sqlDir = path.join(import.meta.dirname, 'sql')
    const files = fs.readdirSync(sqlDir).filter((f) => f.endsWith('.sql')).sort()

    let applied = 0
    for (const file of files) {
      if (executed.has(file)) continue

      const sql = fs.readFileSync(path.join(sqlDir, file), 'utf-8')
      await conn.query(sql)
      await conn.execute('INSERT INTO _migrations (name) VALUES (?)', [file])

      console.log(`  ✓ Applied: ${file}`)
      applied++
    }

    console.log(`\n${applied} migration(s) applied.`)
  } finally {
    conn.release()
    await pool.end()
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
