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
  DashboardMetrics
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.request('/dashboard/metrics');
  }

  // Monitors
  async getMonitors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Monitor>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/monitors${query ? `?${query}` : ''}`);
  }

  async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/monitors/${id}`);
  }

  async createMonitor(data: CreateMonitorData): Promise<ApiResponse<Monitor>> {
    return this.request('/monitors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMonitor(data: UpdateMonitorData): Promise<ApiResponse<Monitor>> {
    return this.request(`/monitors/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMonitor(id: string): Promise<ApiResponse<void>> {
    return this.request(`/monitors/${id}`, {
      method: 'DELETE',
    });
  }

  async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/monitors/${id}/pause`, {
      method: 'PATCH',
    });
  }

  async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
    return this.request(`/monitors/${id}/resume`, {
      method: 'PATCH',
    });
  }

  // Response Time Data
  async getResponseTimeData(
    monitorId: string,
    params: {
      period: string;
      location?: string;
    }
  ): Promise<ApiResponse<ResponseTimeData[]>> {
    const searchParams = new URLSearchParams({
      period: params.period,
      ...(params.location && { location: params.location }),
    });
    
    return this.request(`/monitors/${monitorId}/response-time?${searchParams}`);
  }

  // Uptime Stats
  async getUptimeStats(
    monitorId: string,
    period: string
  ): Promise<ApiResponse<UptimeStats>> {
    return this.request(`/monitors/${monitorId}/uptime?period=${period}`);
  }

  // Incidents
  async getIncidents(params?: {
    page?: number;
    limit?: number;
    monitorId?: string;
    status?: string;
  }): Promise<PaginatedResponse<Incident>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.monitorId) searchParams.append('monitorId', params.monitorId);
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/incidents${query ? `?${query}` : ''}`);
  }

  async getIncident(id: string): Promise<ApiResponse<Incident>> {
    return this.request(`/incidents/${id}`);
  }

  // Status Pages
  async getStatusPages(): Promise<ApiResponse<StatusPage[]>> {
    return this.request('/status-pages');
  }

  async getStatusPage(id: string): Promise<ApiResponse<StatusPage>> {
    return this.request(`/status-pages/${id}`);
  }

  async createStatusPage(data: CreateStatusPageData): Promise<ApiResponse<StatusPage>> {
    return this.request('/status-pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStatusPage(id: string, data: Partial<CreateStatusPageData>): Promise<ApiResponse<StatusPage>> {
    return this.request(`/status-pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteStatusPage(id: string): Promise<ApiResponse<void>> {
    return this.request(`/status-pages/${id}`, {
      method: 'DELETE',
    });
  }
}

// Import mock API for development
import { mockApi } from './mock-api';

// Export the appropriate API client based on environment
export const api = USE_MOCK_API ? mockApi : new ApiClient(API_BASE_URL);
