import { prisma, PrismaClientKnownRequestError } from '@dpin-uptime/store'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { Router } from 'express'

const router = Router()

router.use('/monitor', authMiddleware)

router.post('/monitor', async (req, res) => {
  try {
    const { url } = req.body

    const monitor = await prisma.monitor.create({
      data: {
        url,
        userId: req.user.id,
      },
    })

    if (!monitor) {
      throw new Error('Monitor creation failed')
    }

    res.status(201).send('Monitor entry successfully created')
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).send('Website entry already exists')
        return
      }
    }
    throw error
  }
})

router.get('/monitor/status', async (req, res) => {
  try {
    const websiteId = req.query['id']! as string
    const ticks = await prisma.monitor.findMany({
      where: {
        id: websiteId,
        archived: false,
        userId: req.user!.id,
      },
      select: {
        url: true,
        websiteTicks: true,
      },
    })

    res.status(200).json({ ticks })
  } catch (error) {
    throw error
  }
})

router.get('/monitor', async (req, res) => {
  try {
    const websiteId = req.query['id'] as string

    if (!websiteId) {
      const websites = await prisma.monitor.findMany({
        where: {
          userId: req.user!.id,
          archived: false,
        },
      })

      res.status(200).json({ websites })
      return
    } else {
      const monitor = await prisma.monitor.findUnique({
        where: {
          id: websiteId,
          userId: req.user!.id,
        },
      })
    }
  } catch (error) {
    throw error
  }
})

router.delete('/monitor', async (req, res) => {
  try {
    const { websiteId } = req.body

    const monitor = await prisma.monitor.update({
      where: {
        id: websiteId,
        archived: false,
        userId: req.user!.id,
      },
      data: {
        archived: true,
      },
    })

    if (!monitor) {
      throw new Error('Failed to delete monitor')
    }

    res.status(200).send('Website delete successfully')
  } catch (error) {
    throw error
  }
})

export { router as websiteRouter }
