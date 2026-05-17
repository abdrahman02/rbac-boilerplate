import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import type { Application } from 'express'
import { env } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RBAC Boilerplate API',
      version: '1.0.0',
      description: 'Role-Based Access Control API — Phase 1',
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { nullable: true },
            message: { type: 'string', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            data: { nullable: true, example: null },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication — register, login, logout, refresh, me' },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

export function setupSwagger(app: Application): void {
  if (env.NODE_ENV === 'production') return

  const spec = swaggerJsdoc(options)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec, {
    customSiteTitle: 'RBAC API Docs',
  }))
  console.log(`  Swagger docs: http://localhost:${env.PORT}/api/docs`)
}
