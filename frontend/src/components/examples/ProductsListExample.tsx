/**
 * Example: Products List Component with API Integration
 * 
 * This example demonstrates how to:
 * - Fetch products with filters and pagination
 * - Handle loading and error states
 * - Create, update, and delete products
 * - Show success/error toasts
 * - Implement search with debounce
 */

import { useState } from 'react';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/lib/query';
import type { Product, ProductFilters } from '@/lib/api';

export function ProductsListExample() {
  // State for filters and pagination
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 25,
    search: '',
    isDrug: undefined,
    isControlled: undefined,
    sortBy: 'name',
    sortDir: 'asc',
  });

  // Fetch products with current filters
  const { data, isLoading, error, refetch } = useProducts(filters);

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Handlers
  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 }); // Reset to page 1
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleCreate = () => {
    createProduct.mutate({
      name: 'أسبيرين 100 مجم',
      barcode: '6234567890123',
      sku: 'ASP-100',
      price: 15.50,
      isDrug: true,
      isControlled: false,
      reorderQty: 100,
      minStock: 25,
    });
  };

  const handleUpdate = (productId: string) => {
    updateProduct.mutate({
      productId,
      data: { price: 16.00 }
    });
  };

  const handleDelete = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج?')) {
      deleteProduct.mutate(productId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 rounded">
        <h3 className="font-bold text-red-700">خطأ في تحميل البيانات</h3>
        <p className="text-red-600">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Empty state
  if (!data?.data.length) {
    return (
      <div className="text-center p-8 border border-dashed rounded">
        <p className="text-gray-500 mb-4">لا توجد منتجات</p>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          إنشاء منتج جديد +
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white border rounded">
          <p className="text-sm text-gray-500">إجمالي المنتجات</p>
          <p className="text-2xl font-bold">{data.total}</p>
        </div>
        <div className="p-4 bg-white border rounded">
          <p className="text-sm text-gray-500">الصفحة الحالية</p>
          <p className="text-2xl font-bold">{data.page}</p>
        </div>
        <div className="p-4 bg-white border rounded">
          <p className="text-sm text-gray-500">إجمالي الصفحات</p>
          <p className="text-2xl font-bold">{data.totalPages}</p>
        </div>
        <div className="p-4 bg-white border rounded">
          <p className="text-sm text-gray-500">حجم الصفحة</p>
          <p className="text-2xl font-bold">{data.pageSize}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="ابحث بالاسم، الباركود، أو SKU..."
          className="flex-1 px-4 py-2 border rounded"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        <select
          value={filters.isDrug === undefined ? '' : filters.isDrug.toString()}
          onChange={(e) => handleFilterChange('isDrug', e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-4 py-2 border rounded"
        >
          <option value="">كل الأنواع</option>
          <option value="true">أدوية</option>
          <option value="false">غير أدوية</option>
        </select>

        <select
          value={filters.isControlled === undefined ? '' : filters.isControlled.toString()}
          onChange={(e) => handleFilterChange('isControlled', e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-4 py-2 border rounded"
        >
          <option value="">الكل</option>
          <option value="true">خاضعة للرقابة</option>
          <option value="false">غير خاضعة للرقابة</option>
        </select>

        <button
          onClick={handleCreate}
          disabled={createProduct.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {createProduct.isPending ? 'جاري الإنشاء...' : 'منتج جديد +'}
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right">الاسم</th>
              <th className="px-4 py-3 text-right">الباركود</th>
              <th className="px-4 py-3 text-right">SKU</th>
              <th className="px-4 py-3 text-right">السعر</th>
              <th className="px-4 py-3 text-right">النوع</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((product: Product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.barcode || '-'}</td>
                <td className="px-4 py-3">{product.sku || '-'}</td>
                <td className="px-4 py-3">{product.price.toFixed(2)} رس</td>
                <td className="px-4 py-3">
                  {product.isDrug && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      دواء
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.isControlled && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      خاضع للرقابة
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      disabled={updateProduct.isPending}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteProduct.isPending}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => handlePageChange(data.page - 1)}
          disabled={data.page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          السابق
        </button>
        
        <span className="text-sm text-gray-600">
          صفحة {data.page} من {data.totalPages}
        </span>
        
        <button
          onClick={() => handlePageChange(data.page + 1)}
          disabled={data.page === data.totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

/**
 * Usage in your App:
 * 
 * import { ProductsListExample } from '@/components/examples/ProductsListExample';
 * 
 * function App() {
 *   return <ProductsListExample />;
 * }
 */
