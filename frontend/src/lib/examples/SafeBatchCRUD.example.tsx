/**
 * Example implementation of safe CRUD operations
 * This file demonstrates how to use the validation and error handling system
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useSafeForm } from '../hooks/useSafeForm';
import { validateBatchRequest } from '../validation/schemas';
import { useCreateBatch, useUpdateBatch, useDeleteBatch, useBatches } from '../query/batches';
import { getErrorMessage } from '../utils/error-handler';
import type { Batch, UpsertBatchRequest } from '../api/types';

/**
 * Example: Safe Batch Creation Form
 */
export function BatchCreateForm({ onClose }: { onClose: () => void }) {
  const createBatchMutation = useCreateBatch();

  const form = useSafeForm<Partial<UpsertBatchRequest>, Batch>({
    initialData: {
      productId: '',
      locationId: '',
      batchCode: '',
      receivedQty: 0,
      unitPrice: 0,
      expiryDate: '',
      stockType: 'store',
    },
    validate: validateBatchRequest,
    onSubmit: (validatedData) => createBatchMutation.mutateAsync(validatedData as UpsertBatchRequest),
    onSuccess: () => {
      toast.success('تم إنشاء الدفعة بنجاح');
      onClose();
    },
    onError: (error) => {
      // Error already logged and toast shown by useSafeForm
      console.error('Failed to create batch:', error);
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">إنشاء دفعة جديدة</h2>

      {/* Global error (non-field-specific) */}
      {form.globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {form.globalError}
        </div>
      )}

      {/* Product ID */}
      <div>
        <label className="block mb-1">المنتج *</label>
        <input
          type="text"
          value={form.data.productId || ''}
          onChange={(e) => form.updateField('productId', e.target.value)}
          disabled={form.isSubmitting}
          className={`w-full px-3 py-2 border rounded ${
            form.errors.productId ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {form.errors.productId && (
          <span className="text-red-500 text-sm">{form.errors.productId}</span>
        )}
      </div>

      {/* Batch Code */}
      <div>
        <label className="block mb-1">رمز الدفعة *</label>
        <input
          type="text"
          value={form.data.batchCode || ''}
          onChange={(e) => form.updateField('batchCode', e.target.value)}
          disabled={form.isSubmitting}
          className={`w-full px-3 py-2 border rounded ${
            form.errors.batchCode ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {form.errors.batchCode && (
          <span className="text-red-500 text-sm">{form.errors.batchCode}</span>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-1">الكمية *</label>
        <input
          type="number"
          value={form.data.receivedQty || ''}
          onChange={(e) => form.updateField('receivedQty', e.target.value)}
          disabled={form.isSubmitting}
          className={`w-full px-3 py-2 border rounded ${
            form.errors.receivedQty ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {form.errors.receivedQty && (
          <span className="text-red-500 text-sm">{form.errors.receivedQty}</span>
        )}
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block mb-1">تاريخ الانتهاء *</label>
        <input
          type="date"
          value={form.data.expiryDate || ''}
          onChange={(e) => form.updateField('expiryDate', e.target.value)}
          disabled={form.isSubmitting}
          className={`w-full px-3 py-2 border rounded ${
            form.errors.expiryDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {form.errors.expiryDate && (
          <span className="text-red-500 text-sm">{form.errors.expiryDate}</span>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={form.isSubmitting}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={form.isSubmitting || !form.isValid}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {form.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>
    </form>
  );
}

/**
 * Example: Safe Batch Update Form
 */
export function BatchEditForm({ batch, onClose }: { batch: Batch; onClose: () => void }) {
  const updateBatchMutation = useUpdateBatch();

  const form = useSafeForm<Partial<UpsertBatchRequest>, Batch>({
    initialData: {
      productId: batch.productId,
      locationId: batch.locationId,
      supplierId: batch.supplierId,
      batchCode: batch.batchCode,
      receivedQty: batch.receivedQty,
      unitPrice: batch.unitPrice,
      manufactureDate: batch.manufactureDate,
      expiryDate: batch.expiryDate,
      receiptDate: batch.receiptDate,
      stockType: batch.stockType,
    },
    validate: validateBatchRequest,
    onSubmit: (validatedData) => 
      updateBatchMutation.mutateAsync({ batchId: batch.id, data: validatedData as UpsertBatchRequest }),
    onSuccess: () => {
      toast.success('تم تحديث الدفعة بنجاح');
      onClose();
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">تعديل الدفعة</h2>
      
      {form.globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {form.globalError}
        </div>
      )}

      {/* Same fields as create form... */}
      
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} disabled={form.isSubmitting}>
          إلغاء
        </button>
        <button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? 'جاري التحديث...' : 'تحديث'}
        </button>
      </div>
    </form>
  );
}

/**
 * Example: Safe Batch List with Delete
 */
export function BatchesList() {
  const [filters, setFilters] = useState({ page: 0, pageSize: 25 });
  const { data, isLoading, error } = useBatches(filters);
  const deleteBatchMutation = useDeleteBatch();

  const handleDelete = async (batchId: string) => {
    // Confirmation
    if (!window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      return;
    }

    try {
      await deleteBatchMutation.mutateAsync(batchId);
      toast.success('تم حذف الدفعة بنجاح');
    } catch (error) {
      // Error already handled by mutation
      console.error('Failed to delete batch:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p className="font-bold">حدث خطأ:</p>
        <p>{getErrorMessage(error)}</p>
      </div>
    );
  }

  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد دفعات
      </div>
    );
  }

  // Success state
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th>رمز الدفعة</th>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>تاريخ الانتهاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((batch) => (
            <tr key={batch.id}>
              <td>{batch.batchCode}</td>
              <td>{batch.productName}</td>
              <td>{batch.receivedQty}</td>
              <td>{batch.expiryDate}</td>
              <td>
                <button
                  onClick={() => handleDelete(batch.id)}
                  disabled={deleteBatchMutation.isPending}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span>
          صفحة {data.page + 1} من {data.totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
            disabled={data.page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            السابق
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
            disabled={data.page >= data.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Error Boundary Component
 */
export class BatchErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Batch Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">حدث خطأ</h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'خطأ غير متوقع'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            حاول مرة أخرى
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Example: Complete Safe Batch Management Component
 */
export function SafeBatchManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <BatchErrorBoundary>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الدفعات</h1>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            إضافة دفعة جديدة
          </button>
        </div>

        <BatchesList />

        {showCreateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <BatchCreateForm onClose={() => setShowCreateDialog(false)} />
            </div>
          </div>
        )}
      </div>
    </BatchErrorBoundary>
  );
}
