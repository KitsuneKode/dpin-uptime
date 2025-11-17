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
  UpdateStatusPageData,
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
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

class MockApiClient {
  // Dashboard
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    await delay(300)
    return wrapApiResponse(mockDashboardMetrics)
  }

  // Monitors (matching ApiClient signature)
  async getMonitors(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ websites: Monitor[] }> {
    await delay(400)

    let filteredMonitors = [...mockMonitors]

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredMonitors = filteredMonitors.filter(
        (monitor) =>
          monitor.name.toLowerCase().includes(searchLower) ||
          monitor.url.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (params?.status && params.status !== 'all') {
      filteredMonitors = filteredMonitors.filter(
        (monitor) => monitor.status === params.status,
      )
    }

    return { websites: filteredMonitors.slice(0, params?.limit || 10) }
  }

  async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(200)
    const monitor = mockMonitors.find((m) => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }
    return wrapApiResponse(monitor)
  }

  async createMonitor(data: CreateMonitorData): Promise<{ success: boolean; message: string } & Partial<Monitor>> {
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
    return { success: true, message: 'Monitor created successfully', ...newMonitor }
  }

  async updateMonitor(data: UpdateMonitorData): Promise<ApiResponse<Monitor>> {
    await delay(500)

    const index = mockMonitors.findIndex((m) => m.id === data.id)
    if (index === -1) {
      throw new Error(`Monitor with id ${data.id} not found`)
    }

    const existingMonitor = mockMonitors[index]!
    const updates = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    const updatedMonitor: Monitor = {
      ...existingMonitor,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    mockMonitors[index] = updatedMonitor
    return wrapApiResponse(updatedMonitor)
  }

  async deleteMonitor(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400)

    const index = mockMonitors.findIndex((m) => m.id === id)
    if (index === -1) {
      throw new Error(`Monitor with id ${id} not found`)
    }

    mockMonitors.splice(index, 1)
    return { success: true, message: 'Monitor deleted successfully' }
  }

  async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(300)

    const monitor = mockMonitors.find((m) => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }

    monitor.status = 'paused'
    monitor.updatedAt = new Date().toISOString()

    return wrapApiResponse(monitor)
  }

  async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
    await delay(300)

    const monitor = mockMonitors.find((m) => m.id === id)
    if (!monitor) {
      throw new Error(`Monitor with id ${id} not found`)
    }

    monitor.status = 'up'
    monitor.updatedAt = new Date().toISOString()

    return wrapApiResponse(monitor)
  }

  // Response Time Data (matching ApiClient signature)
  async getResponseTimeData(
    params: {
      period?: string
      monitorIds?: string[]
    } = {},
  ): Promise<ApiResponse<ResponseTimeData[]>> {
    await delay(600)

    const monitorId = params.monitorIds?.[0] || 'mock-monitor'
    const period = (params.period as TimePeriod) || 'day'

    const data = generateMockResponseTimeData(
      monitorId,
      period,
      'us-east',
    )

    return wrapApiResponse(data)
  }

  // Uptime Stats (matching ApiClient signature)
  async getUptimeStats(): Promise<ApiResponse<UptimeStats[]>> {
    await delay(400)

    const stats = [
      generateMockUptimeStats('mock-monitor-1', 'today'),
      generateMockUptimeStats('mock-monitor-2', 'today'),
    ]
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
        (incident) => incident.monitorId === params.monitorId,
      )
    }

    // Apply status filter
    if (params?.status && params.status !== 'all') {
      filteredIncidents = filteredIncidents.filter(
        (incident) => incident.status === params.status,
      )
    }

    // Sort by most recent first
    filteredIncidents.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )

    return wrapPaginatedResponse(
      filteredIncidents,
      params?.page || 1,
      params?.limit || 10,
    )
  }

  async getIncident(id: string): Promise<ApiResponse<Incident>> {
    await delay(250)

    const incident = mockIncidents.find((i) => i.id === id)
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

    const statusPage = mockStatusPages.find((sp) => sp.id === id)
    if (!statusPage) {
      throw new Error(`Status page with id ${id} not found`)
    }

    return wrapApiResponse(statusPage)
  }

  async createStatusPage(
    data: CreateStatusPageData,
  ): Promise<ApiResponse<StatusPage>> {
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
    data: UpdateStatusPageData,
  ): Promise<ApiResponse<StatusPage>> {
    await delay(500)

    const index = mockStatusPages.findIndex((sp) => sp.id === id)
    if (index === -1) {
      throw new Error(`Status page with id ${id} not found`)
    }

    // Only apply defined fields from the patch and never override with undefined
    const entries = Object.entries(data).filter(([key, value]) => {
      return key !== 'id' && value !== undefined
    }) as [keyof StatusPage, StatusPage[keyof StatusPage]][]

    const patch = Object.fromEntries(entries) as Partial<StatusPage>

    const existing = mockStatusPages[index]!
    const updatedStatusPage = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
      id: existing.id,
    } as StatusPage

    mockStatusPages[index] = updatedStatusPage
    return wrapApiResponse(updatedStatusPage)
  }

  async deleteStatusPage(id: string): Promise<ApiResponse<void>> {
    await delay(400)

    const index = mockStatusPages.findIndex((sp) => sp.id === id)
    if (index === -1) {
      throw new Error(`Status page with id ${id} not found`)
    }

    mockStatusPages.splice(index, 1)
    return wrapApiResponse(undefined as void)
  }

  // Admin - Validators (mock implementations)
  async registerValidator(data: { publicKey: string; location: string; ip: string }): Promise<ApiResponse<any>> {
    await delay(400)
    return wrapApiResponse({ id: 'mock-validator-id', ...data, status: 'PENDING' })
  }

  async getValidators(status?: string): Promise<{ data: any[] }> {
    await delay(300)
    return { data: [] }
  }

  async approveValidator(id: string): Promise<ApiResponse<any>> {
    await delay(400)
    return wrapApiResponse({ id, status: 'APPROVED' })
  }

  async rejectValidator(id: string): Promise<ApiResponse<any>> {
    await delay(400)
    return wrapApiResponse({ id, status: 'REJECTED' })
  }

  async suspendValidator(id: string): Promise<ApiResponse<any>> {
    await delay(400)
    return wrapApiResponse({ id, status: 'SUSPENDED' })
  }

  async deleteValidator(id: string): Promise<ApiResponse<void>> {
    await delay(400)
    return wrapApiResponse(undefined as void)
  }

  async getMonitorTicks(id: string): Promise<ApiResponse<any[]>> {
    await delay(300)
    return wrapApiResponse([])
  }
}

export const mockApi = new MockApiClient()
