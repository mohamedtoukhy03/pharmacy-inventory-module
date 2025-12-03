import { useState } from 'react';
import {
  ChevronLeft,
  Package,
  MapPin,
  Calendar,
  Building2,
  Plus,
  Trash2,
  X,
  Layers,
  AlertTriangle
} from 'lucide-react';
import {
  useBatch,
  useBatchAllocations,
  useCreateBatchAllocation,
  useDeleteBatchAllocation,
  useDeleteBatch,
  useLocationShelves
} from '../lib/query';
import { formatCurrency, formatDate } from '../lib/utils';
import type { BatchShelfAllocation } from '../lib/api/types';

interface BatchDetailProps {
  batchId: string;
  onNavigate: (page: any) => void;
}

export function BatchDetailDynamic({ batchId, onNavigate }: BatchDetailProps) {
  const [showAddShelfDialog, setShowAddShelfDialog] = useState(false);

  // Fetch batch data
  const { data: batch, isLoading, error } = useBatch(batchId);

  // Fetch shelf allocations
  const { data: allocations = [], isLoading: allocationsLoading } = useBatchAllocations(batchId);

  const deleteMutation = useDeleteBatch();

  const handleDeleteBatch = () => {
    if (window.confirm(`هل أنت متأكد من حذف الدفعة "${batch?.batchNumber}"?`)) {
      deleteMutation.mutate(batchId, {
        onSuccess: () => onNavigate('stock-management')
      });
    }
  };

  const calculateDaysToExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">حدث خطأ أثناء تحميل تفاصيل الدفعة</div>
          <p className="text-gray-600">{error?.message || 'الدفعة غير موجودة'}</p>
          <button
            onClick={() => onNavigate('stock-management')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            العودة للمخزون
          </button>
        </div>
      </div>
    );
  }

  const daysToExpiry = calculateDaysToExpiry(batch.expiryDate);
  const allocatedQty = allocations.reduce((sum, a) => sum + a.allocatedQty, 0);
  const unallocatedQty = batch.quantity - allocatedQty;

  const stats = [
    {
      label: 'الكمية الإجمالية',
      value: batch.quantity.toString(),
      icon: Package,
      color: 'blue'
    },
    {
      label: 'الكمية المخصصة',
      value: allocatedQty.toString(),
      icon: Layers,
      color: 'green'
    },
    {
      label: 'الكمية غير المخصصة',
      value: unallocatedQty.toString(),
      icon: AlertTriangle,
      color: unallocatedQty > 0 ? 'yellow' : 'gray'
    },
    {
      label: 'عدد الأرفف',
      value: allocations.length.toString(),
      icon: Layers,
      color: 'purple'
    }
  ];

  const stockTypeLabels: Record<string, string> = {
    'store': 'مخزن',
    'pharmacy': 'صيدلية',
    'quarantine': 'حجر صحي',
    'external': 'خارجي'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => onNavigate('stock-management')}
          className="hover:text-gray-900"
        >
          إدارة المخزون
        </button>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">تفاصيل الدفعة {batch.batchNumber}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl">{batch.productName || 'منتج'}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono">
              {batch.batchNumber}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${batch.status === 'available'
                ? 'bg-green-100 text-green-700'
                : batch.status === 'nearExpiry'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {stockTypeLabels[batch.stockType || 'store']}
            </span>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {batch.locationName || 'موقع'}
          </p>
        </div>
        <button
          onClick={handleDeleteBatch}
          disabled={deleteMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف الدفعة</span>
        </button>
      </div>

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
                      : stat.color === 'purple'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
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

      {/* Batch Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg mb-6">معلومات الدفعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">المنتج</span>
            </div>
            <p className="font-medium text-gray-900">{batch.productName || 'منتج'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">الموقع</span>
            </div>
            <p className="font-medium text-gray-900">{batch.locationName || 'موقع'}</p>
          </div>

          {batch.supplierId && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-600">المورد</span>
              </div>
              <p className="font-medium text-gray-900">مورد</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">التكلفة</span>
            </div>
            <p className="font-medium text-gray-900">{formatCurrency(batch.cost || 0, 'SAR')}</p>
          </div>

          {batch.manufacturingDate && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-600">تاريخ التصنيع</span>
              </div>
              <p className="font-medium text-gray-900">{formatDate(batch.manufacturingDate)}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">تاريخ الانتهاء</span>
            </div>
            <p className="font-medium text-gray-900">{formatDate(batch.expiryDate)}</p>
            <p
              className={`text-xs mt-1 ${daysToExpiry <= 90
                ? 'text-red-600'
                : daysToExpiry <= 180
                  ? 'text-yellow-600'
                  : 'text-green-600'
                }`}
            >
              {daysToExpiry > 0 ? `${daysToExpiry} يوم متبقي` : 'منتهي'}
            </p>
          </div>

          {batch.receivingDate && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-600">تاريخ الاستلام</span>
              </div>
              <p className="font-medium text-gray-900">{formatDate(batch.receivingDate)}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">نوع المخزون</span>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-lg text-sm ${batch.status === 'available'
                ? 'bg-green-100 text-green-700'
                : batch.status === 'nearExpiry'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {stockTypeLabels[batch.stockType || 'store']}
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">الكمية الإجمالية</span>
            </div>
            <p className="text-2xl font-medium text-gray-900">
              {batch.quantity.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Shelf Allocations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg">الأرفف المرتبطة</h3>
            <p className="text-sm text-gray-600 mt-1">
              توزيع الدفعة على الأرفف المختلفة
            </p>
          </div>
          <button
            onClick={() => setShowAddShelfDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة رف</span>
          </button>
        </div>

        {/* Loading State */}
        {allocationsLoading && (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأرفف...</p>
          </div>
        )}

        {/* Empty State */}
        {!allocationsLoading && allocations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد أرفف مخصصة لهذه الدفعة</p>
          </div>
        )}

        {/* Shelves Table */}
        {!allocationsLoading && allocations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الرف</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية المخصصة</th>
                  <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allocations.map((allocation) => (
                  <AllocationRow
                    key={allocation.id}
                    allocation={allocation}
                    batchId={batchId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Shelf Dialog */}
      {showAddShelfDialog && (
        <AddShelfDialog
          batchId={batchId}
          unallocatedQty={unallocatedQty}
          onClose={() => setShowAddShelfDialog(false)}
        />
      )}
    </div>
  );
}

interface AllocationRowProps {
  allocation: BatchShelfAllocation;
  batchId: string;
}

function AllocationRow({ allocation, batchId }: AllocationRowProps) {
  const deleteMutation = useDeleteBatchAllocation();

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا التخصيص?')) {
      deleteMutation.mutate({ batchId, allocationId: allocation.id });
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-900">{allocation.shelfId}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xl font-medium text-gray-900">
          {allocation.allocatedQty.toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

interface AddShelfDialogProps {
  batchId: string;
  unallocatedQty: number;
  onClose: () => void;
}

function AddShelfDialog({ batchId, unallocatedQty, onClose }: AddShelfDialogProps) {
  const [formData, setFormData] = useState({
    shelfId: '',
    quantity: '',
  });

  const createMutation = useCreateBatchAllocation();

  // Get batch to know its location
  const { data: batch } = useBatch(batchId);

  // Fetch available shelves from the batch's location
  const { data: shelves = [] } = useLocationShelves(batch?.locationId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shelfId) {
      alert('الرجاء اختيار رف');
      return;
    }

    const quantity = parseInt(formData.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      alert('الرجاء إدخال كمية صحيحة');
      return;
    }

    if (quantity > unallocatedQty) {
      alert(`الكمية المتاحة للتخصيص: ${unallocatedQty}`);
      return;
    }

    createMutation.mutate(
      {
        batchId,
        data: {
          shelfId: parseInt(formData.shelfId),
          quantity: quantity,
        }
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items- justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">إضافة رف للدفعة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              اختر الرف <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.shelfId}
              onChange={(e) => setFormData({ ...formData, shelfId: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر رف من القائمة</option>
              {shelves.map((shelf: any) => (
                <option key={shelf.id} value={shelf.id}>
                  رف #{shelf.id} {shelf.dispatchMethod ? `(${shelf.dispatchMethod})` : ''}
                </option>
              ))}
            </select>
            {shelves.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                لا توجد أرفف في هذا الموقع. يجب إنشاء رف أولاً في إدارة المواقع.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              الكمية <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="أدخل الكمية"
              min="1"
              max={unallocatedQty}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              الكمية المتبقية من الدفعة: {unallocatedQty.toLocaleString()} وحدة
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || shelves.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'جاري الإضافة...' : 'إضافة الرف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
