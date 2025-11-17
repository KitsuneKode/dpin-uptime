import { Router } from 'express'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { prisma } from '@dpin-uptime/store'

const router = Router()

// Apply auth middleware to all incident routes
router.use('/incidents', authMiddleware)

/**
 * GET /api/v1/incidents
 * Get all incidents for the authenticated user
 * Query params:
 *   - status: OPEN | ACKNOWLEDGED | RESOLVED (optional)
 *   - monitorId: filter by specific monitor (optional)
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 20)
 */
router.get('/incidents', async (req, res) => {
  try {
    const userId = req.user!.id
    const status = req.query.status as string | undefined
    const monitorId = req.query.monitorId as string | undefined
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      monitor: {
        userId,
        archived: false,
      },
    }

    if (status) {
      whereClause.status = status
    }

    if (monitorId) {
      whereClause.monitorId = monitorId
    }

    // Get incidents with monitor details
    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where: whereClause,
        include: {
          monitor: {
            select: {
              id: true,
              url: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.incident.count({ where: whereClause }),
    ])

    res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    throw error
  }
})

/**
 * GET /api/v1/incidents/:id
 * Get a single incident by ID
 */
router.get('/incidents/:id', async (req, res) => {
  try {
    const userId = req.user!.id
    const incidentId = req.params.id

    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId,
        },
      },
      include: {
        monitor: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
      },
    })

    if (!incident) {
      res.status(404).json({
        success: false,
        message: 'Incident not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: incident,
    })
  } catch (error) {
    throw error
  }
})

/**
 * PATCH /api/v1/incidents/:id/acknowledge
 * Acknowledge an incident
 */
router.patch('/incidents/:id/acknowledge', async (req, res) => {
  try {
    const userId = req.user!.id
    const incidentId = req.params.id

    // Verify ownership
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId,
        },
      },
    })

    if (!incident) {
      res.status(404).json({
        success: false,
        message: 'Incident not found',
      })
      return
    }

    // Update status
    const updated = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: 'ACKNOWLEDGED',
      },
    })

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Incident acknowledged',
    })
  } catch (error) {
    throw error
  }
})

/**
 * PATCH /api/v1/incidents/:id/resolve
 * Manually resolve an incident
 */
router.patch('/incidents/:id/resolve', async (req, res) => {
  try {
    const userId = req.user!.id
    const incidentId = req.params.id

    // Verify ownership
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId,
        },
      },
    })

    if (!incident) {
      res.status(404).json({
        success: false,
        message: 'Incident not found',
      })
      return
    }

    // Update status
    const updated = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    })

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Incident resolved',
    })
  } catch (error) {
    throw error
  }
})

export { router as incidentRouter }
