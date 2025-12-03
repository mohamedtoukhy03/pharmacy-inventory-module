import apiClient from './client';
import type {
  Ingredient,
  UpsertIngredientRequest,
  PaginatedResponse,
  IngredientFilters,
} from './types';

export const ingredientsApi = {
  // Get all ingredients with optional filters
  getAll: async (filters?: IngredientFilters): Promise<Ingredient[]> => {
    const { data } = await apiClient.get<Ingredient[]>('/ingredients', {
      params: filters,
    });
    return data;
  },

  // Get single ingredient by ID
  getById: async (ingredientId: string): Promise<Ingredient> => {
    const { data } = await apiClient.get<Ingredient>(`/ingredients/${ingredientId}`);
    return data;
  },

  // Create new ingredient
  create: async (ingredient: UpsertIngredientRequest): Promise<Ingredient> => {
    const { data } = await apiClient.post<Ingredient>('/ingredients', ingredient);
    return data;
  },

  // Update existing ingredient
  update: async (ingredientId: string, ingredient: UpsertIngredientRequest): Promise<Ingredient> => {
    const { data } = await apiClient.patch<Ingredient>(`/ingredients/${ingredientId}`, ingredient);
    return data;
  },

  // Delete ingredient
  delete: async (ingredientId: string): Promise<void> => {
    await apiClient.delete(`/ingredients/${ingredientId}`);
  },
};
