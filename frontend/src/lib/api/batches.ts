import apiClient from './client';
import type {
  Batch,
  UpsertBatchRequest,
  PaginatedResponse,
  BatchFilters,
  BatchShelfAllocation,
  UpsertBatchShelfAllocationRequest,
} from './types';

export const batchesApi = {
  // Get paginated and filtered batches
  getAll: async (filters?: BatchFilters): Promise<PaginatedResponse<Batch>> => {
    const { data } = await apiClient.get<PaginatedResponse<Batch>>('/batches', {
      params: filters,
    });
    return data;
  },

  // Get single batch by ID
  getById: async (batchId: string): Promise<Batch> => {
    const { data } = await apiClient.get<Batch>(`/batches/${batchId}`);
    return data;
  },

  // Create new batch
  create: async (batch: UpsertBatchRequest): Promise<Batch> => {
    const { data } = await apiClient.post<Batch>('/batches', batch);
    return data;
  },

  // Update existing batch
  update: async (batchId: string, batch: UpsertBatchRequest): Promise<Batch> => {
    const { data } = await apiClient.patch<Batch>(`/batches/${batchId}`, batch);
    return data;
  },

  // Delete batch
  delete: async (batchId: string): Promise<void> => {
    await apiClient.delete(`/batches/${batchId}`);
  },

  // Get shelf allocations for a batch
  getAllocations: async (batchId: string): Promise<BatchShelfAllocation[]> => {
    const { data } = await apiClient.get<BatchShelfAllocation[]>(`/batches/${batchId}/shelves`);
    return data;
  },

  // Create shelf allocation for batch
  createAllocation: async (
    batchId: string,
    allocation: UpsertBatchShelfAllocationRequest
  ): Promise<BatchShelfAllocation> => {
    const { data } = await apiClient.post<BatchShelfAllocation>(
      `/batches/${batchId}/shelves`,
      allocation
    );
    return data;
  },

  // Get single allocation
  getAllocationById: async (batchId: string, allocationId: string): Promise<BatchShelfAllocation> => {
    const { data } = await apiClient.get<BatchShelfAllocation>(
      `/batches/${batchId}/shelves/${allocationId}`
    );
    return data;
  },

  // Update allocation
  updateAllocation: async (
    batchId: string,
    allocationId: string,
    allocation: UpsertBatchShelfAllocationRequest
  ): Promise<BatchShelfAllocation> => {
    const { data } = await apiClient.patch<BatchShelfAllocation>(
      `/batches/${batchId}/shelves/${allocationId}`,
      allocation
    );
    return data;
  },

  // Delete allocation
  deleteAllocation: async (batchId: string, allocationId: string): Promise<void> => {
    await apiClient.delete(`/batches/${batchId}/shelves/${allocationId}`);
  },
};
