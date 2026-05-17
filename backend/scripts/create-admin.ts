import { createConnection } from 'mysql2/promise'
import { createInterface } from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { hashPassword } from '../src/utils/hash.js'

const envPath = resolve(process.cwd(), '.env')
config({ path: envPath })

const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

if (!db.host || !db.user || !db.database) {
  console.error('❌ Database credentials not configured in .env')
  process.exit(1)
}

const rl = createInterface({ input, output })

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  try {
    console.log('\n📝 Create Admin User\n')

    const email = await prompt('Email: ')
    if (!email.includes('@')) {
      console.error('❌ Invalid email format')
      rl.close()
      process.exit(1)
    }

    const password = await prompt('Password: ')
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters')
      rl.close()
      process.exit(1)
    }

    const name = await prompt('Full Name: ')
    if (!name.trim()) {
      console.error('❌ Name cannot be empty')
      rl.close()
      process.exit(1)
    }

    rl.close()

    console.log('\n⏳ Creating admin user...')

    const conn = await createConnection(db)

    // Check if user already exists
    const [existingUser] = await conn.execute(
      'SELECT id FROM users WHERE email = ?',
      [email],
    )

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      console.error('❌ User with this email already exists')
      await conn.end()
      process.exit(1)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const [result] = await conn.execute(
      'INSERT INTO users (email, full_name, password_hash, is_active, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, name, passwordHash, true],
    )

    const userId = (result as any).insertId

    // Get admin role ID
    const [roles] = await conn.execute(
      'SELECT id FROM roles WHERE name = ?',
      ['admin'],
    )

    if (!Array.isArray(roles) || roles.length === 0) {
      console.error('❌ Admin role not found in database')
      await conn.end()
      process.exit(1)
    }

    const adminRoleId = (roles[0] as any).id

    // Assign admin role
    await conn.execute(
      'INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, NOW())',
      [userId, adminRoleId],
    )

    await conn.end()

    console.log(`\n✅ Admin user created successfully!`)
    console.log(`   Email: ${email}`)
    console.log(`   Name: ${name}`)
    console.log(`   Role: admin\n`)
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    rl.close()
    process.exit(1)
  }
}

main()
