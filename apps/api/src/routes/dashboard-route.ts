import { Router } from 'express'
import { authMiddleware } from '@/middlewares/auth-middleware'
import {
  getDashboardMetrics,
  getResponseTimeData,
  getAllMonitorUptimeStats,
} from '@/utils/aggregation'

const router = Router()

// Apply auth middleware to all dashboard routes
router.use('/dashboard', authMiddleware)

/**
 * GET /api/v1/dashboard/metrics
 * Get overview metrics for the dashboard
 */
router.get('/dashboard/metrics', async (req, res) => {
  try {
    const userId = req.user!.id
    const metrics = await getDashboardMetrics(userId)

    res.status(200).json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    throw error
  }
})

/**
 * GET /api/v1/dashboard/response-times
 * Get response time data for charts
 * Query params:
 *   - period: day | week | month (or 24h | 7d | 30d) (default: 24h)
 *   - monitorIds: comma-separated list of monitor IDs
 */
router.get('/dashboard/response-times', async (req, res) => {
  try {
    const userId = req.user!.id
    const periodParam = (req.query.period as string) || '24h'

    // Map frontend period format to backend format
    const periodMap: Record<string, '24h' | '7d' | '30d'> = {
      'day': '24h',
      'week': '7d',
      'month': '30d',
      '24h': '24h',
      '7d': '7d',
      '30d': '30d',
    }

    const period = periodMap[periodParam] || '24h'
    const monitorIdsParam = req.query.monitorIds as string | undefined
    const monitorIds = monitorIdsParam ? monitorIdsParam.split(',') : undefined

    const data = await getResponseTimeData(userId, monitorIds, period)

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    throw error
  }
})

/**
 * GET /api/v1/dashboard/uptime-stats
 * Get uptime statistics for all monitors
 */
router.get('/dashboard/uptime-stats', async (req, res) => {
  try {
    const userId = req.user!.id
    const stats = await getAllMonitorUptimeStats(userId)

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    throw error
  }
})

export { router as dashboardRouter }
