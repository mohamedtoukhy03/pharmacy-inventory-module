/**
 * Validation schemas for all API request DTOs
 * Ensures data integrity before sending to backend
 */

import type {
  UpsertBatchRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpsertLocationRequest,
  UpsertBatchShelfAllocationRequest,
  UpsertCategoryRequest,
  UpsertIngredientRequest,
  UpsertStockLevelRequest,
  UpsertMeasurementUnitRequest,
} from '../api/types';

// ============================================
// Validation Helpers
// ============================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Sanitizes and trims string values, returns undefined for empty strings
 */
const sanitizeString = (value: string | undefined | null): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const trimmed = String(value).trim();
  return trimmed === '' ? undefined : trimmed;
};

/**
 * Validates and converts to positive integer
 */
const validatePositiveInt = (value: any, fieldName: string): number => {
  const num = Number(value);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    throw new ValidationError(`${fieldName} must be a positive integer`, fieldName);
  }
  return num;
};

/**
 * Validates and converts to non-negative number
 */
const validateNonNegativeNumber = (value: any, fieldName: string): number => {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative number`, fieldName);
  }
  return num;
};

/**
 * Validates ISO date string
 */
const validateISODate = (value: string | undefined, fieldName: string, required = true): string | undefined => {
  if (!value) {
    if (required) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return undefined;
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`, fieldName);
  }
  
  // Return ISO format YYYY-MM-DD
  return value.split('T')[0];
};

/**
 * Validates required string field
 */
const validateRequiredString = (value: any, fieldName: string, minLength = 1): string => {
  const sanitized = sanitizeString(value);
  if (!sanitized || sanitized.length < minLength) {
    throw new ValidationError(
      `${fieldName} is required and must be at least ${minLength} character(s)`,
      fieldName
    );
  }
  return sanitized;
};

/**
 * Validates ID format (numeric or UUID)
 */
const validateId = (value: any, fieldName: string): string => {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  
  // Accept numeric IDs or UUIDs
  const isNumeric = /^\d+$/.test(sanitized);
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sanitized);
  
  if (!isNumeric && !isUUID) {
    throw new ValidationError(`${fieldName} must be a valid ID`, fieldName);
  }
  
  return sanitized;
};

/**
 * Validates enum value
 */
