import apiClient from './client';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedResponse,
  ProductFilters,
  CategorySummary,
  ProductIngredient,
  UpsertProductIngredientRequest,
} from './types';

export const productsApi = {
  // Get paginated and filtered products
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return data;
  },

  // Get single product by ID
  getById: async (productId: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${productId}`);
    return data;
  },

  // Create new product
  create: async (product: CreateProductRequest): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/products', product);
    return data;
  },

  // Update existing product
  update: async (productId: string, product: UpdateProductRequest): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/products/${productId}`, product);
    return data;
  },

  // Delete product
  delete: async (productId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
  },

  // Get product categories
  getCategories: async (productId: string): Promise<CategorySummary[]> => {
    const { data } = await apiClient.get<CategorySummary[]>(`/products/${productId}/categories`);
    return data;
  },

  // Add category to product
  addCategory: async (productId: string, categoryId: string): Promise<void> => {
    await apiClient.post(`/products/${productId}/categories`, { categoryId });
  },

  // Remove category from product
  removeCategory: async (productId: string, categoryId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/categories/${categoryId}`);
  },

  // Get product ingredients
  getIngredients: async (productId: string): Promise<ProductIngredient[]> => {
    const { data } = await apiClient.get<ProductIngredient[]>(`/products/${productId}/ingredients`);
    return data;
  },

  // Add or update product ingredient
  addOrUpdateIngredient: async (
    productId: string,
    request: UpsertProductIngredientRequest
  ): Promise<void> => {
    await apiClient.post(`/products/${productId}/ingredients`, request);
  },

  // Update specific ingredient
  updateIngredient: async (
    productId: string,
    ingredientId: string,
    request: UpsertProductIngredientRequest
  ): Promise<void> => {
    await apiClient.patch(`/products/${productId}/ingredients/${ingredientId}`, request);
  },

  // Remove ingredient from product
  removeIngredient: async (productId: string, ingredientId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/ingredients/${ingredientId}`);
  },
};
