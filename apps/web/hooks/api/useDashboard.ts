import { api } from '@/lib/api'
import { mockDashboardMetrics } from '@/lib/mock-data'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type {
  DashboardMetrics,
  ApiResponse,
  ResponseTimeData,
  UptimeStats,
} from '@/lib/types'

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  responseTimes: (params?: { period?: string; monitorIds?: string[] }) =>
    [...dashboardKeys.all, 'response-times', params] as const,
  uptimeStats: () => [...dashboardKeys.all, 'uptime-stats'] as const,
}

// Dashboard metrics query
export const useDashboardMetrics = (): UseQueryResult<
  ApiResponse<DashboardMetrics>
> => {
  return useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: async () => {
      try {
        const response = await api.getDashboardMetrics()
        if (!response?.data) {
          return {
            data: mockDashboardMetrics,
            success: true,
            message: 'mock-fallback',
          } satisfies ApiResponse<DashboardMetrics>
        }
        return response
      } catch {
        return {
          data: mockDashboardMetrics,
          success: true,
          message: 'mock-fallback',
        } satisfies ApiResponse<DashboardMetrics>
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  })
}

// Dashboard response times query
export const useDashboardResponseTimes = (params?: {
  period?: string
  monitorIds?: string[]
}): UseQueryResult<ApiResponse<ResponseTimeData[]>> => {
  return useQuery({
    queryKey: dashboardKeys.responseTimes(params),
    queryFn: () => api.getResponseTimeData(params || {}),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// Dashboard uptime stats query
export const useDashboardUptimeStats = (): UseQueryResult<
  ApiResponse<UptimeStats[]>
> => {
  return useQuery({
    queryKey: dashboardKeys.uptimeStats(),
    queryFn: () => api.getUptimeStats(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}
