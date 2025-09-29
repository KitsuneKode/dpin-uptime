import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { StatusPage, CreateStatusPageData, UpdateStatusPageData, ApiResponse } from '@/lib/types';

// Query keys
export const statusPageKeys = {
  all: ['status-pages'] as const,
  lists: () => [...statusPageKeys.all, 'list'] as const,
  details: () => [...statusPageKeys.all, 'detail'] as const,
  detail: (id: string) => [...statusPageKeys.details(), id] as const,
};

// Status pages list query
export const useStatusPages = (): UseQueryResult<ApiResponse<StatusPage[]>> => {
  return useQuery({
    queryKey: statusPageKeys.lists(),
    queryFn: () => api.getStatusPages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single status page query
export const useStatusPage = (id: string): UseQueryResult<ApiResponse<StatusPage>> => {
  return useQuery({
    queryKey: statusPageKeys.detail(id),
    queryFn: () => api.getStatusPage(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create status page mutation
export const useCreateStatusPage = (): UseMutationResult<ApiResponse<StatusPage>, Error, CreateStatusPageData> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStatusPageData) => api.createStatusPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusPageKeys.lists() });
    },
  });
};

// Update status page mutation
export const useUpdateStatusPage = (): UseMutationResult<ApiResponse<StatusPage>, Error, UpdateStatusPageData> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateStatusPageData) => 
      api.updateStatusPage(data.id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: statusPageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statusPageKeys.detail(variables.id) });
    },
  });
};

// Delete status page mutation
export const useDeleteStatusPage = (): UseMutationResult<ApiResponse<void>, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteStatusPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusPageKeys.lists() });
    },
  });
};
