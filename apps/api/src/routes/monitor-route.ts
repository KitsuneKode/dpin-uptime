import { prisma, PrismaClientKnownRequestError } from '@dpin-uptime/store'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { Router } from 'express'

const router = Router()

router.use('/monitor', authMiddleware)

// Helper function to transform database monitor to API Monitor format
function transformMonitor(dbMonitor: any) {
  // Get the latest tick for status and response time
  const latestTick = dbMonitor.websiteTicks?.[0]
  const ticks = dbMonitor.websiteTicks || []

  // Calculate uptime percentage from recent ticks
  const goodTicks = ticks.filter((t: any) => t.status === 'Good').length
  const uptimePercentage = ticks.length > 0 ? (goodTicks / ticks.length) * 100 : 100

  // Determine status based on latest tick and archived state
  let status: 'up' | 'down' | 'degraded' | 'paused' = 'up'
  if (dbMonitor.archived) {
    status = 'paused'
  } else if (latestTick) {
    status = latestTick.status === 'Good' ? 'up' : 'down'
  } else if (uptimePercentage < 100 && uptimePercentage >= 80) {
    status = 'degraded'
  } else if (uptimePercentage < 80) {
    status = 'down'
  }

  // Convert interval from milliseconds to human-readable format
  const intervalMs = dbMonitor.interval || 30000
  let intervalStr = '30s'
  if (intervalMs < 60000) {
    intervalStr = `${intervalMs / 1000}s`
  } else if (intervalMs < 3600000) {
    intervalStr = `${intervalMs / 60000}m`
  } else {
    intervalStr = `${intervalMs / 3600000}h`
  }

  return {
    id: dbMonitor.id,
    name: dbMonitor.name || new URL(dbMonitor.url).hostname,
    url: dbMonitor.url,
    status,
    lastChecked: latestTick?.createdAt?.toISOString() || dbMonitor.updatedAt.toISOString(),
    responseTime: latestTick?.latency || 0,
    uptime: {
      current: status === 'up' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Down',
      percentage: uptimePercentage,
    },
    interval: intervalStr,
    intervalMs: intervalMs,
    timeout: dbMonitor.timeout || 10000,
    expectedStatusCodes: dbMonitor.expectedStatusCodes || [200, 201, 202, 203, 204],
    locations: dbMonitor.locations || [],
    incidents: 0, // TODO: Calculate from incidents table
    createdAt: dbMonitor.createdAt.toISOString(),
    updatedAt: dbMonitor.updatedAt.toISOString(),
  }
}

router.post('/monitor', async (req, res) => {
  try {
    const { url, name } = req.body

    const monitor = await prisma.monitor.create({
      data: {
        url,
        name,
        userId: req.user?.id!,
      },
      include: {
        websiteTicks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        },
      },
    })

    if (!monitor) {
      throw new Error('Monitor creation failed')
    }

    const transformedMonitor = transformMonitor(monitor)
    res.status(201).json({
      success: true,
      message: 'Monitor created successfully',
      ...transformedMonitor,
    })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Website entry already exists',
        })
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
      // Get all monitors for the user
      const monitors = await prisma.monitor.findMany({
        where: {
          userId: req.user!.id,
          archived: false,
        },
        include: {
          websiteTicks: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 100,
          },
        },
      })

      const transformedMonitors = monitors.map(transformMonitor)
      res.status(200).json({
        websites: transformedMonitors,
        success: true,
      })
      return
    } else {
      // Get a single monitor by ID
      const monitor = await prisma.monitor.findUnique({
        where: {
          id: websiteId,
          userId: req.user!.id,
        },
        include: {
          websiteTicks: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 100,
          },
        },
      })

      if (!monitor) {
        res.status(404).json({
          success: false,
          message: 'Monitor not found',
        })
        return
      }

      const transformedMonitor = transformMonitor(monitor)
      res.status(200).json({
        data: transformedMonitor,
        success: true,
      })
      return
    }
  } catch (error) {
    throw error
  }
})

router.patch('/monitor', async (req, res) => {
  try {
    const { id, name, url, interval, timeout, expectedStatusCodes, locations } = req.body

    // First verify the monitor belongs to the user
    const existingMonitor = await prisma.monitor.findUnique({
      where: {
        id,
        userId: req.user!.id,
      },
    })

    if (!existingMonitor) {
      res.status(404).json({
        success: false,
        message: 'Monitor not found',
      })
      return
    }

    // Build update data object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (url !== undefined) updateData.url = url
    if (interval !== undefined) updateData.interval = parseInt(interval)
    if (timeout !== undefined) updateData.timeout = parseInt(timeout)
    if (expectedStatusCodes !== undefined) updateData.expectedStatusCodes = expectedStatusCodes
    if (locations !== undefined) updateData.locations = locations

    // Update the monitor
    const monitor = await prisma.monitor.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        websiteTicks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        },
      },
    })

    const transformedMonitor = transformMonitor(monitor)
    res.status(200).json({
      data: transformedMonitor,
      success: true,
      message: 'Monitor updated successfully',
    })
  } catch (error) {
    throw error
  }
})

router.get('/monitor/:id/ticks', async (req, res) => {
  try {
    const { id } = req.params

    // Get ticks for this monitor
    const ticks = await prisma.websiteTick.findMany({
      where: {
        websiteId: id,
        website: {
          userId: req.user!.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10000, // Last 10000 ticks (should cover 90+ days)
    })

    res.status(200).json({
      data: ticks,
      success: true,
    })
  } catch (error) {
    throw error
  }
})

router.patch('/monitor/:id/pause', async (req, res) => {
  try {
    const { id } = req.params

    // Archive the monitor (pause it)
    const monitor = await prisma.monitor.update({
      where: {
        id,
        userId: req.user!.id,
      },
      data: {
        archived: true,
      },
      include: {
        websiteTicks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        },
      },
    })

    const transformedMonitor = transformMonitor(monitor)
    res.status(200).json({
      data: transformedMonitor,
      success: true,
      message: 'Monitor paused successfully',
    })
  } catch (error) {
    throw error
  }
})

router.patch('/monitor/:id/resume', async (req, res) => {
  try {
    const { id } = req.params

    // Unarchive the monitor (resume it)
    const monitor = await prisma.monitor.update({
      where: {
        id,
        userId: req.user!.id,
      },
      data: {
        archived: false,
      },
      include: {
        websiteTicks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        },
      },
    })

    const transformedMonitor = transformMonitor(monitor)
    res.status(200).json({
      data: transformedMonitor,
      success: true,
      message: 'Monitor resumed successfully',
    })
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

    res.status(200).json({
      success: true,
      message: 'Monitor deleted successfully',
    })
  } catch (error) {
    throw error
  }
})

export { router as websiteRouter }
