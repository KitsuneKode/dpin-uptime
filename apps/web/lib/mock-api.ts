import type {
  ApiResponse,
  PaginatedResponse,
  Monitor,
  CreateMonitorData,
  UpdateMonitorData,
  ResponseTimeData,
  UptimeStats,
  StatusPage,
  CreateStatusPageData,
  Incident,
  DashboardMetrics,
  TimePeriod,
  Location,
} from './types'

import {
  mockMonitors,
  mockDashboardMetrics,
  mockIncidents,
  mockStatusPages,
  generateMockResponseTimeData,
  generateMockUptimeStats,
  wrapApiResponse,
  wrapPaginatedResponse,
} from './mock-data'

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

class MockApiClient {
  // Dashboard
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    await delay(300)
    return wrapApiResponse(mockDashboardMetrics)
  }

  // Monitors
  async getMonitors(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<PaginatedResponse<Monitor>> {
    await delay(400)
    
    let filteredMonitors = [...mockMonitors]
    
    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredMonitors = filteredMonitors.filter(
        monitor =>
          monitor.name.toLowerCase().includes(searchLower) ||
          monitor.url.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (params?.status && params.status !== 'all') {
      filteredMonitors = filteredMonitors.filter(
        monitor => monitor.status === params.status
      )
    }
    
    return wrapPaginatedResponse(
      filteredMonitors,
      params?.page || 1,
      params?.limit || 10
    )
  }

  async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(200)
    const monitor = mockMonitors.find(m => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }
    return wrapApiResponse(monitor)
  }

  async createMonitor(data: CreateMonitorData): Promise<ApiResponse<Monitor>> {
    await delay(600)
    
    const newMonitor: Monitor = {
      id: (mockMonitors.length + 1).toString(),
      name: data.name,
      url: data.url,
      status: 'up',
      lastChecked: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 200) + 50,
      uptime: {
        current: '0 minutes',
        percentage: 100,
      },
      interval: data.interval,
      incidents: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockMonitors.push(newMonitor)
    return wrapApiResponse(newMonitor)
  }

  async updateMonitor(data: UpdateMonitorData): Promise<ApiResponse<Monitor>> {
    await delay(500)
    
    const index = mockMonitors.findIndex(m => m.id === data.id)
    if (index === -1) {
      throw new Error(`Monitor with id ${data.id} not found`)
    }
    
    const updatedMonitor = {
      ...mockMonitors[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    mockMonitors[index] = updatedMonitor
    return wrapApiResponse(updatedMonitor)
  }

  async deleteMonitor(id: string): Promise<ApiResponse<void>> {
    await delay(400)
    
    const index = mockMonitors.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error(`Monitor with id ${id} not found`)
    }
    
    mockMonitors.splice(index, 1)
    return wrapApiResponse(undefined as void)
  }

  async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(300)
    
    const monitor = mockMonitors.find(m => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }
    
    monitor.status = 'paused'
    monitor.updatedAt = new Date().toISOString()
    
    return wrapApiResponse(monitor)
  }

  async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(300)
    
    const monitor = mockMonitors.find(m => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }
    
    monitor.status = 'up'
    monitor.updatedAt = new Date().toISOString()
    
    return wrapApiResponse(monitor)
  }

  // Response Time Data
  async getResponseTimeData(
    monitorId: string,
    params: {
      period: TimePeriod
      location?: Location
    }
  ): Promise<ApiResponse<ResponseTimeData[]>> {
    await delay(600)
    
    const data = generateMockResponseTimeData(
      monitorId,
      params.period,
      params.location || 'us-east'
    )
    
    return wrapApiResponse(data)
  }

  // Uptime Stats
  async getUptimeStats(
    monitorId: string,
    period: TimePeriod
  ): Promise<ApiResponse<UptimeStats>> {
    await delay(400)
    
    const periodMap: Record<TimePeriod, 'today' | 'week' | 'month'> = {
      day: 'today',
      week: 'week',
      month: 'month',
    }
    
    const stats = generateMockUptimeStats(monitorId, periodMap[period])
    return wrapApiResponse(stats)
  }

  // Incidents
  async getIncidents(params?: {
    page?: number
    limit?: number
    monitorId?: string
    status?: string
  }): Promise<PaginatedResponse<Incident>> {
    await delay(350)
    
    let filteredIncidents = [...mockIncidents]
    
    // Apply monitor filter
    if (params?.monitorId) {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.monitorId === params.monitorId
      )
    }
    
    // Apply status filter
    if (params?.status && params.status !== 'all') {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.status === params.status
      )
    }
    
    // Sort by most recent first
    filteredIncidents.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
    
    return wrapPaginatedResponse(
      filteredIncidents,
      params?.page || 1,
      params?.limit || 10
    )
  }

  async getIncident(id: string): Promise<ApiResponse<Incident>> {
    await delay(250)
    
    const incident = mockIncidents.find(i => i.id === id)
    if (!incident) {
      throw new Error(`Incident with id ${id} not found`)
    }
    
    return wrapApiResponse(incident)
  }

  // Status Pages
  async getStatusPages(): Promise<ApiResponse<StatusPage[]>> {
    await delay(300)
    return wrapApiResponse(mockStatusPages)
  }

  async getStatusPage(id: string): Promise<ApiResponse<StatusPage>> {
    await delay(200)
    
    const statusPage = mockStatusPages.find(sp => sp.id === id)
    if (!statusPage) {
      throw new Error(`Status page with id ${id} not found`)
    }
    
    return wrapApiResponse(statusPage)
  }

  async createStatusPage(data: CreateStatusPageData): Promise<ApiResponse<StatusPage>> {
    await delay(700)
    
    const newStatusPage: StatusPage = {
      id: (mockStatusPages.length + 1).toString(),
      companyName: data.companyName,
      subdomain: data.subdomain,
      logoUrl: data.logoUrl,
      theme: data.theme,
      monitors: data.monitors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockStatusPages.push(newStatusPage)
    return wrapApiResponse(newStatusPage)
  }

  async updateStatusPage(
    id: string,
    data: Partial<CreateStatusPageData>
  ): Promise<ApiResponse<StatusPage>> {
    await delay(500)
    
    const index = mockStatusPages.findIndex(sp => sp.id === id)
    if (index === -1) {
      throw new Error(`Status page with id ${id} not found`)
    }
    
    const updatedStatusPage = {
      ...mockStatusPages[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    mockStatusPages[index] = updatedStatusPage
    return wrapApiResponse(updatedStatusPage)
  }

  async deleteStatusPage(id: string): Promise<ApiResponse<void>> {
    await delay(400)
    
    const index = mockStatusPages.findIndex(sp => sp.id === id)
    if (index === -1) {
      throw new Error(`Status page with id ${id} not found`)
    }
    
    mockStatusPages.splice(index, 1)
    return wrapApiResponse(undefined as void)
  }
}

export const mockApi = new MockApiClient()
