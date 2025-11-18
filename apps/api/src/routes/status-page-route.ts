import { prisma, PrismaClientKnownRequestError } from '@dpin-uptime/store'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { Router } from 'express'

const router = Router()

router.use('/status-pages', authMiddleware)

// Get all status pages for the authenticated user
router.get('/status-pages', async (req, res) => {
  try {
    const statusPages = await prisma.statusPage.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        monitors: {
          include: {
            monitor: true,
          },
        },
      },
    })

    // Transform the response to match the frontend expected format
    const transformedPages = statusPages.map((page) => ({
      id: page.id,
      companyName: page.companyName,
      subdomain: page.subdomain,
      logoUrl: page.logoUrl,
      theme: page.theme,
      monitors: page.monitors.map((m) => m.monitorId),
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    }))

    res.status(200).json({ data: transformedPages, success: true })
  } catch (error) {
    throw error
  }
})

// Get a single status page by ID
router.get('/status-pages/:id', async (req, res) => {
  try {
    const { id } = req.params

    const statusPage = await prisma.statusPage.findUnique({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        monitors: {
          include: {
            monitor: true,
          },
        },
      },
    })

    if (!statusPage) {
      res.status(404).json({ success: false, message: 'Status page not found' })
      return
    }

    // Transform the response
    const transformedPage = {
      id: statusPage.id,
      companyName: statusPage.companyName,
      subdomain: statusPage.subdomain,
      logoUrl: statusPage.logoUrl,
      theme: statusPage.theme,
      monitors: statusPage.monitors.map((m) => m.monitorId),
      createdAt: statusPage.createdAt.toISOString(),
      updatedAt: statusPage.updatedAt.toISOString(),
    }

    res.status(200).json({ data: transformedPage, success: true })
  } catch (error) {
    throw error
  }
})

// Create a new status page
router.post('/status-pages', async (req, res) => {
  try {
    const { companyName, subdomain, logoUrl, theme, monitors } = req.body

    // Create the status page with associated monitors
    const statusPage = await prisma.statusPage.create({
      data: {
        companyName,
        subdomain,
        logoUrl,
        theme: theme || 'light',
        userId: req.user!.id,
        monitors: {
          create:
            monitors?.map((monitorId: string) => ({
              monitorId,
            })) || [],
        },
      },
      include: {
        monitors: true,
      },
    })

    const transformedPage = {
      id: statusPage.id,
      companyName: statusPage.companyName,
      subdomain: statusPage.subdomain,
      logoUrl: statusPage.logoUrl,
      theme: statusPage.theme,
      monitors: statusPage.monitors.map((m) => m.monitorId),
      createdAt: statusPage.createdAt.toISOString(),
      updatedAt: statusPage.updatedAt.toISOString(),
    }

    res.status(201).json({
      data: transformedPage,
      success: true,
      message: 'Status page created successfully',
    })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'A status page with this subdomain already exists',
        })
        return
      }
    }
    throw error
  }
})

// Update a status page
router.patch('/status-pages/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { companyName, subdomain, logoUrl, theme, monitors } = req.body

    // First, verify the status page belongs to the user
    const existingPage = await prisma.statusPage.findUnique({
      where: { id, userId: req.user!.id },
    })

    if (!existingPage) {
      res.status(404).json({ success: false, message: 'Status page not found' })
      return
    }

    // Update the status page
    const statusPage = await prisma.statusPage.update({
      where: { id },
      data: {
        companyName,
        subdomain,
        logoUrl,
        theme,
        // If monitors are provided, replace all existing ones
        ...(monitors && {
          monitors: {
            deleteMany: {},
            create: monitors.map((monitorId: string) => ({
              monitorId,
            })),
          },
        }),
      },
      include: {
        monitors: true,
      },
    })

    const transformedPage = {
      id: statusPage.id,
      companyName: statusPage.companyName,
      subdomain: statusPage.subdomain,
      logoUrl: statusPage.logoUrl,
      theme: statusPage.theme,
      monitors: statusPage.monitors.map((m) => m.monitorId),
      createdAt: statusPage.createdAt.toISOString(),
      updatedAt: statusPage.updatedAt.toISOString(),
    }

    res.status(200).json({
      data: transformedPage,
      success: true,
      message: 'Status page updated successfully',
    })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'A status page with this subdomain already exists',
        })
        return
      }
    }
    throw error
  }
})

// Delete a status page
router.delete('/status-pages/:id', async (req, res) => {
  try {
    const { id } = req.params

    // First, verify the status page belongs to the user
    const existingPage = await prisma.statusPage.findUnique({
      where: { id, userId: req.user!.id },
    })

    if (!existingPage) {
      res.status(404).json({ success: false, message: 'Status page not found' })
      return
    }

    // Delete the status page (cascade will handle the monitors relationship)
    await prisma.statusPage.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      message: 'Status page deleted successfully',
    })
  } catch (error) {
    throw error
  }
})

export { router as statusPageRouter }
