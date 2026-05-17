import express, { type Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { setupSwagger } from './config/swagger.js'

export function createApp(): Application {
  const app = express()

  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }))

  app.use(express.json({ limit: '10kb' }))
  app.use(cookieParser())

  setupSwagger(app)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  return app
}
