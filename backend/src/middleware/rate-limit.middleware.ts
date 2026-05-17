import rateLimit from 'express-rate-limit'
import type { ApiResponse } from '../types/index.js'

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many requests, please try again in 15 minutes',
  } satisfies ApiResponse<null>,
})
