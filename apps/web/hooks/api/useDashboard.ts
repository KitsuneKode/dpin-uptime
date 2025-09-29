import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DashboardMetrics, ApiResponse } from '@/lib/types';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
};

// Dashboard metrics query
export const useDashboardMetrics = (): UseQueryResult<ApiResponse<DashboardMetrics>> => {
  return useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: () => api.getDashboardMetrics(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
};
