import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { safeBatchesApi } from '../api/safe-api';
import { queryKeys } from './config';
import type { UpsertBatchRequest, BatchFilters, UpsertBatchShelfAllocationRequest } from '../api/types';
import { toast } from 'sonner';
import { getErrorMessage, logError } from '../utils/error-handler';

export const useBatches = (filters?: BatchFilters) => {
  return useQuery({
    queryKey: queryKeys.batches.list(filters),
    queryFn: () => safeBatchesApi.getAll(filters),
    retry: (failureCount, error) => {
      // Don't retry on validation errors (4xx)
      const status = (error as any)?.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
};

export const useBatch = (batchId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.batches.detail(batchId),
    queryFn: () => safeBatchesApi.getById(batchId),
    enabled: enabled && !!batchId,
    retry: false, // Don't retry single item fetches
  });
};

export const useBatchAllocations = (batchId: string) => {
  return useQuery({
    queryKey: queryKeys.batches.allocations(batchId),
    queryFn: () => safeBatchesApi.getAllocations(batchId),
    enabled: !!batchId,
    retry: false,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpsertBatchRequest) => safeBatchesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.lists() });
      toast.success('تم إنشاء الدفعة بنجاح');
    },
    onError: (error: unknown) => {
      logError(error, 'Create Batch');
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, data }: { batchId: string; data: UpsertBatchRequest }) =>
      safeBatchesApi.update(batchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.detail(variables.batchId) });
      toast.success('تم تحديث الدفعة بنجاح');
    },
    onError: (error: unknown) => {
      logError(error, 'Update Batch');
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (batchId: string) => safeBatchesApi.delete(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.lists() });
      toast.success('تم حذف الدفعة بنجاح');
    },
    onError: (error: unknown) => {
      logError(error, 'Delete Batch');
      toast.error(getErrorMessage(error));
    },
  });
};

export const useCreateBatchAllocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, data }: { batchId: string; data: UpsertBatchShelfAllocationRequest }) =>
      safeBatchesApi.createAllocation(batchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.allocations(variables.batchId) });
      toast.success('تم تخصيص الدفعة للرف بنجاح');
    },
    onError: (error: unknown) => {
      logError(error, 'Create Batch Allocation');
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteBatchAllocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, allocationId }: { batchId: string; allocationId: string }) =>
      safeBatchesApi.deleteAllocation(batchId, allocationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.allocations(variables.batchId) });
      toast.success('تم إلغاء التخصيص بنجاح');
    },
    onError: (error: unknown) => {
      logError(error, 'Delete Batch Allocation');
      toast.error(getErrorMessage(error));
    },
  });
};
