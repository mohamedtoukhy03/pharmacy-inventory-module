import apiClient from './client';
import type {
  StockLevel,
  UpsertStockLevelRequest,
  StockLevelFilters,
} from './types';

export const stockLevelsApi = {
  // Get all stock levels with optional filters
  getAll: async (filters?: StockLevelFilters): Promise<StockLevel[]> => {
    const { data } = await apiClient.get<StockLevel[]>('/stock-levels', {
      params: filters,
    });
    return data;
  },

  // Get single stock level by ID
  getById: async (id: string): Promise<StockLevel> => {
    const { data } = await apiClient.get<StockLevel>(`/stock-levels/${id}`);
    return data;
  },

  // Create new stock level
  create: async (stockLevel: UpsertStockLevelRequest): Promise<StockLevel> => {
    const { data } = await apiClient.post<StockLevel>('/stock-levels', stockLevel);
    return data;
  },

  // Update existing stock level
  update: async (id: string, stockLevel: UpsertStockLevelRequest): Promise<StockLevel> => {
    const { data } = await apiClient.patch<StockLevel>(`/stock-levels/${id}`, stockLevel);
    return data;
  },

  // Delete stock level
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/stock-levels/${id}`);
  },
};