const validateEnum = <T extends string>(
  value: any,
  fieldName: string,
  validValues: readonly T[],
  required = true
): T | undefined => {
  if (!value) {
    if (required) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return undefined;
  }
  
  if (!validValues.includes(value as T)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${validValues.join(', ')}`,
      fieldName
    );
  }
  
  return value as T;
};

/**
 * Removes undefined/null values from object
 */
const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

// ============================================
// Batch Validation
// ============================================

export const validateBatchRequest = (data: Partial<UpsertBatchRequest>): UpsertBatchRequest => {
  const errors: Record<string, string> = {};

  try {
    const productId = validateId(data.productId, 'Product');
    const locationId = validateId(data.locationId, 'Location');
    const batchCode = validateRequiredString(data.batchCode, 'Batch Code', 1);
    const receivedQty = validatePositiveInt(data.receivedQty, 'Received Quantity');
    const unitPrice = validateNonNegativeNumber(data.unitPrice, 'Unit Price');
    const expiryDate = validateISODate(data.expiryDate, 'Expiry Date', true)!;
    
    // Optional fields
    const supplierId = data.supplierId ? validateId(data.supplierId, 'Supplier') : undefined;
    const manufactureDate = validateISODate(data.manufactureDate, 'Manufacture Date', false);
    const receiptDate = validateISODate(data.receiptDate, 'Receipt Date', false);
    
    // Validate stockType enum
    const validStockTypes = ['store', 'warehouse', 'pharmacy'] as const;
    const stockType = validateEnum(data.stockType, 'Stock Type', validStockTypes, false) || 'store';

    // Date validation: manufacture < expiry
    if (manufactureDate && expiryDate && new Date(manufactureDate) >= new Date(expiryDate)) {
      errors.manufactureDate = 'Manufacture date must be before expiry date';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed', undefined, errors);
    }

    return cleanObject({
      productId,
      locationId,
      supplierId,
      batchCode,
      receivedQty,
      unitPrice,
      manufactureDate,
      expiryDate,
      receiptDate,
      stockType,
    }) as UpsertBatchRequest;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid batch data');
  }
};

// ============================================
// Product Validation
// ============================================

export const validateCreateProductRequest = (data: Partial<CreateProductRequest>): CreateProductRequest => {
  const name = validateRequiredString(data.name, 'Product Name', 2);
  const price = validateNonNegativeNumber(data.price, 'Price');
  
  // Optional fields
  const barcode = sanitizeString(data.barcode);
  const sku = sanitizeString(data.sku);
  const genericName = sanitizeString(data.genericName);
  const description = sanitizeString(data.description);
  const concentration = sanitizeString(data.concentration);
  const measurementUnitId = data.measurementUnitId ? validateId(data.measurementUnitId, 'Measurement Unit') : undefined;
  const categoryId = data.categoryId ? validateId(data.categoryId, 'Category') : undefined;
  const supplierId = data.supplierId ? validateId(data.supplierId, 'Supplier') : undefined;
  
  const isDrug = Boolean(data.isDrug);
  const isControlled = Boolean(data.isControlled);
  
  const reorderQty = data.reorderQty ? validatePositiveInt(data.reorderQty, 'Reorder Quantity') : undefined;
  const minStock = data.minStock ? validateNonNegativeNumber(data.minStock, 'Minimum Stock') : undefined;
  const minCycleStock = data.minCycleStock ? validateNonNegativeNumber(data.minCycleStock, 'Min Cycle Stock') : undefined;

  return cleanObject({
    name,
    price,
    barcode,
    sku,
    genericName,
    description,
    concentration,
    measurementUnitId,
    categoryId,
    supplierId,
    isDrug,
    isControlled,
    reorderQty,
    minStock,
    minCycleStock,
  }) as CreateProductRequest;
};

export const validateUpdateProductRequest = (data: Partial<UpdateProductRequest>): UpdateProductRequest => {
  // For updates, at least one field must be present
  if (Object.keys(data).length === 0) {
    throw new ValidationError('At least one field must be updated');
  }
  
  const updates: Partial<UpdateProductRequest> = {};
  
  if (data.name !== undefined) updates.name = validateRequiredString(data.name, 'Product Name', 2);
  if (data.price !== undefined) updates.price = validateNonNegativeNumber(data.price, 'Price');
  if (data.barcode !== undefined) updates.barcode = sanitizeString(data.barcode);
  if (data.sku !== undefined) updates.sku = sanitizeString(data.sku);
  if (data.genericName !== undefined) updates.genericName = sanitizeString(data.genericName);
  if (data.description !== undefined) updates.description = sanitizeString(data.description);
  if (data.concentration !== undefined) updates.concentration = sanitizeString(data.concentration);
  if (data.measurementUnitId !== undefined) updates.measurementUnitId = data.measurementUnitId ? validateId(data.measurementUnitId, 'Measurement Unit') : undefined;
  if (data.categoryId !== undefined) updates.categoryId = data.categoryId ? validateId(data.categoryId, 'Category') : undefined;
  if (data.supplierId !== undefined) updates.supplierId = data.supplierId ? validateId(data.supplierId, 'Supplier') : undefined;
  if (data.isDrug !== undefined) updates.isDrug = Boolean(data.isDrug);
  if (data.isControlled !== undefined) updates.isControlled = Boolean(data.isControlled);
  if (data.reorderQty !== undefined) updates.reorderQty = data.reorderQty ? validatePositiveInt(data.reorderQty, 'Reorder Quantity') : undefined;
  if (data.minStock !== undefined) updates.minStock = data.minStock ? validateNonNegativeNumber(data.minStock, 'Minimum Stock') : undefined;
  if (data.minCycleStock !== undefined) updates.minCycleStock = data.minCycleStock ? validateNonNegativeNumber(data.minCycleStock, 'Min Cycle Stock') : undefined;

  return cleanObject(updates) as UpdateProductRequest;
};

// ============================================
// Location Validation
// ============================================

export const validateLocationRequest = (data: Partial<UpsertLocationRequest>): UpsertLocationRequest => {
  const name = validateRequiredString(data.name, 'Location Name', 2);
  
  const validTypes = ['warehouse', 'branch', 'external', 'clinic'] as const;
  const type = validateEnum(data.type, 'Location Type', validTypes, true)!;
  
  const validStatuses = ['active', 'inactive', 'suspended'] as const;
  const status = validateEnum(data.status, 'Location Status', validStatuses, false) || 'active';
  
  const address = sanitizeString(data.address);
  const parentId = data.parentId ? validateId(data.parentId, 'Parent Location') : undefined;
  const isPrimary = data.isPrimary !== undefined ? Boolean(data.isPrimary) : undefined;

  return cleanObject({
    name,
    type,
    status,
    address,
    parentId,
    isPrimary,
  }) as UpsertLocationRequest;
};

// ============================================
// Shelf Allocation Validation
// ============================================

export const validateShelfAllocationRequest = (
  data: Partial<UpsertBatchShelfAllocationRequest>
): UpsertBatchShelfAllocationRequest => {
  const shelfId = validateId(data.shelfId, 'Shelf');
  const allocatedQty = validatePositiveInt(data.allocatedQty, 'Allocated Quantity');

  return { shelfId, allocatedQty };
};

// ============================================
// Other Entity Validations
// ============================================

export const validateCategoryRequest = (data: Partial<UpsertCategoryRequest>): UpsertCategoryRequest => {
  const name = validateRequiredString(data.name, 'Category Name', 2);
  const description = sanitizeString(data.description);
  
  return cleanObject({ name, description }) as UpsertCategoryRequest;
};

export const validateIngredientRequest = (data: Partial<UpsertIngredientRequest>): UpsertIngredientRequest => {
  const name = validateRequiredString(data.name, 'Ingredient Name', 2);
  const description = sanitizeString(data.description);
  const active = data.active !== undefined ? Boolean(data.active) : true;
  const defaultMeasurementUnitId = data.defaultMeasurementUnitId 
    ? validateId(data.defaultMeasurementUnitId, 'Measurement Unit') 
    : undefined;

  return cleanObject({ name, description, active, defaultMeasurementUnitId }) as UpsertIngredientRequest;
};

export const validateProductIngredientRequest = (
  data: Partial<any>
): any => {
  const ingredientId = validateId(data.ingredientId, 'Ingredient');
  const qty = validateNonNegativeNumber(data.quantity || data.qty, 'Quantity');
  const measurementUnitId = data.measurementUnitId 
    ? validateId(data.measurementUnitId, 'Measurement Unit') 
    : undefined;
  const active = data.active !== undefined ? Boolean(data.active) : true;

  return cleanObject({ ingredientId, quantity: qty, measurementUnitId, active });
};

export const validateStockLevelRequest = (data: Partial<UpsertStockLevelRequest>): UpsertStockLevelRequest => {
  const productId = validateId(data.productId, 'Product');
  const locationId = validateId(data.locationId, 'Location');
  const stockType = validateRequiredString(data.stockType, 'Stock Type', 1);
  const currentQty = validateNonNegativeNumber(data.currentQty, 'Quantity');
  
  const batchId = data.batchId ? validateId(data.batchId, 'Batch') : undefined;
  const shelfId = data.shelfId ? validateId(data.shelfId, 'Shelf') : undefined;
  const validMethods = ['FEFO', 'FIFO', 'Manual'] as const;
  const dispenseMethod = validateEnum(data.dispenseMethod, 'Dispense Method', validMethods, false);

  return cleanObject({ productId, batchId, locationId, shelfId, stockType, currentQty, dispenseMethod }) as UpsertStockLevelRequest;
};

export const validateSupplierRequest = (data: Partial<any>): any => {
  const name = validateRequiredString(data.name, 'Supplier Name', 2);
  const contactName = sanitizeString(data.contactName || data.contactPerson);
  const phoneNumber = sanitizeString(data.phoneNumber || data.phone);
  const emailAddress = sanitizeString(data.emailAddress || data.email);
  const address = sanitizeString(data.address);
  const country = sanitizeString(data.country);
  
  const validStatuses = ['active', 'inactive', 'suspended'] as const;
  const status = validateEnum(data.status, 'Status', validStatuses, false) || 'active';

  // Email validation if provided
  if (emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
    throw new ValidationError('Invalid email format', 'email');
  }

  return cleanObject({ name, contactName, phoneNumber, emailAddress, address, country, status });
};

export const validateMeasurementUnitRequest = (
  data: Partial<UpsertMeasurementUnitRequest>
): UpsertMeasurementUnitRequest => {
  const name = validateRequiredString(data.name, 'Unit Name', 1);
  const code = validateRequiredString(data.code, 'Code', 1);
  const description = sanitizeString(data.description);
  const conversionFactor = data.conversionFactor ? validateNonNegativeNumber(data.conversionFactor, 'Conversion Factor') : undefined;
  const isBaseUnit = data.isBaseUnit !== undefined ? Boolean(data.isBaseUnit) : undefined;

  return cleanObject({ name, code, description, conversionFactor, isBaseUnit }) as UpsertMeasurementUnitRequest;
};

// ============================================
// Query Parameter Validation
// ============================================

export const validateQueryParams = (params: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    // Skip undefined/null/empty
    if (value === undefined || value === null || value === '') continue;

    // Validate pagination params
    if (key === 'page') {
      cleaned.page = Math.max(0, parseInt(String(value)) || 0);
    } else if (key === 'pageSize') {
      const size = parseInt(String(value)) || 25;
      cleaned.pageSize = Math.min(Math.max(1, size), 100); // Clamp between 1-100
    } else if (key === 'sortDir') {
      cleaned.sortDir = value === 'desc' ? 'desc' : 'asc';
    } else if (typeof value === 'string') {
      cleaned[key] = sanitizeString(value);
    } else if (typeof value === 'boolean') {
      cleaned[key] = value;
    } else if (typeof value === 'number') {
      cleaned[key] = value;
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
};
