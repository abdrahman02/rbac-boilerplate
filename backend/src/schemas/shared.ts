import { z } from 'zod'

export const emailField = z.email().toLowerCase()
