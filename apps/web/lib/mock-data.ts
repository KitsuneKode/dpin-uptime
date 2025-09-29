import type {
  Monitor,
  DashboardMetrics,
  Incident,
  ResponseTimeData,
  UptimeStats,
  StatusPage,
  ApiResponse,
  PaginatedResponse,
} from './types'
import { WebsiteStatus } from './types'

// Helper function to generate random data (for future use)
// const randomBetween = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min

// const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Generate realistic timestamps
const generateTimestamps = (count: number, intervalMinutes: number = 5) => {
  const now = new Date()
  const timestamps: string[] = []
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000)
    timestamps.push(time.toISOString())
  }
  
  return timestamps
}

// Mock Monitors Data
export const mockMonitors: Monitor[] = [
  {
    id: '1',
    name: 'Main Website',
    url: 'https://mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 36 * 1000).toISOString(), // 36 seconds ago
    responseTime: 145,
    uptime: {
      current: '5 hours 3 minutes 46 seconds',
      percentage: 100.0000,
    },
    interval: '3m',
    incidents: 0,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'API Gateway',
    url: 'https://api.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    responseTime: 89,
    uptime: {
      current: '12 days 8 hours 15 minutes',
      percentage: 99.9876,
    },
    interval: '5m',
    incidents: 1,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Database Cluster',
    url: 'https://db.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    responseTime: 234,
    uptime: {
      current: '8 days 14 hours 22 minutes',
      percentage: 99.9234,
    },
    interval: '5m',
    incidents: 2,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'CDN Europe',
    url: 'https://eu-cdn.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 45 * 1000).toISOString(),
    responseTime: 67,
    uptime: {
      current: '25 days 8 hours 42 minutes',
      percentage: 99.9945,
    },
    interval: '2m',
    incidents: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Authentication Service',
    url: 'https://auth.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    responseTime: 156,
    uptime: {
      current: '18 days 2 hours 11 minutes',
      percentage: 99.9567,
    },
    interval: '3m',
    incidents: 1,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    name: 'File Storage',
    url: 'https://files.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    responseTime: 298,
    uptime: {
      current: '6 days 16 hours 33 minutes',
      percentage: 99.8901,
    },
    interval: '5m',
    incidents: 3,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    name: 'Analytics Dashboard',
    url: 'https://analytics.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    responseTime: 412,
    uptime: {
      current: '4 days 9 hours 18 minutes',
      percentage: 99.7845,
    },
    interval: '10m',
    incidents: 4,
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    name: 'Payment Processor',
    url: 'https://payments.mugenbrain.tech',
    status: 'up',
    lastChecked: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    responseTime: 178,
    uptime: {
      current: '11 days 7 hours 44 minutes',
      percentage: 99.9123,
    },
    interval: '1m',
    incidents: 2,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
]

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalMonitors: mockMonitors.length,
  overallUptime: 99.9234,
  activeIncidents: 0,
  avgResponseTime: 189,
  uptimeStreak: '5 hours 3 minutes 46 seconds',
  lastChecked: new Date(Date.now() - 36 * 1000).toISOString(),
}

