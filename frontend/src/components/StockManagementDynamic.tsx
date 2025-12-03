import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  X,
  Search,
  Eye,
  Package,
  Calendar,
  MapPin,
  AlertTriangle,
  Filter,
  TrendingUp,
  Archive
} from 'lucide-react';
import {
  useBatches,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
  useStockLevels,
  useUpdateStockLevel,
  useProducts,
  useLocations,
  useSuppliers
} from '../lib/query';
import { formatCurrency, formatDate } from '../lib/utils';
import type { Batch, StockLevel, StockType, DispenseMethod } from '../lib/api/types';

type Tab = 'batches' | 'stock-levels';

interface StockManagementProps {
  onNavigate: (page: 'batch-detail', id: string) => void;
}

export function StockManagementDynamic({ onNavigate }: StockManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('batches');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [searchText, setSearchText] = useState('');

  // Debounced search
  const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchText, 300);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>الرئيسية</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">إدارة المخزون</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">إدارة المخزون</h1>
          <p className="text-gray-600">إدارة الدفعات ومستويات المخزون</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'batches' ? 'دفعة جديدة' : 'تعديل مخزون'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'batches'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <Package className="w-5 h-5" />
            <span>الدفعات</span>
          </button>
          <button
            onClick={() => setActiveTab('stock-levels')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'stock-levels'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <Archive className="w-5 h-5" />
            <span>مستويات المخزون</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'batches' ? (
        <BatchesTab
          searchText={searchText}
          setSearchText={setSearchText}
          debouncedSearch={debouncedSearch}
          onNavigate={onNavigate}
          onEdit={(batch) => setEditingBatch(batch)}
        />
      ) : (
        <StockLevelsTab
          searchText={searchText}
          setSearchText={setSearchText}
          debouncedSearch={debouncedSearch}
        />
      )}

      {/* Create/Edit Dialog */}
      {(showCreateDialog || editingBatch) && (
        <BatchDialog
          batch={editingBatch}
          onClose={() => {
            setShowCreateDialog(false);
            setEditingBatch(null);
          }}
        />
      )}
    </div>
  );
}

