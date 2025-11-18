import type { WebsiteTick, WebsiteStatus } from '@dpin-uptime/store/generated'
import { prisma } from '@dpin-uptime/store'

interface UptimeStats {
  monitorId: string
  url: string
  name: string | null
  uptime24h: number
  uptime7d: number
  uptime30d: number
  avgResponseTime: number
  status: WebsiteStatus
  lastChecked: Date | null
}

interface DashboardMetrics {
  totalMonitors: number
  activeMonitors: number
  overallUptime: number
  openIncidents: number
  avgResponseTime: number
}

interface ResponseTimeData {
  timestamp: Date
  monitorId: string
  avgLatency: number
  minLatency: number
  maxLatency: number
}

/**
 * Calculate uptime percentage from website ticks
 */
export function calculateUptime(ticks: WebsiteTick[]): number {
  if (ticks.length === 0) return 0
  const goodTicks = ticks.filter((tick) => tick.status === 'Good').length
  return (goodTicks / ticks.length) * 100
}

/**
 * Get uptime statistics for a specific monitor
 */
export async function getMonitorUptimeStats(
  monitorId: string,
  userId: string,
): Promise<UptimeStats | null> {
  const monitor = await prisma.monitor.findFirst({
    where: {
      id: monitorId,
      userId,
      archived: false,
    },
    include: {
      websiteTicks: {
        orderBy: { createdAt: 'desc' },
        take: 1000, // Last 1000 ticks for calculations
      },
    },
  })

  if (!monitor) return null

  const now = new Date()
  const day24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const ticks24h = monitor.websiteTicks.filter((t) => t.createdAt >= day24Ago)
  const ticks7d = monitor.websiteTicks.filter((t) => t.createdAt >= days7Ago)
  const ticks30d = monitor.websiteTicks.filter((t) => t.createdAt >= days30Ago)

  const avgResponseTime =
    ticks24h.length > 0
      ? ticks24h.reduce((sum, tick) => sum + tick.latency, 0) / ticks24h.length
      : 0

  const currentStatus = ticks24h[0]?.status || 'Bad'
  const lastChecked = ticks24h[0]?.createdAt || null

  return {
    monitorId: monitor.id,
    url: monitor.url,
    name: monitor.name,
    uptime24h: calculateUptime(ticks24h),
    uptime7d: calculateUptime(ticks7d),
    uptime30d: calculateUptime(ticks30d),
    avgResponseTime: Math.round(avgResponseTime),
    status: currentStatus,
    lastChecked,
  }
}

/**
 * Get dashboard metrics for a user
 */
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const monitors = await prisma.monitor.findMany({
    where: {
      userId,
      archived: false,
    },
    include: {
      websiteTicks: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
          },
        },
      },
      incidents: {
        where: {
          status: {
            in: ['OPEN', 'ACKNOWLEDGED'],
          },
        },
      },
    },
  })

  const totalMonitors = monitors.length
  const activeMonitors = monitors.filter((m) => m.websiteTicks.length > 0).length

  // Calculate overall uptime
  let totalTicks = 0
  let goodTicks = 0
  let totalLatency = 0

  monitors.forEach((monitor) => {
    monitor.websiteTicks.forEach((tick) => {
      totalTicks++
      totalLatency += tick.latency
      if (tick.status === 'Good') {
        goodTicks++
      }
    })
  })

  const overallUptime = totalTicks > 0 ? (goodTicks / totalTicks) * 100 : 0
  const avgResponseTime = totalTicks > 0 ? totalLatency / totalTicks : 0

  // Count open incidents
  const openIncidents = monitors.reduce((sum, monitor) => sum + monitor.incidents.length, 0)

  return {
    totalMonitors,
    activeMonitors,
    overallUptime: Math.round(overallUptime * 100) / 100,
    openIncidents,
    avgResponseTime: Math.round(avgResponseTime),
  }
}

/**
 * Get response time data for charts
 */
export async function getResponseTimeData(
  userId: string,
  monitorIds?: string[],
  period: '24h' | '7d' | '30d' = '24h',
): Promise<ResponseTimeData[]> {
  const periodMap = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }

  const since = new Date(Date.now() - periodMap[period])

  const whereClause: any = {
    website: {
      userId,
      archived: false,
    },
    createdAt: {
      gte: since,
    },
  }

  if (monitorIds && monitorIds.length > 0) {
    whereClause.websiteId = {
      in: monitorIds,
    }
  }

  const ticks = await prisma.websiteTick.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      website: true,
    },
  })

  // Group ticks by hour and monitor
  const hourlyData = new Map<string, Map<string, number[]>>()

  ticks.forEach((tick) => {
    const hourKey = new Date(tick.createdAt).setMinutes(0, 0, 0).toString()
    const monitorId = tick.websiteId

    if (!hourlyData.has(hourKey)) {
      hourlyData.set(hourKey, new Map())
    }

    const hourMap = hourlyData.get(hourKey)!
    if (!hourMap.has(monitorId)) {
      hourMap.set(monitorId, [])
    }

    hourMap.get(monitorId)!.push(tick.latency)
  })

  // Calculate aggregates
  const result: ResponseTimeData[] = []

  hourlyData.forEach((monitorMap, hourKey) => {
    monitorMap.forEach((latencies, monitorId) => {
      const timestamp = new Date(parseInt(hourKey))
      const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length
      const minLatency = Math.min(...latencies)
      const maxLatency = Math.max(...latencies)

      result.push({
        timestamp,
        monitorId,
        avgLatency: Math.round(avgLatency),
        minLatency: Math.round(minLatency),
        maxLatency: Math.round(maxLatency),
      })
    })
  })

  return result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

/**
 * Get all uptime stats for user's monitors
 */
export async function getAllMonitorUptimeStats(userId: string): Promise<UptimeStats[]> {
  const monitors = await prisma.monitor.findMany({
    where: {
      userId,
      archived: false,
    },
  })

  const stats = await Promise.all(
    monitors.map((monitor) => getMonitorUptimeStats(monitor.id, userId)),
  )

  return stats.filter((s): s is UptimeStats => s !== null)
}
