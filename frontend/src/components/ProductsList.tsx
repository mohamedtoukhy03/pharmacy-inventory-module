import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  X,
  Edit,
  Trash2,
  Eye,
  Package,
  Pill,
  ShieldAlert,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useProducts, useDeleteProduct, useCategories } from '@/lib/query';
import { formatCurrency } from '@/lib/utils';

interface ProductsListProps {
  onNavigate: (page: 'product-detail', id: string) => void;
}

// Custom debounced search hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function ProductsList({ onNavigate }: ProductsListProps) {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDrugFilter, setIsDrugFilter] = useState<boolean | null>(null);
  const [controlledFilter, setControlledFilter] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch products with filters (using debounced search)
  const filters = useMemo(() => ({
    page: currentPage,
    size: pageSize,
    sortBy,
    sortDirection,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(isDrugFilter !== null && { isDrug: isDrugFilter }),
    ...(controlledFilter !== null && { isControlled: controlledFilter }),
  }), [currentPage, pageSize, sortBy, sortDirection, debouncedSearch, selectedCategory, isDrugFilter, controlledFilter]);

  const { data: productsData, isLoading, isError, error } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  const deleteMutation = useDeleteProduct();

  // Fetch KPI data with separate queries
  const { data: totalProductsData } = useProducts({ page: 0, size: 1 });
  const { data: controlledData } = useProducts({ page: 0, size: 1, isControlled: true });
  const { data: drugsData } = useProducts({ page: 0, size: 1, isDrug: true });

  const categories = ['كل التصنيفات', ...(categoriesData?.map(c => c.name) || [])];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل تريد حذف المنتج "${name}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const stats = [
    { label: 'إجمالي المنتجات', value: totalProductsData?.totalElements?.toString() || '0', icon: Package, color: 'blue' },
    { label: 'أدوية', value: drugsData?.totalElements?.toString() || '0', icon: Pill, color: 'green' },
    { label: 'مواد خاضعة للرقابة', value: controlledData?.totalElements?.toString() || '0', icon: ShieldAlert, color: 'red' },
    { label: 'الصفحة الحالية', value: `${currentPage + 1}/${(productsData?.totalPages || 1)}`, icon: BarChart3, color: 'yellow' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>الرئيسية</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">المنتجات</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">المنتجات</h1>
          <p className="text-gray-600">إدارة جميع المنتجات والأصناف في النظام</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>منتج جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue'
                    ? 'bg-blue-100 text-blue-600'
                    : stat.color === 'green'
                    ? 'bg-green-100 text-green-600'
                    : stat.color === 'red'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث بالاسم، الباركود، أو SKU..."
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>فلاتر</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm text-gray-700 mb-2">التصنيف</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'كل التصنيفات' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">نوع المنتج</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDrugFilter(isDrugFilter === true ? null : true)}
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                      isDrugFilter === true
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    دواء
                  </button>
                  <button
                    onClick={() => setIsDrugFilter(isDrugFilter === false ? null : false)}
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                      isDrugFilter === false
                        ? 'bg-gray-100 border-gray-300 text-gray-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    غير دواء
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">الرقابة</label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setControlledFilter(controlledFilter === true ? null : true)
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                      controlledFilter === true
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    خاضع للرقابة
                  </button>
                  <button
                    onClick={() =>
                      setControlledFilter(controlledFilter === false ? null : false)
                    }
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                      controlledFilter === false
                        ? 'bg-gray-100 border-gray-300 text-gray-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    غير خاضع
                  </button>
                </div>
              </div>

              <div className="md:col-span-3 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSearchText('');
                    setSelectedCategory('');
                    setIsDrugFilter(null);
                    setControlledFilter(null);
                  }}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إعادة تعيين
                </button>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">حدث خطأ في تحميل المنتجات</div>
              <div className="text-sm text-gray-600">{error?.message || 'تأكد من تشغيل الخادم'}</div>
            </div>
          ) : !productsData?.content || productsData.content.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد منتجات متاحة</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-4 text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => handleSort('name')}>الاسم</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الباركود</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">SKU</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الاسم العلمي</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">النوع</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">التصنيف</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الشركة المصنعة</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => handleSort('sellingPrice')}>السعر</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsData.content.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                          {product.isDrug ? (
                            <Pill className="w-5 h-5" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.barcode || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.genericName || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {product.isDrug && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                            دواء
                          </span>
                        )}
                        {product.controlledSubstance && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            خاضع للرقابة
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.primaryCategoryName || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{product.manufacturer || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(product.sellingPrice || 0, 'SAR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onNavigate('product-detail', product.id.toString())}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('product-detail', product.id.toString())}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id.toString(), product.name)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {productsData && productsData.totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              عرض <span className="font-medium">{productsData.size * productsData.number + 1}-{Math.min(productsData.size * (productsData.number + 1), productsData.totalElements)}</span> من{' '}
              <span className="font-medium">{productsData.totalElements}</span> منتج
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                const page = Math.max(0, Math.min(productsData.totalPages - 5, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}
              <button 
                onClick={() => setCurrentPage(Math.min(productsData.totalPages - 1, currentPage + 1))}
                disabled={currentPage >= productsData.totalPages - 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Product Dialog */}
      {showCreateDialog && (
        <CreateProductDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </div>
  );
}

function CreateProductDialog({ onClose }: { onClose: () => void }) {
  const [isDrug, setIsDrug] = useState(false);
  const [isControlled, setIsControlled] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">إنشاء منتج جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                الاسم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="أدخل اسم المنتج"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">الباركود</label>
              <input
                type="text"
                placeholder="6234567890123"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                placeholder="PRD-001"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">الاسم العلمي</label>
              <input
                type="text"
                placeholder="Generic Name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">الوصف</label>
              <textarea
                rows={3}
                placeholder="وصف المنتج..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">التركيز</label>
              <input
                type="text"
                placeholder="500 مجم"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">الشركة المُصنِّعة</label>
              <input
                type="text"
                placeholder="اسم الشركة"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">التصنيف الأساسي</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر التصنيف</option>
                <option>أدوية القلب</option>
                <option>المضادات الحيوية</option>
                <option>مسكنات الألم</option>
                <option>الفيتامينات</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">وحدة القياس</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر الوحدة</option>
                <option>علبة</option>
                <option>شريط</option>
                <option>قرص</option>
                <option>زجاجة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">سعر البيع</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">كمية إعادة الطلب</label>
              <input
                type="number"
                placeholder="100"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                المخزون الدوري الأدنى
              </label>
              <input
                type="number"
                placeholder="50"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">مخزون الأمان الأدنى</label>
              <input
                type="number"
                placeholder="25"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">هل هو دواء؟</div>
                  <div className="text-sm text-gray-600">حدد إذا كان المنتج دواء</div>
                </div>
                <button
                  onClick={() => setIsDrug(!isDrug)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isDrug ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isDrug ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">مادة خاضعة للرقابة؟</div>
                  <div className="text-sm text-gray-600">
                    حدد إذا كان المنتج خاضع للرقابة
                  </div>
                </div>
                <button
                  onClick={() => setIsControlled(!isControlled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isControlled ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isControlled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            حفظ المنتج
          </button>
        </div>
      </div>
    </div>
  );
}