function BatchesTab({
  searchText,
  setSearchText,
  debouncedSearch,
  onNavigate,
  onEdit
}: {
  searchText: string;
  setSearchText: (value: string) => void;
  debouncedSearch: string;
  onNavigate: (page: 'batch-detail', id: string) => void;
  onEdit: (batch: Batch) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStockType, setSelectedStockType] = useState<StockType | ''>('');
  const [expiryBefore, setExpiryBefore] = useState('');

  // Fetch batches
  const { data: batchesData, isLoading, error } = useBatches({
    search: debouncedSearch || undefined,
    productId: selectedProduct || undefined,
    locationId: selectedLocation || undefined,
    stockType: selectedStockType || undefined,
    expiryBefore: expiryBefore || undefined,
    page: 0,
    pageSize: 100,
  });

  const batches = batchesData?.content || batchesData?.data || [];

  // Calculate days to expiry for all batches
  const calculateDaysToExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Calculate batches with expiry info
  const batchesWithExpiry = batches.map(batch => ({
    ...batch,
    daysToExpiry: calculateDaysToExpiry(batch.expiryDate),
  }));

  // Calculate stats from the loaded batches data
  // Note: We calculate from all loaded batches. For accurate totals across all pages,
  // we would need backend support for nearExpiry and expired filters.
  // For now, we calculate based on loaded data which is sufficient for the display.
  const totalBatches = batchesData?.totalElements || batchesData?.total || batches.length;
  const expiredCount = batchesWithExpiry.filter(b => b.daysToExpiry < 0).length;
  const nearExpiryCount = batchesWithExpiry.filter(b => b.daysToExpiry >= 0 && b.daysToExpiry <= 90).length;
  const activeCount = Math.max(0, totalBatches - expiredCount);

  const stats = [
    {
      label: 'إجمالي الدفعات',
      value: totalBatches.toString(),
      icon: Package,
      color: 'blue'
    },
    {
      label: 'دفعات نشطة',
      value: activeCount.toString(),
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'قريبة الانتهاء',
      value: nearExpiryCount.toString(),
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      label: 'منتهية',
      value: expiredCount.toString(),
      icon: X,
      color: 'red'
    }
  ];

  // Fetch products and locations for filters
  const { data: productsData } = useProducts({ page: 0, pageSize: 100 });
  const { data: locations } = useLocations();

  const products = productsData?.content || productsData?.data || [];

  const stockTypeLabels: Record<StockType, string> = {
    'available': 'متاح',
    'near_expiry': 'قرب انتهاء الصلاحية',
    'removed': 'محذوف',
    'expired': 'منتهي الصلاحية',
    'disposed': 'تم التخلص منه',
    'damaged': 'تالف',
    'quarantined': 'محجور'
  };


  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue'
                  ? 'bg-blue-100 text-blue-600'
                  : stat.color === 'green'
                    ? 'bg-green-100 text-green-600'
                    : stat.color === 'yellow'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
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
                placeholder="ابحث برقم الدفعة أو المنتج..."
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${showFilters
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm text-gray-700 mb-2">المنتج</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">كل المنتجات</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">الموقع</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">كل المواقع</option>
                  {locations?.map(location => (
                    <option key={location.id} value={location.id}>{location.locationName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">نوع المخزون</label>
                <select
                  value={selectedStockType}
                  onChange={(e) => setSelectedStockType(e.target.value as StockType | '')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">كل الأنواع</option>
                  <option value="available">متاح</option>
                  <option value="near_expiry">قرب انتهاء الصلاحية</option>
                  <option value="expired">منتهي الصلاحية</option>
                  <option value="quarantined">محجور</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  انتهاء الصلاحية قبل
                </label>
                <input
                  type="date"
                  value={expiryBefore}
                  onChange={(e) => setExpiryBefore(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-4 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedProduct('');
                    setSelectedLocation('');
                    setSelectedStockType('');
                    setExpiryBefore('');
                  }}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-12 text-center">
            <div className="text-red-600 mb-2">حدث خطأ أثناء تحميل الدفعات</div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && batches.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد دفعات</p>
          </div>
        )}

        {/* Batches Table */}
        {!isLoading && !error && batches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">المنتج</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الموقع</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">رقم الدفعة</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">التكلفة</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">تاريخ الانتهاء</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((batch) => {
                  const daysToExpiry = calculateDaysToExpiry(batch.expiryDate);

                  return (
                    <BatchRow
                      key={batch.id}
                      batch={batch}
                      daysToExpiry={daysToExpiry}
                      stockTypeLabel={stockTypeLabels[batch.stockType || 'available']}
                      onNavigate={onNavigate}
                      onEdit={onEdit}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

interface BatchRowProps {
  batch: Batch;
  daysToExpiry: number;
  stockTypeLabel: string;
  onNavigate: (page: 'batch-detail', id: string) => void;
  onEdit: (batch: Batch) => void;
}

function BatchRow({ batch, daysToExpiry, stockTypeLabel, onNavigate, onEdit }: BatchRowProps) {
  const deleteMutation = useDeleteBatch();

  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف الدفعة "${batch.batchNumber}"?`)) {
      deleteMutation.mutate(batch.id);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
            <Package className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-900">{batch.productName || 'منتج'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{batch.locationName || 'موقع'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
          {batch.batchNumber}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900">
          {batch.quantity.toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-gray-600">
          <span>{formatCurrency(batch.cost || 0, 'SAR')}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2 text-gray-900">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(batch.expiryDate)}</span>
          </div>
          <div
            className={`text-xs mt-1 ${daysToExpiry <= 90
              ? 'text-red-600'
              : daysToExpiry <= 180
                ? 'text-yellow-600'
                : 'text-green-600'
              }`}
          >
            {daysToExpiry > 0 ? `${daysToExpiry} يوم متبقي` : 'منتهي'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-lg text-sm ${batch.status === 'available'
            ? 'bg-green-100 text-green-700'
            : batch.status === 'nearExpiry'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {stockTypeLabel}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onNavigate('batch-detail', batch.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تفاصيل"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(batch)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StockLevelsTab({
  searchText,
  setSearchText,
  debouncedSearch
}: {
  searchText: string;
  setSearchText: (value: string) => void;
  debouncedSearch: string;
}) {
  const { data: stockLevels = [], isLoading, error } = useStockLevels({
    search: debouncedSearch || undefined,
  });

  const dispatchMethodLabels: Record<DispenseMethod, string> = {
    'FEFO': 'الأقرب انتهاء أولاً',
    'FIFO': 'الوارد أولاً صادر أولاً',
    'Manual': 'يدوي'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Search */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ابحث عن منتج أو موقع..."
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
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-12 text-center">
          <div className="text-red-600 mb-2">حدث خطأ أثناء تحميل مستويات المخزون</div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && stockLevels.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <Archive className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>لا توجد مستويات مخزون</p>
        </div>
      )}

      {/* Stock Levels Table */}
      {!isLoading && !error && stockLevels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">المنتج</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الموقع</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">نوع المخزون</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية المتاحة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">طريقة الصرف</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">نقطة إعادة الطلب</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockLevels.map((level) => (
                <StockLevelRow
                  key={level.id}
                  level={level}
                  dispatchMethodLabels={dispatchMethodLabels}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface StockLevelRowProps {
  level: StockLevel;
  dispatchMethodLabels: Record<DispenseMethod, string>;
}

function StockLevelRow({ level, dispatchMethodLabels }: StockLevelRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newQty, setNewQty] = useState(level.onHandQuantity.toString());
  const updateMutation = useUpdateStockLevel();

  const handleUpdate = () => {
    updateMutation.mutate({
      id: level.id,
      data: {
        productId: Number(level.productId),
        locationId: Number(level.locationId),
        stockType: level.stockType,
        onHandQuantity: parseInt(newQty),
        dispatchMethod: level.dispatchMethod,
      }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const statusLabel = level.status === 'normal' ? 'طبيعي'
    : level.status === 'low' ? 'منخفض'
      : 'حرج';

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
            <Archive className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-900">{level.productName || 'منتج'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{level.locationName || 'موقع'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700">
          {level.stockType}
        </span>
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="w-24 px-2 py-1 border border-gray-200 rounded"
            />
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              حفظ
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewQty(level.onHandQuantity.toString());
              }}
              className="px-2 py-1 border border-gray-200 text-sm rounded hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <span className="text-xl font-medium text-gray-900">
            {level.onHandQuantity.toLocaleString()}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
          {level.dispatchMethod ? dispatchMethodLabels[level.dispatchMethod as DispenseMethod] : 'غير محدد'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-600">{level.reorderQty || '-'}</span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 w-fit ${level.status === 'normal'
            ? 'bg-green-100 text-green-700'
            : level.status === 'low'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {level.status === 'critical' && <AlertTriangle className="w-4 h-4" />}
          {statusLabel}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function BatchDialog({
  batch,
  onClose
}: {
  batch: Batch | null;
  onClose: () => void;
}) {
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();

  const [formData, setFormData] = useState({
    productId: batch?.productId || '',
    locationId: batch?.locationId || '',
    supplierId: batch?.supplierId || '',
    batchNumber: batch?.batchNumber || '',
    quantity: batch?.quantity.toString() || '',
    cost: batch?.cost?.toString() || '',
    manufacturingDate: batch?.manufacturingDate || '',
    expiryDate: batch?.expiryDate || '',
    receivingDate: batch?.receivingDate || '',
    stockType: (batch?.stockType as StockType) || 'available',
  });

  // Fetch dropdowns
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({ page: 0, pageSize: 100 });
  const { data: locations } = useLocations();
  const { data: suppliers } = useSuppliers({});

  const products = productsData?.content || productsData?.data || [];

  console.log('Products data:', { productsData, products, productsLoading, productsError });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedBatchNumber = formData.batchNumber?.trim();

    const data: any = {
      productId: Number(formData.productId),
      locationId: Number(formData.locationId),
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      stockType: formData.stockType,
    };

    // Only add optional fields if they have values
    if (formData.supplierId) data.supplierId = Number(formData.supplierId);
    if (trimmedBatchNumber && trimmedBatchNumber.length > 0) data.batchNumber = trimmedBatchNumber;
    if (formData.cost) data.cost = parseInt(formData.cost);
    if (formData.manufacturingDate) data.manufacturingDate = formData.manufacturingDate;
    if (formData.receivingDate) data.receivingDate = formData.receivingDate;

    console.log('Submitting batch data:', JSON.stringify(data, null, 2));

    try {
      if (batch) {
        await updateBatchMutation.mutateAsync({ batchId: batch.id, data });
      } else {
        await createBatchMutation.mutateAsync(data);
      }
      onClose();
    } catch (error: any) {
      console.error('Batch creation error:', {
        error,
        response: error?.response,
        data: error?.response?.data,
        message: error?.message
      });
      // Error handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">{batch ? 'تعديل الدفعة' : 'إنشاء دفعة جديدة'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                المنتج <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                disabled={productsLoading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">{productsLoading ? 'جاري التحميل...' : productsError ? 'فشل تحميل المنتجات' : 'اختر المنتج'}</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              {productsError && (
                <p className="mt-1 text-sm text-red-600">فشل تحميل قائمة المنتجات</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                الموقع <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الموقع</option>
                {locations?.map(location => (
                  <option key={location.id} value={location.id}>{location.locationName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                رقم الدفعة
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="BTH-2024-XXX"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                الكمية <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">التكلفة</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">المورد</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر المورد</option>
                {(suppliers || []).map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.supplierName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">تاريخ التصنيع</label>
              <input
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">تاريخ الاستلام</label>
              <input
                type="date"
                value={formData.receivingDate}
                onChange={(e) => setFormData({ ...formData, receivingDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">نوع المخزون</label>
              <select
                value={formData.stockType}
                onChange={(e) => setFormData({ ...formData, stockType: e.target.value as StockType })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">متاح</option>
                <option value="near_expiry">قرب انتهاء الصلاحية</option>
                <option value="removed">محذوف</option>
                <option value="expired">منتهي الصلاحية</option>
                <option value="disposed">تم التخلص منه</option>
                <option value="damaged">تالف</option>
                <option value="quarantined">محجور</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createBatchMutation.isPending || updateBatchMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {(createBatchMutation.isPending || updateBatchMutation.isPending) ? 'جاري الحفظ...' : batch ? 'تحديث' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
