/**
 * Safe API wrappers with automatic validation and error handling
 * These wrappers ensure all data is validated before reaching the backend
 */

import { batchesApi } from '../api/batches';
import { productsApi } from '../api/products';
import { locationsApi } from '../api/locations';
import { categoriesApi } from '../api/categories';
import { ingredientsApi } from '../api/ingredients';
import { suppliersApi } from '../api/suppliers';
import { measurementUnitsApi } from '../api/measurement-units';
import { stockLevelsApi } from '../api/stock-levels';

import {
  validateBatchRequest,
  validateCreateProductRequest,
  validateUpdateProductRequest,
  validateLocationRequest,
  validateShelfAllocationRequest,
  validateCategoryRequest,
  validateIngredientRequest,
  validateProductIngredientRequest,
  validateStockLevelRequest,
  validateSupplierRequest,
  validateMeasurementUnitRequest,
  validateQueryParams,
  ValidationError,
} from '../validation/schemas';

import type {
  UpsertBatchRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpsertLocationRequest,
  UpsertBatchShelfAllocationRequest,
  BatchFilters,
  ProductFilters,
  LocationFilters,
  UpsertCategoryRequest,
  UpsertIngredientRequest,
  UpsertProductIngredientRequest,
  UpsertStockLevelRequest,
  UpsertSupplierRequest,
  UpsertMeasurementUnitRequest,
} from '../api/types';

// ============================================
// Batches
// ============================================

export const safeBatchesApi = {
  getAll: async (filters?: BatchFilters) => {
    const cleanFilters = filters ? validateQueryParams(filters) : undefined;
    return batchesApi.getAll(cleanFilters);
  },

  getById: async (batchId: string) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    return batchesApi.getById(batchId);
  },

  create: async (data: Partial<UpsertBatchRequest>) => {
    const validated = validateBatchRequest(data);
    return batchesApi.create(validated);
  },

  update: async (batchId: string, data: Partial<UpsertBatchRequest>) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    const validated = validateBatchRequest(data);
    return batchesApi.update(batchId, validated);
  },

  delete: async (batchId: string) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    return batchesApi.delete(batchId);
  },

  getAllocations: async (batchId: string) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    return batchesApi.getAllocations(batchId);
  },

  createAllocation: async (batchId: string, data: Partial<UpsertBatchShelfAllocationRequest>) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    const validated = validateShelfAllocationRequest(data);
    return batchesApi.createAllocation(batchId, validated);
  },

  deleteAllocation: async (batchId: string, allocationId: string) => {
    if (!batchId || batchId.trim() === '') {
      throw new ValidationError('Batch ID is required');
    }
    if (!allocationId || allocationId.trim() === '') {
      throw new ValidationError('Allocation ID is required');
    }
    return batchesApi.deleteAllocation(batchId, allocationId);
  },
};

// ============================================
// Products
// ============================================

export const safeProductsApi = {
  getAll: async (filters?: ProductFilters) => {
    const cleanFilters = filters ? validateQueryParams(filters) : undefined;
    return productsApi.getAll(cleanFilters);
  },

  getById: async (productId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    return productsApi.getById(productId);
  },

  create: async (data: Partial<CreateProductRequest>) => {
    const validated = validateCreateProductRequest(data);
    return productsApi.create(validated);
  },

  update: async (productId: string, data: Partial<UpdateProductRequest>) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    const validated = validateUpdateProductRequest(data);
    return productsApi.update(productId, validated);
  },

  delete: async (productId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    return productsApi.delete(productId);
  },

  getCategories: async (productId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    return productsApi.getCategories(productId);
  },

  addCategory: async (productId: string, categoryId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('Category ID is required');
    }
    return productsApi.addCategory(productId, categoryId);
  },

  removeCategory: async (productId: string, categoryId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('Category ID is required');
    }
    return productsApi.removeCategory(productId, categoryId);
  },

  getIngredients: async (productId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    return productsApi.getIngredients(productId);
  },

  addOrUpdateIngredient: async (productId: string, data: Partial<UpsertProductIngredientRequest>) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    const validated = validateProductIngredientRequest(data);
    return productsApi.addOrUpdateIngredient(productId, validated);
  },

  removeIngredient: async (productId: string, ingredientId: string) => {
    if (!productId || productId.trim() === '') {
      throw new ValidationError('Product ID is required');
    }
    if (!ingredientId || ingredientId.trim() === '') {
      throw new ValidationError('Ingredient ID is required');
    }
    return productsApi.removeIngredient(productId, ingredientId);
  },
};

// ============================================
// Locations
// ============================================

export const safeLocationsApi = {
  getAll: async (filters?: LocationFilters) => {
    const cleanFilters = filters ? validateQueryParams(filters) : undefined;
    return locationsApi.getAll(cleanFilters);
  },

  getById: async (locationId: string) => {
    if (!locationId || locationId.trim() === '') {
      throw new ValidationError('Location ID is required');
    }
    return locationsApi.getById(locationId);
  },

  create: async (data: Partial<UpsertLocationRequest>) => {
    const validated = validateLocationRequest(data);
    return locationsApi.create(validated);
  },

  update: async (locationId: string, data: Partial<UpsertLocationRequest>) => {
    if (!locationId || locationId.trim() === '') {
      throw new ValidationError('Location ID is required');
    }
    const validated = validateLocationRequest(data);
    return locationsApi.update(locationId, validated);
  },

  delete: async (locationId: string) => {
    if (!locationId || locationId.trim() === '') {
      throw new ValidationError('Location ID is required');
    }
    return locationsApi.delete(locationId);
  },
};

