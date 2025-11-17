import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { 
  CreateMonitorData, 
  UpdateMonitorData,
  TimePeriod,
  Location,
  Monitor,
  ResponseTimeData,
  UptimeStats,
  ApiResponse,
  PaginatedResponse
} from '@/lib/types';
import { generateMockResponseTimeData } from '@/lib/mock-data';

// Query keys
export const monitorKeys = {
  all: ['monitors'] as const,
  lists: () => [...monitorKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...monitorKeys.lists(), { filters }] as const,
  details: () => [...monitorKeys.all, 'detail'] as const,
  detail: (id: string) => [...monitorKeys.details(), id] as const,
  responseTime: (id: string, period: string, location?: string) => 
    [...monitorKeys.detail(id), 'response-time', { period, location }] as const,
  uptime: (id: string, period: string) => 
    [...monitorKeys.detail(id), 'uptime', { period }] as const,
};

// Monitors list query
export const useMonitors = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  refetchInterval?: number;
}): UseQueryResult<{ websites: Monitor[] }> => {
  const { refetchInterval, ...apiParams } = params || {};
  return useQuery({
    queryKey: monitorKeys.list(apiParams),
    queryFn: () => api.getMonitors(apiParams),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: refetchInterval || false,
  });
};

// Single monitor query
export const useMonitor = (id: string): UseQueryResult<ApiResponse<Monitor>> => {
  return useQuery({
    queryKey: monitorKeys.detail(id),
    queryFn: () => api.getMonitor(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

// Response time data query
export const useResponseTimeData = (
  monitorId: string,
  period: TimePeriod,
  location?: Location
): UseQueryResult<ApiResponse<ResponseTimeData[]>> => {
  return useQuery({
    queryKey: monitorKeys.responseTime(monitorId, period, location),
    queryFn: async () => {
      try {
        const res = await api.getResponseTimeData({ period, monitorIds: [monitorId] });
        if (!res?.data?.length) {
          console.log('[useResponseTimeData] No data returned from API');
          return { data: [], success: true } as ApiResponse<ResponseTimeData[]>;
        }

        // Transform backend data to frontend format
        const transformedData: ResponseTimeData[] = res.data.map((item: any) => ({
          timestamp: typeof item.timestamp === 'string' ? item.timestamp : item.timestamp.toISOString(),
          value: item.avgLatency || item.value || 0,
          monitorId: item.monitorId,
          location: location || 'unknown',
          status: (item.status || 'Good') as any,
        }));

        console.log('[useResponseTimeData] Transformed data:', transformedData.length, 'points');
        return { data: transformedData, success: true } as ApiResponse<ResponseTimeData[]>;
      } catch (error) {
        console.error('[useResponseTimeData] Error fetching data:', error);
        return { data: [], success: false } as ApiResponse<ResponseTimeData[]>;
      }
    },
    enabled: !!monitorId && !!period && monitorId.trim() !== '',
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 1,
  });
};

// Uptime stats query
export const useUptimeStats = (monitorId: string, period: TimePeriod): UseQueryResult<ApiResponse<UptimeStats>> => {
  return useQuery({
    queryKey: monitorKeys.uptime(monitorId, period),
    queryFn: async () => {
      // For now, return a mock since the backend doesn't have this endpoint yet
      // TODO: Implement backend endpoint for per-monitor uptime stats
      return {
        data: {
          period: period === 'day' ? 'today' : period === 'week' ? 'week' : 'month',
          availability: 99.95,
          downtime: '5m',
          incidents: 1,
          longestIncident: '3m',
          avgIncident: '2m',
        } as UptimeStats,
        success: true,
      } as ApiResponse<UptimeStats>;
    },
    enabled: !!monitorId && !!period,
    staleTime: 60 * 1000,
  });
};

// Create monitor mutation
export const useCreateMonitor = (): UseMutationResult<{ success: boolean; message: string } & Partial<Monitor>, Error, CreateMonitorData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMonitorData) => api.createMonitor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitorKeys.lists() });
    },
  });
};

// Update monitor mutation
export const useUpdateMonitor = (): UseMutationResult<ApiResponse<Monitor>, Error, UpdateMonitorData> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateMonitorData) => api.updateMonitor(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: monitorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: monitorKeys.detail(variables.id) });
    },
  });
};

// Delete monitor mutation
export const useDeleteMonitor = (): UseMutationResult<{ success: boolean; message: string }, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteMonitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitorKeys.lists() });
    },
  });
};

// Pause monitor mutation
export const usePauseMonitor = (): UseMutationResult<ApiResponse<Monitor>, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.pauseMonitor(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: monitorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: monitorKeys.detail(id) });
    },
  });
};

// Resume monitor mutation
export const useResumeMonitor = (): UseMutationResult<ApiResponse<Monitor>, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.resumeMonitor(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: monitorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: monitorKeys.detail(id) });
    },
  });
};

// Monitor ticks query
export const useMonitorTicks = (id: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: [...monitorKeys.detail(id), 'ticks'],
    queryFn: () => api.getMonitorTicks(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to get new ticks
  });
};
