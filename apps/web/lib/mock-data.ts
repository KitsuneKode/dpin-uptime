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
    url: 'https://example.com',
    status: 'up',
    lastChecked: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    responseTime: 145,
    uptime: {
      current: '15 days 4 hours 23 minutes',
      percentage: 99.98,
    },
    interval: '5m',
    incidents: 2,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'API Gateway',
    url: 'https://api.example.com',
    status: 'up',
    lastChecked: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min ago
    responseTime: 89,
    uptime: {
      current: '7 days 12 hours 5 minutes',
      percentage: 99.95,
    },
    interval: '3m',
    incidents: 1,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Database Server',
    url: 'https://db.example.com',
    status: 'degraded',
    lastChecked: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
    responseTime: 1250,
    uptime: {
      current: '2 hours 15 minutes',
      percentage: 97.8,
    },
    interval: '5m',
    incidents: 5,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'CDN Endpoint',
    url: 'https://cdn.example.com',
    status: 'up',
    lastChecked: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min ago
    responseTime: 67,
    uptime: {
      current: '25 days 8 hours 42 minutes',
      percentage: 99.99,
    },
    interval: '2m',
    incidents: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Payment Gateway',
    url: 'https://payments.example.com',
    status: 'down',
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    responseTime: 0,
    uptime: {
      current: '0 minutes',
      percentage: 98.5,
    },
    interval: '1m',
    incidents: 8,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
]

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalMonitors: mockMonitors.length,
  overallUptime: 99.24,
  activeIncidents: 2,
  avgResponseTime: 310,
  uptimeStreak: '15 days 4 hours 23 minutes',
  lastChecked: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
}

// Mock Incidents Data
export const mockIncidents: Incident[] = [
  {
    id: '1',
    monitorId: '5',
    title: 'Payment Gateway Outage',
    description: 'Payment processing is currently unavailable due to server issues.',
    status: 'investigating',
    severity: 'critical',
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    updates: [
      {
        id: '1-1',
        incidentId: '1',
        message: 'We are investigating reports of payment processing failures.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: '1-2',
        incidentId: '1',
        message: 'Issue identified with payment gateway. Working on a fix.',
        status: 'identified',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    monitorId: '3',
    title: 'Database Performance Degradation',
    description: 'Database queries are experiencing higher than normal response times.',
    status: 'monitoring',
    severity: 'major',
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    updates: [
      {
        id: '2-1',
        incidentId: '2',
        message: 'Database performance issues detected.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: '2-2',
        incidentId: '2',
        message: 'Applied database optimizations. Monitoring performance.',
        status: 'monitoring',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
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
    // Add some realistic variation
    const variation = Math.sin(index * 0.1) * 20 + (Math.random() - 0.5) * 40
    const value = Math.max(10, baseResponseTime + variation)
    
    // Simulate some outages for down monitors
    const finalValue = monitor.status === 'down' && index > dataPoints - 10 ? 0 : value

    return {
      timestamp,
      value: Math.round(finalValue),
      monitorId,
      location,
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