// ============================================
// Stock Levels
// ============================================

export const safeStockLevelsApi = {
  getAll: async (filters?: any) => {
    const cleanFilters = filters ? validateQueryParams(filters) : undefined;
    return stockLevelsApi.getAll(cleanFilters);
  },

  update: async (stockLevelId: string, data: Partial<UpsertStockLevelRequest>) => {
    if (!stockLevelId || stockLevelId.trim() === '') {
      throw new ValidationError('Stock Level ID is required');
    }
    const validated = validateStockLevelRequest(data);
    return stockLevelsApi.update(stockLevelId, validated);
  },
};

// ============================================
// Categories
// ============================================

export const safeCategoriesApi = {
  getAll: async () => {
    return categoriesApi.getAll();
  },

  getById: async (categoryId: string) => {
    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('Category ID is required');
    }
    return categoriesApi.getById(categoryId);
  },

  create: async (data: Partial<UpsertCategoryRequest>) => {
    const validated = validateCategoryRequest(data);
    return categoriesApi.create(validated);
  },

  update: async (categoryId: string, data: Partial<UpsertCategoryRequest>) => {
    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('Category ID is required');
    }
    const validated = validateCategoryRequest(data);
    return categoriesApi.update(categoryId, validated);
  },

  delete: async (categoryId: string) => {
    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('Category ID is required');
    }
    return categoriesApi.delete(categoryId);
  },
};

// ============================================
// Ingredients
// ============================================

export const safeIngredientsApi = {
  getAll: async (filters?: any) => {
    const cleanFilters = filters ? validateQueryParams(filters) : undefined;
    return ingredientsApi.getAll(cleanFilters);
  },

  getById: async (ingredientId: string) => {
    if (!ingredientId || ingredientId.trim() === '') {
      throw new ValidationError('Ingredient ID is required');
    }
    return ingredientsApi.getById(ingredientId);
  },

  create: async (data: Partial<UpsertIngredientRequest>) => {
    const validated = validateIngredientRequest(data);
    return ingredientsApi.create(validated);
  },

  update: async (ingredientId: string, data: Partial<UpsertIngredientRequest>) => {
    if (!ingredientId || ingredientId.trim() === '') {
      throw new ValidationError('Ingredient ID is required');
    }
    const validated = validateIngredientRequest(data);
    return ingredientsApi.update(ingredientId, validated);
  },

  delete: async (ingredientId: string) => {
    if (!ingredientId || ingredientId.trim() === '') {
      throw new ValidationError('Ingredient ID is required');
    }
    return ingredientsApi.delete(ingredientId);
  },
};

// ============================================
// Suppliers
// ============================================

export const safeSuppliersApi = {
  getAll: async () => {
    return suppliersApi.getAll();
  },

  getById: async (supplierId: string) => {
    if (!supplierId || supplierId.trim() === '') {
      throw new ValidationError('Supplier ID is required');
    }
    return suppliersApi.getById(supplierId);
  },

  create: async (data: Partial<UpsertSupplierRequest>) => {
    const validated = validateSupplierRequest(data);
    return suppliersApi.create(validated);
  },

  update: async (supplierId: string, data: Partial<UpsertSupplierRequest>) => {
    if (!supplierId || supplierId.trim() === '') {
      throw new ValidationError('Supplier ID is required');
    }
    const validated = validateSupplierRequest(data);
    return suppliersApi.update(supplierId, validated);
  },

  delete: async (supplierId: string) => {
    if (!supplierId || supplierId.trim() === '') {
      throw new ValidationError('Supplier ID is required');
    }
    return suppliersApi.delete(supplierId);
  },
};

// ============================================
// Measurement Units
// ============================================

export const safeMeasurementUnitsApi = {
  getAll: async () => {
    return measurementUnitsApi.getAll();
  },

  getById: async (unitId: string) => {
    if (!unitId || unitId.trim() === '') {
      throw new ValidationError('Unit ID is required');
    }
    return measurementUnitsApi.getById(unitId);
  },

  create: async (data: Partial<UpsertMeasurementUnitRequest>) => {
    const validated = validateMeasurementUnitRequest(data);
    return measurementUnitsApi.create(validated);
  },

  update: async (unitId: string, data: Partial<UpsertMeasurementUnitRequest>) => {
    if (!unitId || unitId.trim() === '') {
      throw new ValidationError('Unit ID is required');
    }
    const validated = validateMeasurementUnitRequest(data);
    return measurementUnitsApi.update(unitId, validated);
  },

  delete: async (unitId: string) => {
    if (!unitId || unitId.trim() === '') {
      throw new ValidationError('Unit ID is required');
    }
    return measurementUnitsApi.delete(unitId);
  },
};
