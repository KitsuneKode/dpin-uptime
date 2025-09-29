import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Incident, ApiResponse, PaginatedResponse } from '@/lib/types';

// Query keys
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...incidentKeys.lists(), { filters }] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
};

// Incidents list query
export const useIncidents = (params?: {
  page?: number;
  limit?: number;
  monitorId?: string;
  status?: string;
}): UseQueryResult<PaginatedResponse<Incident>> => {
  return useQuery({
    queryKey: incidentKeys.list(params || {}),
    queryFn: () => api.getIncidents(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Single incident query
export const useIncident = (id: string): UseQueryResult<ApiResponse<Incident>> => {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => api.getIncident(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
