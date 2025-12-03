// Common types
export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  // Convenience properties for backward compatibility
  data?: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// Product types
export interface Product {
  id: string;
  name: string;
  barcode?: string;
  sku?: string;
  scientificName?: string;
  description?: string;
  strength?: string;
  manufacturer?: string;
  primaryCategory?: string;
  cost?: number;
  sellingPrice: number;
  measurementUnit?: string;
  measurementUnitId?: string;
  isDrug: boolean;
  controlledSubstance: boolean;
  reorderQty?: number;
  minSafetyStock?: number;
  minCyclicStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  barcode?: string;
  sku?: string;
  scientificName?: string;
  description?: string;
  cost?: number;
  sellingPrice?: number;
  measurementUnitId?: string;
  isDrug?: boolean;
  controlledSubstance?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
}

export interface UpsertCategoryRequest {
  name: string;
  description?: string;
}

// Ingredient types
export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  defaultMeasurementUnitId?: string;
  defaultMeasurementUnitName?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductIngredient {
  ingredientId: string;
  ingredientName: string;
  amount: number;
}

export interface UpsertIngredientRequest {
  name: string;
  description?: string;
  active?: boolean;
  defaultMeasurementUnitId?: string;
}

export interface UpsertProductIngredientRequest {
  ingredientId: string;
  amount: number;
}

// Supplier types
export interface Supplier {
  id: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  country?: string;
  currency?: string;
  activeStatus?: 'active' | 'inactive';
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertSupplierRequest {
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  country?: string;
  rating?: number;
  currency?: string;
  activeStatus?: 'active' | 'inactive';
}

// Measurement Unit types
export interface MeasurementUnit {
  id: string;
  name: string;
  code: string;
  conversionFactor?: number;
  isBaseUnit?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertMeasurementUnitRequest {
  name: string;
  code: string;
  conversionFactor?: number;
  isBaseUnit?: boolean;
  description?: string;
}

// Location types
export type LocationType = 'branch' | 'warehouse' | 'external' | 'supplier' | 'quarantine' | 'clinic';
export type LocationStatus = 'active' | 'inactive';

export interface Location {
  id: string;
  locationName: string;
  locationType: LocationType;
  parentLocationId?: string;
  parentLocationName?: string;
  isDirectToMain?: boolean;
  address?: string;
  status: LocationStatus;
  shelfCount?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertLocationRequest {
  locationName: string;
  locationType: LocationType;
  parentLocationId?: number | null;
  isDirectToMain?: boolean;
  address?: string;
  status: LocationStatus;
}

// Shelf types
export interface Shelf {
  id: string;
  locationId: string;
  onHandQty?: number;
  dispatchMethod?: string;
}

export interface UpsertShelfRequest {
  locationId: number;
  onHandQty?: number;
  dispatchMethod?: string;
}

// Batch types
export type StockType = 'available' | 'near_expiry' | 'removed' | 'expired' | 'disposed' | 'damaged' | 'quarantined';

export interface Batch {
  id: string;
  productId: string;
  productName?: string;
  locationId: string;
  locationName?: string;
  supplierId?: string;
  batchNumber: string;
  quantity: number;
  cost?: number;
  manufacturingDate?: string;
  expiryDate: string;
  receivingDate?: string;
  alertDate?: string;
  clearanceDate?: string;
  stockType?: StockType;
  parentBatchId?: string;
  status?: 'available' | 'expired' | 'nearExpiry';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertBatchRequest {
  productId: number;
  locationId: number;
  stockType?: StockType;
  quantity: number;
  batchNumber?: string;
  cost?: number;
  supplierId?: number;
  manufacturingDate?: string;
  expiryDate: string;
  receivingDate?: string;
  alertDate?: string;
  clearanceDate?: string;
  parentBatchId?: number;
}

// Batch Shelf Allocation types
export interface BatchShelfAllocation {
  id: string;
  batchId: string;
  shelfId: string;
  allocatedQty: number;
}

export interface UpsertBatchShelfAllocationRequest {
  shelfId: number;
  quantity: number;
  threshold?: number;
}

// Stock Level types
export type DispenseMethod = 'FEFO' | 'FIFO' | 'Manual';

export interface StockLevel {
  id: string;
  productId: string;
  productName?: string;
  locationId: string;
  locationName?: string;
  stockType: string;
  onHandQuantity: number;
  dispatchMethod?: string;
  status?: 'normal' | 'low' | 'critical';
  reorderQty?: number;
  updatedAt?: string;
}

export interface UpsertStockLevelRequest {
  productId: number;
  locationId: number;
  stockType?: string;
  onHandQuantity: number;
  dispatchMethod?: string;
}

// Query parameter types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ProductFilters extends PaginationParams, SortParams {
  filter?: string;
  search?: string;
  categoryId?: string;
  isDrug?: boolean;
  controlledSubstance?: boolean;
  supplierId?: string;
}

export interface BatchFilters extends PaginationParams, SortParams {
  search?: string;
  productId?: string;
  locationId?: string;
  stockType?: StockType;
  expiryBefore?: string;
  status?: string;
  nearExpiry?: boolean;
  expired?: boolean;
}

export interface StockLevelFilters extends PaginationParams, SortParams {
  search?: string;
  productId?: string;
  locationId?: string;
  stockType?: string;
  needsReorder?: boolean;
}

export interface CategoryFilters {
  name?: string;
}

export interface IngredientFilters extends PaginationParams, SortParams {
  name?: string;
  active?: boolean;
}

export interface SupplierFilters extends PaginationParams, SortParams {
  name?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface LocationFilters extends PaginationParams, SortParams {
  name?: string;
  type?: LocationType;
  status?: LocationStatus;
}