// Mock Incidents Data
export const mockIncidents: Incident[] = [
  {
    id: '1',
    monitorId: '8',
    title: 'Payment Processor Brief Slowdown',
    description: 'Payment processing experienced temporary increased response times.',
    status: 'resolved',
    severity: 'minor',
    startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    resolvedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updates: [
      {
        id: '1-1',
        incidentId: '1',
        message: 'Monitoring increased response times on payment processor.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '1-2',
        incidentId: '1',
        message: 'Response times have returned to normal. Issue resolved.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    monitorId: '3',
    title: 'Database Connection Pool Exhaustion',
    description: 'Database cluster experienced connection pool exhaustion during peak traffic.',
    status: 'resolved',
    severity: 'major',
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 mins later
    updates: [
      {
        id: '2-1',
        incidentId: '2',
        message: 'Database connection issues detected during peak traffic.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2-2',
        incidentId: '2',
        message: 'Increased connection pool size and optimized queries. Issue resolved.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    monitorId: '1',
    title: 'Brief Website Slowdown',
    description: 'Website experienced temporary slowdown due to high traffic.',
    status: 'resolved',
    severity: 'minor',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    resolvedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 mins ago
    updates: [
      {
        id: '3-1',
        incidentId: '3',
        message: 'Website experiencing slower response times.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3-2',
        incidentId: '3',
        message: 'Issue resolved. Website performance back to normal.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '4',
    monitorId: '2',
    title: 'API Rate Limiting Issues',
    description: 'Some API requests were being rate limited incorrectly.',
    status: 'resolved',
    severity: 'minor',
    startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updates: [
      {
        id: '4-1',
        incidentId: '4',
        message: 'Investigating reports of API rate limiting issues.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4-2',
        incidentId: '4',
        message: 'Rate limiting configuration updated. Issue resolved.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
]

// Generate Response Time Data
export const generateMockResponseTimeData = (
  monitorId: string,
  period: 'day' | 'week' | 'month' = 'day',
  location: string = 'us-east'
): ResponseTimeData[] => {
  const monitor = mockMonitors.find(m => m.id === monitorId)
  if (!monitor) return []

  const baseResponseTime = monitor.responseTime
  const dataPoints = period === 'day' ? 288 : period === 'week' ? 168 : 720 // 5min intervals for day, 1h for week, 1h for month
  const intervalMinutes = period === 'day' ? 5 : 60

  const timestamps = generateTimestamps(dataPoints, intervalMinutes)
  
  return timestamps.map((timestamp, index) => {
    // Create more realistic patterns
    const timeOfDay = new Date(timestamp).getHours()
    const dayOfWeek = new Date(timestamp).getDay()
    
    // Base variation with time-of-day patterns
    let variation = 0
    
    // Higher response times during peak hours (9-17)
    if (timeOfDay >= 9 && timeOfDay <= 17) {
      variation += 30 + Math.sin((timeOfDay - 9) / 8 * Math.PI) * 20
    }
    
    // Weekend traffic patterns
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      variation -= 15
    }
    
    // Add some random spikes and normal variation
    const randomSpike = Math.random() < 0.02 ? Math.random() * 200 : 0 // 2% chance of spike
    const normalVariation = (Math.random() - 0.5) * 30
    const trendVariation = Math.sin(index * 0.05) * 15
    
    let value = Math.max(10, baseResponseTime + variation + randomSpike + normalVariation + trendVariation)
    
    // Simulate outages and degraded performance
    if (monitor.status === 'down' && index > dataPoints - 10) {
      value = 0 // Recent outage
    } else if (monitor.status === 'degraded') {
      value *= 1.5 + Math.random() * 0.5 // 1.5x to 2x slower
    }

    return {
      timestamp,
      value: Math.round(value),
      monitorId,
      location,
      status: value === 0 ? WebsiteStatus.Bad : WebsiteStatus.Good,
    }
  })
}

// Mock Status Pages
export const mockStatusPages: StatusPage[] = [
  {
    id: '1',
    companyName: 'Example Corp',
    subdomain: 'status',
    logoUrl: 'https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=Example+Corp',
    theme: 'light',
    monitors: ['1', '2', '3', '4'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Uptime Stats
export const generateMockUptimeStats = (
  monitorId: string,
  period: 'today' | 'week' | 'month' = 'today'
): UptimeStats => {
  const monitor = mockMonitors.find(m => m.id === monitorId)
  if (!monitor) {
    return {
      period,
      availability: 0,
      downtime: '0 minutes',
      incidents: 0,
      longestIncident: '0 minutes',
      avgIncident: '0 minutes',
    }
  }

  const baseUptime = monitor.uptime.percentage
  const incidents = mockIncidents.filter(i => i.monitorId === monitorId).length

  return {
    period,
    availability: baseUptime,
    downtime: period === 'today' ? '12 minutes' : period === 'week' ? '2 hours 15 minutes' : '8 hours 42 minutes',
    incidents,
    longestIncident: period === 'today' ? '8 minutes' : period === 'week' ? '45 minutes' : '2 hours 15 minutes',
    avgIncident: period === 'today' ? '6 minutes' : period === 'week' ? '22 minutes' : '1 hour 5 minutes',
  }
}

// Helper functions to wrap data in API response format
export const wrapApiResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  success: true,
  message: 'Success',
})

export const wrapPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> => ({
  data: data.slice((page - 1) * limit, page * limit),
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  },
})
