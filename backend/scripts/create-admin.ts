import { createInterface } from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { hashPassword } from '../src/utils/hash.js'
import { env } from '../src/config/env.js'

const envPath = resolve(process.cwd(), 'backend/.env')
config({ path: envPath })

const adapter = new PrismaMariaDb({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  allowPublicKeyRetrieval: true,
})

const prisma = new PrismaClient({ adapter })
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

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      console.error('❌ User with this email already exists')
      await prisma.$disconnect()
      process.exit(1)
    }

    // Get admin role
    const adminRole = await prisma.role.findFirst({
      where: { name: 'admin' },
    })

    if (!adminRole) {
      console.error('❌ Admin role not found in database')
      await prisma.$disconnect()
      process.exit(1)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user and assign role in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          fullName: name,
          passwordHash,
          isActive: true,
        },
        select: { id: true, email: true, fullName: true },
      })

      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: adminRole.id,
        },
      })

      return newUser
    })

    await prisma.$disconnect()

    console.log(`\n✅ Admin user created successfully!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.fullName}`)
    console.log(`   Role: admin\n`)
  } catch (error) {
    await prisma.$disconnect()
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('❌ Database error:', error.message)
    } else {
      console.error('❌ Error:', error instanceof Error ? error.message : error)
    }
    rl.close()
    process.exit(1)
  }
}

main()
