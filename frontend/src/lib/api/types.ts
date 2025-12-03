// Common types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
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
  genericName?: string;
  description?: string;
  concentration?: string;
  price: number;
  measurementUnitId?: string;
  measurementUnitName?: string;
  categoryId?: string;
  categoryName?: string;
  supplierId?: string;
  supplierName?: string;
  companyName?: string;
  isDrug: boolean;
  isControlled: boolean;
  reorderQty?: number;
  minStock?: number;
  minCycleStock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  barcode?: string;
  sku?: string;
  genericName?: string;
  description?: string;
  concentration?: string;
  price: number;
  measurementUnitId?: string;
  categoryId?: string;
  supplierId?: string;
  isDrug?: boolean;
  isControlled?: boolean;
  reorderQty?: number;
  minStock?: number;
  minCycleStock?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

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
  name: string;
  quantity: number;
  measurementUnitId?: string;
  measurementUnitName?: string;
  isActive: boolean;
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
  name: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  address?: string;
  country?: string;
  currencyCode?: string;
  status?: 'active' | 'inactive' | 'suspended';
  rating?: number;
  ordersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertSupplierRequest {
  name: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  address?: string;
  country?: string;
  currencyCode?: string;
  status?: 'active' | 'inactive' | 'suspended';
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
export type LocationType = 'branch' | 'warehouse' | 'external' | 'clinic';
export type LocationStatus = 'active' | 'inactive' | 'suspended';

export interface Location {
  id: string;
  name: string;
  status: LocationStatus;
  type: LocationType;
  address?: string;
  isPrimary?: boolean;
  parentId?: string;
  shelfCount?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertLocationRequest {
  name: string;
  status: LocationStatus;
  type: LocationType;
  address?: string;
  isPrimary?: boolean;
  parentId?: string;
}

// Shelf types
export interface Shelf {
  id: string;
  locationId: string;
  code: string;
  capacity?: number;
}

export interface UpsertShelfRequest {
  code: string;
  capacity?: number;
}

// Batch types
export type StockType = 'store' | 'pharmacy' | 'quarantine' | 'external';

export interface Batch {
  id: string;
  productId: string;
  productName?: string;
  locationId: string;
  locationName?: string;
  supplierId?: string;
  batchCode: string;
  receivedQty: number;
  unitPrice: number;
  manufactureDate?: string;
  expiryDate: string;
  receiptDate?: string;
  stockType?: StockType;
  status?: 'available' | 'expired' | 'nearExpiry';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertBatchRequest {
  productId: string;
  locationId: string;
  supplierId?: string;
  batchCode: string;
  receivedQty: number;
  unitPrice: number;
  manufactureDate?: string;
  expiryDate: string;
  receiptDate?: string;
  stockType?: StockType;
}

// Batch Shelf Allocation types
export interface BatchShelfAllocation {
  id: string;
  batchId: string;
  shelfId: string;
  allocatedQty: number;
}

export interface UpsertBatchShelfAllocationRequest {
  shelfId: string;
  allocatedQty: number;
}

// Stock Level types
export type DispenseMethod = 'FEFO' | 'FIFO' | 'Manual';

export interface StockLevel {
  id: string;
  productId: string;
  productName?: string;
  batchId?: string;
  locationId: string;
  locationName?: string;
  shelfId?: string;
  stockType: string;
  currentQty: number;
  dispenseMethod?: DispenseMethod;
  status?: 'normal' | 'low' | 'critical';
  reorderQty?: number;
  updatedAt?: string;
}

export interface UpsertStockLevelRequest {
  productId: string;
  batchId?: string;
  locationId: string;
  shelfId?: string;
  stockType: string;
  currentQty: number;
  dispenseMethod?: DispenseMethod;
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
  isControlled?: boolean;
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
