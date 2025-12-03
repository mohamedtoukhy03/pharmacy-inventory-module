/**
 * Centralized error handling utilities
 * Provides user-friendly error messages and safe error logging
 */

import { AxiosError } from 'axios';
import { ValidationError } from '../validation/schemas';

export interface ErrorResponse {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
  timestamp?: string;
}

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  // Validation errors
  if (error instanceof ValidationError) {
    if (error.errors) {
      const firstError = Object.values(error.errors)[0];
      return firstError || error.message;
    }
    return error.message;
  }

  // Axios errors (backend responses)
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Backend sent structured error
    if (data?.message) {
      return data.message;
    }

    // Handle by status code
    switch (status) {
      case 400:
        return 'البيانات المدخلة غير صحيحة. الرجاء التحقق من جميع الحقول';
      case 401:
        return 'يجب تسجيل الدخول للمتابعة';
      case 403:
        return 'ليس لديك صلاحية للقيام بهذا الإجراء';
      case 404:
        return 'العنصر المطلوب غير موجود';
      case 409:
        return data?.message || 'تعارض في البيانات. لا يمكن إتمام العملية';
      case 422:
        return 'البيانات المدخلة غير صالحة';
      case 500:
        return 'خطأ في الخادم. الرجاء المحاولة مرة أخرى لاحقاً';
      case 503:
        return 'الخدمة غير متوفرة حالياً. الرجاء المحاولة لاحقاً';
      default:
        if (!error.response) {
          return 'فشل الاتصال بالخادم. تحقق من اتصال الإنترنت';
        }
        return 'حدث خطأ غير متوقع';
    }
  }

  // Generic Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error type
  return 'حدث خطأ غير متوقع';
};

/**
 * Parse backend validation errors into field-level errors
 */
export const parseFieldErrors = (error: unknown): Record<string, string> | undefined => {
  // Frontend validation errors
  if (error instanceof ValidationError && error.errors) {
    return error.errors;
  }

  // Backend validation errors (400 responses)
  if (error instanceof AxiosError && error.response?.status === 400) {
    const data = error.response.data;
    
    // Spring Boot style field errors
    if (data?.fieldErrors && Array.isArray(data.fieldErrors)) {
      return data.fieldErrors.reduce((acc: Record<string, string>, err: any) => {
        if (err.field && err.message) {
          acc[err.field] = err.message;
        }
        return acc;
      }, {});
    }

    // Simple key-value errors
    if (data?.errors && typeof data.errors === 'object') {
      return data.errors;
    }
  }

  return undefined;
};

/**
 * Get HTTP status code from error
 */
export const getErrorStatus = (error: unknown): number | undefined => {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  return undefined;
};

/**
 * Check if error is a conflict error (409)
 */
export const isConflictError = (error: unknown): boolean => {
  return getErrorStatus(error) === 409;
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error: unknown): boolean => {
  return error instanceof ValidationError || getErrorStatus(error) === 400;
};

/**
 * Check if error is a not found error (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  return getErrorStatus(error) === 404;
};

/**
 * Check if error is an authorization error (401/403)
 */
export const isAuthError = (error: unknown): boolean => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

/**
 * Safe error logging (doesn't log sensitive data)
 */
export const logError = (error: unknown, context?: string): void => {
  const prefix = context ? `[${context}]` : '';
  
  if (error instanceof ValidationError) {
    console.warn(`${prefix} Validation Error:`, error.message, error.errors);
    return;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    
    console.error(`${prefix} API Error:`, {
      method,
      url,
      status,
      message: getErrorMessage(error),
    });
    return;
  }

  if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message);
    return;
  }

  console.error(`${prefix} Unknown Error:`, error);
};

/**
 * Create a structured error response
 */
export const createErrorResponse = (error: unknown): ErrorResponse => {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    fieldErrors: parseFieldErrors(error),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Safe API call wrapper with automatic error handling
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: ErrorResponse }> => {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    logError(error, context);
    return { error: createErrorResponse(error) };
  }
};

/**
 * Retry logic for safe idempotent operations
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      const status = getErrorStatus(error);
      if (status && status >= 400 && status < 500) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};
