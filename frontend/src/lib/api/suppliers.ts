import apiClient from './client';
import type {
  Supplier,
  UpsertSupplierRequest,
  SupplierFilters,
} from './types';

export const suppliersApi = {
  // Get all suppliers with optional filters
  getAll: async (filters?: SupplierFilters): Promise<Supplier[]> => {
    const { data } = await apiClient.get<Supplier[]>('/suppliers', {
      params: filters,
    });
    return data;
  },

  // Get single supplier by ID
  getById: async (supplierId: string): Promise<Supplier> => {
    const { data } = await apiClient.get<Supplier>(`/suppliers/${supplierId}`);
    return data;
  },

  // Create new supplier
  create: async (supplier: UpsertSupplierRequest): Promise<Supplier> => {
    const { data } = await apiClient.post<Supplier>('/suppliers', supplier);
    return data;
  },

  // Update existing supplier
  update: async (supplierId: string, supplier: UpsertSupplierRequest): Promise<Supplier> => {
    const { data } = await apiClient.patch<Supplier>(`/suppliers/${supplierId}`, supplier);
    return data;
  },

  // Delete supplier
  delete: async (supplierId: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${supplierId}`);
  },
};
