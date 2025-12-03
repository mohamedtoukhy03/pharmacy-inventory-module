import apiClient from './client';
import type {
  Category,
  UpsertCategoryRequest,
  CategoryFilters,
} from './types';

export const categoriesApi = {
  // Get all categories with optional name filter
  getAll: async (filters?: CategoryFilters): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories', {
      params: filters,
    });
    return data;
  },

  // Get single category by ID
  getById: async (categoryId: string): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${categoryId}`);
    return data;
  },

  // Create new category
  create: async (category: UpsertCategoryRequest): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categories', category);
    return data;
  },

  // Update existing category
  update: async (categoryId: string, category: UpsertCategoryRequest): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categories/${categoryId}`, category);
    return data;
  },

  // Delete category
  delete: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`);
  },
};
