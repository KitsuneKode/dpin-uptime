import type { InferUser } from '@dpin-uptime/auth/server'

declare global {
  namespace Express {
    interface Request {
      user?: InferUser
    }
  }
}

export {}
