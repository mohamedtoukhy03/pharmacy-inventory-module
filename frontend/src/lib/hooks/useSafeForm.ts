/**
 * Custom React hooks for safe form handling with validation
 */

import { useState, useCallback } from 'react';
import { ValidationError } from '../validation/schemas';
import { getErrorMessage, parseFieldErrors, logError } from '../utils/error-handler';

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface UseFormOptions<T, R = void> {
  initialData: T;
  validate: (data: T) => T; // Validation function that throws ValidationError
  onSubmit: (validatedData: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onError?: (error: unknown) => void;
}

/**
 * Safe form hook with built-in validation and error handling
 */
export function useSafeForm<T extends Record<string, any>, R = void>({
  initialData,
  validate,
  onSubmit,
  onSuccess,
  onError,
}: UseFormOptions<T, R>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Update field value
  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
    // Clear global error
    if (globalError) setGlobalError(null);
  }, [errors, globalError]);

  // Update multiple fields
  const updateFields = useCallback((updates: Partial<T>) => {
    setData(prev => ({ ...prev, ...updates }));
    setErrors({});
    setGlobalError(null);
  }, []);

  // Reset form to initial state
  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setGlobalError(null);
    setIsSubmitting(false);
  }, [initialData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setIsSubmitting(true);
    setErrors({});
    setGlobalError(null);

    try {
      // Client-side validation
      const validatedData = validate(data);
      
      // Submit to backend
      const result = await onSubmit(validatedData);
      
      // Success callback
      onSuccess?.(result);
      
      return { success: true, data: result };
    } catch (error) {
      logError(error, 'Form Submission');
      
      // Handle validation errors (field-level)
      const fieldErrors = parseFieldErrors(error);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        // Show global error if no field-level errors
        setGlobalError(getErrorMessage(error));
      }
      
      // Error callback
      onError?.(error);
      
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validate, onSubmit, onSuccess, onError]);

  // Validate without submitting
  const validateForm = useCallback((): boolean => {
    try {
      validate(data);
      setErrors({});
      setGlobalError(null);
      return true;
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        setErrors(error.errors);
      } else {
        setGlobalError(getErrorMessage(error));
      }
      return false;
    }
  }, [data, validate]);

  return {
    data,
    errors,
    globalError,
    isSubmitting,
    isValid: Object.keys(errors).length === 0 && !globalError,
    updateField,
    updateFields,
    reset,
    handleSubmit,
    validateForm,
  };
}

/**
 * Hook for safe API calls with loading and error states
 */
export function useSafeApiCall<T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, apiFunction.name);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
}

/**
 * Hook for handling delete operations with confirmation
 */
export function useSafeDelete<T>(
  deleteFunction: (id: string) => Promise<T>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    confirmMessage?: string;
  }
) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string, skipConfirm = false) => {
    // Validate ID
    if (!id || id.trim() === '') {
      setError('معرف العنصر مطلوب');
      return { success: false, error: 'معرف العنصر مطلوب' };
    }

    // Confirmation
    if (!skipConfirm) {
      const confirmMsg = options?.confirmMessage || 'هل أنت متأكد من الحذف؟';
      if (!window.confirm(confirmMsg)) {
        return { success: false, cancelled: true };
      }
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteFunction(id);
      options?.onSuccess?.();
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'Delete Operation');
      options?.onError?.(err);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  }, [deleteFunction, options]);

  return {
    handleDelete,
    isDeleting,
    error,
  };
}

/**
 * Hook for debounced input with validation
 */
export function useDebouncedValidation<T>(
  value: T,
  validate: (value: T) => boolean | string,
  delayMs = 500
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useState(() => {
    if (!value) {
      setError(null);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      try {
        const result = validate(value);
        if (typeof result === 'string') {
          setError(result);
        } else if (!result) {
          setError('قيمة غير صالحة');
        } else {
          setError(null);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsValidating(false);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  });

  return { error, isValidating };
}
