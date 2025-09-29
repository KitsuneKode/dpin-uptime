import { auth, fromNodeHeaders } from '@dpin-uptime/auth/server'
import type { NextFunction, Request, Response } from 'express'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session || !session.user) {
      res.status(401).send('Not Authenticated')
      return
    }

    req.user = session.user

    next()
  } catch (err) {
    next(err)
  }
}
