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
} from './types'

import { mockApi } from './mock-api'
import { API_BASE_URL, NODE_ENV } from '@/utils/config'

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      credentials: 'include', // Include cookies for authentication
    }

    try {
      console.log(`[${NODE_ENV}] API Request:`, { url, config })
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Dashboard
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.request('/api/v1/dashboard/metrics')
  }

  async getResponseTimeData(
    params: {
      period?: string
      monitorIds?: string[]
    } = {},
  ): Promise<ApiResponse<ResponseTimeData[]>> {
    const searchParams = new URLSearchParams()
    if (params.period) searchParams.append('period', params.period)
    if (params.monitorIds)
      searchParams.append('monitorIds', params.monitorIds.join(','))

    const query = searchParams.toString()
    return this.request(
      `/api/v1/dashboard/response-times${query ? `?${query}` : ''}`,
    )
  }

  async getUptimeStats(): Promise<ApiResponse<UptimeStats[]>> {
    return this.request('/api/v1/dashboard/uptime-stats')
  }

  // Monitors
  async getMonitors(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ websites: Monitor[] }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.status) searchParams.append('status', params.status)

    const query = searchParams.toString()
    return this.request(`/api/v1/monitor${query ? `?${query}` : ''}`)
  }

  async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/api/v1/monitor?id=${id}`)
  }

  async createMonitor(
    data: CreateMonitorData,
  ): Promise<{ success: boolean; message: string } & Partial<Monitor>> {
    const response = await this.request<any>('/api/v1/monitor', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  }

  async updateMonitor(data: UpdateMonitorData): Promise<ApiResponse<Monitor>> {
    return this.request(`/api/v1/monitor`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteMonitor(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.request<{ success: boolean; message: string }>(
      '/api/v1/monitor',
      {
        method: 'DELETE',
        body: JSON.stringify({ websiteId: id }),
      },
    )
    return response
  }

  async getMonitorTicks(id: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/v1/monitor/${id}/ticks`)
  }

  async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/api/v1/monitor/${id}/pause`, {
      method: 'PATCH',
    })
  }

  async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/api/v1/monitor/${id}/resume`, {
      method: 'PATCH',
    })
  }

  // Incidents
  async getIncidents(params?: {
    page?: number
    limit?: number
    monitorId?: string
    status?: string
  }): Promise<PaginatedResponse<Incident>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.monitorId) searchParams.append('monitorId', params.monitorId)
    if (params?.status) searchParams.append('status', params.status)

    const query = searchParams.toString()
    return this.request(`/api/v1/incidents${query ? `?${query}` : ''}`)
  }

  async getIncident(id: string): Promise<ApiResponse<Incident>> {
    return this.request(`/api/v1/incidents/${id}`)
  }

  async acknowledgeIncident(id: string): Promise<ApiResponse<Incident>> {
    return this.request(`/api/v1/incidents/${id}/acknowledge`, {
      method: 'PATCH',
    })
  }

  async resolveIncident(id: string): Promise<ApiResponse<Incident>> {
    return this.request(`/api/v1/incidents/${id}/resolve`, {
      method: 'PATCH',
    })
  }

  // Status Pages
  async getStatusPages(): Promise<ApiResponse<StatusPage[]>> {
    return this.request('/api/v1/status-pages')
  }

  async getStatusPage(id: string): Promise<ApiResponse<StatusPage>> {
    return this.request(`/api/v1/status-pages/${id}`)
  }

  async createStatusPage(
    data: CreateStatusPageData,
  ): Promise<ApiResponse<StatusPage>> {
    return this.request('/api/v1/status-pages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStatusPage(
    id: string,
    data: UpdateStatusPageData,
  ): Promise<ApiResponse<StatusPage>> {
    return this.request(`/api/v1/status-pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteStatusPage(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/v1/status-pages/${id}`, {
      method: 'DELETE',
    })
  }

  // Admin - Validators
  async registerValidator(data: {
    publicKey: string
    location: string
    ip: string
  }): Promise<ApiResponse<any>> {
    return this.request('/api/v1/admin/validators', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getValidators(status?: string): Promise<{ data: any[] }> {
    const query = status && status !== 'all' ? `?status=${status}` : ''
    return this.request(`/api/v1/admin/validators${query}`)
  }

  async approveValidator(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/admin/validators/${id}/approve`, {
      method: 'PATCH',
    })
  }

  async rejectValidator(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/admin/validators/${id}/reject`, {
      method: 'PATCH',
    })
  }

  async suspendValidator(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/admin/validators/${id}/suspend`, {
      method: 'PATCH',
    })
  }

  async deleteValidator(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/v1/admin/validators/${id}`, {
      method: 'DELETE',
    })
  }
}

// Import mock API for development

// Export the appropriate API client based on environment
export const api = USE_MOCK_API ? mockApi : new ApiClient(API_BASE_URL)
