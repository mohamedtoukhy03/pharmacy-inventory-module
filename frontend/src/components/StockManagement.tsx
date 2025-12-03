import { useState, useMemo } from 'react';
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
  DollarSign,
  AlertTriangle,
  Filter,
  TrendingUp,
  Archive
} from 'lucide-react';
import { useBatches, useDeleteBatch } from '@/lib/query';
import type { Batch } from '@/lib/api/types';

type Tab = 'batches' | 'stock-levels';

interface StockManagementProps {
  onNavigate: (page: 'batch-detail', id: string) => void;
}

export function StockManagement({ onNavigate }: StockManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('batches');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
          <span>{activeTab === 'batches' ? 'دفعة جديدة' : 'مستوى جديد'}</span>
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
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onNavigate={onNavigate}
        />
      ) : (
        <StockLevelsTab
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateDialog
          type={activeTab}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}

function BatchesTab({
  searchText,
  setSearchText,
  showFilters,
  setShowFilters,
  onNavigate
}: {
  searchText: string;
  setSearchText: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  onNavigate: (page: 'batch-detail', id: string) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStockType, setSelectedStockType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Fetch batches from API
  const { data: batchesResponse, isLoading } = useBatches();
  const deleteBatchMutation = useDeleteBatch();

  // Extract batches from paginated response
  const batchesData = Array.isArray(batchesResponse) ? batchesResponse : (batchesResponse?.content || []);

  // Calculate days until expiry for each batch
  const batchesWithExpiry = useMemo(() => {
    return batchesData.map((batch: Batch) => {
      const today = new Date();
      const expiry = new Date(batch.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...batch,
        daysToExpiry,
        isExpired: daysToExpiry < 0,
        isNearExpiry: daysToExpiry >= 0 && daysToExpiry <= 90
      };
    });
  }, [batchesData]);

  // Filter batches based on search and filters
  const filteredBatches = useMemo(() => {
    return batchesWithExpiry.filter(batch => {
      if (searchText && !batch.productName?.toLowerCase().includes(searchText.toLowerCase()) &&
        !batch.batchNumber.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [batchesWithExpiry, searchText]);

  // Calculate stats dynamically
  const stats = useMemo(() => {
    const total = batchesWithExpiry.length;
    const expired = batchesWithExpiry.filter(b => b.isExpired).length;
    const nearExpiry = batchesWithExpiry.filter(b => b.isNearExpiry).length;
    const active = total - expired;

    return [
      { label: 'إجمالي الدفعات', value: total.toString(), icon: Package, color: 'blue' },
      { label: 'دفعات نشطة', value: active.toString(), icon: TrendingUp, color: 'green' },
      { label: 'قريبة الانتهاء', value: nearExpiry.toString(), icon: AlertTriangle, color: 'yellow' },
      { label: 'منتهية', value: expired.toString(), icon: X, color: 'red' }
    ];
  }, [batchesWithExpiry]);

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
                  <option>أسبرين 100 مجم</option>
                  <option>باراسيتامول 500 مجم</option>
                  <option>أموكسيسيلين 500 مجم</option>
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
                  <option>الفرع الرئيسي - الرياض</option>
                  <option>فرع جدة</option>
                  <option>مستودع الدمام</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">نوع المخزون</label>
                <select
                  value={selectedStockType}
                  onChange={(e) => setSelectedStockType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">كل الأنواع</option>
                  <option>متاح</option>
                  <option>محجوز</option>
                  <option>حجر صحي</option>
                  <option>تالف</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  انتهاء الصلاحية قبل
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-4 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedProduct('');
                    setSelectedLocation('');
                    setSelectedStockType('');
                    setExpiryDate('');
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

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">المنتج</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الموقع</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  رقم الدفعة
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">التكلفة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  تاريخ الانتهاء
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    جاري تحميل الدفعات...
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    لا توجد دفعات
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">{batch.productName || 'غير معروف'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{batch.locationName || 'غير معروف'}</span>
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
                        <span>{batch.cost ? `${batch.cost.toFixed(2)} ر.س` : 'غير محدد'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(batch.expiryDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div
                          className={`text-xs mt-1 ${batch.isExpired
                            ? 'text-red-600 font-semibold'
                            : batch.daysToExpiry <= 90
                              ? 'text-red-600'
                              : batch.daysToExpiry <= 180
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                        >
                          {batch.isExpired ? 'منتهية الصلاحية' : `${batch.daysToExpiry} يوم متبقي`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${batch.stockType === 'available'
                            ? 'bg-green-100 text-green-700'
                            : batch.stockType === 'quarantined'
                              ? 'bg-yellow-100 text-yellow-700'
                              : batch.stockType === 'near_expiry'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {batch.stockType === 'available' ? 'متاح' :
                          batch.stockType === 'quarantined' ? 'حجر صحي' :
                            batch.stockType === 'near_expiry' ? 'قريب الانتهاء' :
                              batch.stockType === 'expired' ? 'منتهي' : 'آخر'}
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
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => {
                            if (confirm('هل تريد حذف هذه الدفعة؟')) {
                              deleteBatchMutation.mutate(batch.id);
                            }
                          }}
                          disabled={deleteBatchMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StockLevelsTab({
  searchText,
  setSearchText
}: {
  searchText: string;
  setSearchText: (value: string) => void;
}) {
  const stockLevels = [
    {
      id: '1',
      product: 'أسبرين 100 مجم',
      location: 'الفرع الرئيسي - الرياض',
      stockType: 'متاح',
      quantity: 1250,
      dispatchMethod: 'FEFO',
      reorderPoint: 100,
      status: 'طبيعي'
    },
    {
      id: '2',
      product: 'باراسيتامول 500 مجم',
      location: 'فرع جدة',
      stockType: 'متاح',
      quantity: 85,
      dispatchMethod: 'FIFO',
      reorderPoint: 100,
      status: 'منخفض'
    },
    {
      id: '3',
      product: 'أموكسيسيلين 500 مجم',
      location: 'مستودع الدمام',
      stockType: 'متاح',
      quantity: 2340,
      dispatchMethod: 'FEFO',
      reorderPoint: 200,
      status: 'طبيعي'
    },
    {
      id: '4',
      product: 'فيتامين د 5000 وحدة',
      location: 'الفرع الرئيسي - الرياض',
      stockType: 'متاح',
      quantity: 450,
      dispatchMethod: 'FIFO',
      reorderPoint: 150,
      status: 'طبيعي'
    },
    {
      id: '5',
      product: 'ترامادول 50 مجم',
      location: 'الفرع الرئيسي - الرياض',
      stockType: 'محجوز',
      quantity: 15,
      dispatchMethod: 'MANUAL',
      reorderPoint: 25,
      status: 'حرج'
    }
  ];

  const dispatchMethodLabels: { [key: string]: string } = {
    'FEFO': 'الأقرب انتهاء أولاً',
    'FIFO': 'الوارد أولاً صادر أولاً',
    'LIFO': 'الوارد أخيراً صادر أولاً',
    'MANUAL': 'يدوي'
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

      {/* Stock Levels Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-6 py-4 text-sm text-gray-600">المنتج</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الموقع</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                نوع المخزون
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                الكمية المتاحة
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                طريقة الصرف
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                نقطة إعادة الطلب
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stockLevels.map((level) => (
              <tr
                key={level.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                      <Archive className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{level.product}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{level.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${level.stockType === 'متاح'
                      ? 'bg-green-100 text-green-700'
                      : level.stockType === 'محجوز'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {level.stockType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xl font-medium text-gray-900">
                    {level.quantity.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    {dispatchMethodLabels[level.dispatchMethod]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{level.reorderPoint}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 w-fit ${level.status === 'طبيعي'
                      ? 'bg-green-100 text-green-700'
                      : level.status === 'منخفض'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {level.status === 'حرج' && (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {level.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateDialog({
  type,
  onClose
}: {
  type: 'batches' | 'stock-levels';
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">
            {type === 'batches' ? 'إنشاء دفعة جديدة' : 'إنشاء مستوى مخزون جديد'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {type === 'batches' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  المنتج <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر المنتج</option>
                  <option>أسبرين 100 مجم</option>
                  <option>باراسيتامول 500 مجم</option>
                  <option>أموكسيسيلين 500 مجم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الموقع</option>
                  <option>الفرع الرئيسي - الرياض</option>
                  <option>فرع جدة</option>
                  <option>مستودع الدمام</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  رقم الدفعة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
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
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">التكلفة</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">المورد</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر المورد</option>
                  <option>الشركة الدولية للأدوية</option>
                  <option>الشركة العربية للأدوية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  تاريخ التصنيع
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  تاريخ الانتهاء <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  تاريخ الاستلام
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  نوع المخزون
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>متاح</option>
                  <option>محجوز</option>
                  <option>حجر صحي</option>
                  <option>تالف</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  المنتج <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر المنتج</option>
                  <option>أسبرين 100 مجم</option>
                  <option>باراسيتامول 500 مجم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الموقع</option>
                  <option>الفرع الرئيسي - الرياض</option>
                  <option>فرع جدة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  الكمية المتاحة <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  نوع المخزون
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>متاح</option>
                  <option>محجوز</option>
                  <option>حجر صحي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  طريقة الصرف
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="FEFO">الأقرب انتهاء أولاً (FEFO)</option>
                  <option value="FIFO">الوارد أولاً صادر أولاً (FIFO)</option>
                  <option value="LIFO">الوارد أخيراً صادر أولاً (LIFO)</option>
                  <option value="MANUAL">يدوي</option>
                </select>
              </div>
            </div>
          )}
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
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
