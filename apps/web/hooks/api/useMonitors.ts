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
}): UseQueryResult<PaginatedResponse<Monitor>> => {
  return useQuery({
    queryKey: monitorKeys.list(params || {}),
    queryFn: () => api.getMonitors(params),
    staleTime: 30 * 1000, // 30 seconds
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
    queryFn: () => api.getResponseTimeData(monitorId, { period, location }),
    enabled: !!monitorId && !!period && monitorId.trim() !== '',
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: 1000,
  });
};

// Uptime stats query
export const useUptimeStats = (monitorId: string, period: TimePeriod): UseQueryResult<ApiResponse<UptimeStats>> => {
  return useQuery({
    queryKey: monitorKeys.uptime(monitorId, period),
    queryFn: () => api.getUptimeStats(monitorId, period),
    enabled: !!monitorId && !!period,
    staleTime: 60 * 1000,
  });
};

// Create monitor mutation
export const useCreateMonitor = (): UseMutationResult<ApiResponse<Monitor>, Error, CreateMonitorData> => {
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
export const useDeleteMonitor = (): UseMutationResult<ApiResponse<void>, Error, string> => {
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
