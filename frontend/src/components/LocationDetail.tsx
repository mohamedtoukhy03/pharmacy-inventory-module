import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Building2,
  Layers,
  Package,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useLocation, useUpdateLocation, useDeleteLocation, useLocationShelves, useCreateShelf, useDeleteShelf } from '@/lib/query';

interface LocationDetailProps {
  locationId: string;
  onNavigate: (page: any) => void;
}

export function LocationDetail({ locationId, onNavigate }: LocationDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddShelfDialog, setShowAddShelfDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Fetch location data
  const { data: location, isLoading, isError } = useLocation(locationId);
  const { data: shelvesData = [] } = useLocationShelves(locationId);

  // Mutations
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  // Initialize form data when location is loaded
  useEffect(() => {
    if (location) {
      setFormData({
        locationName: location.locationName || '',
        locationType: location.locationType || '',
        status: location.status || '',
        address: location.address || '',
        parentLocationId: location.parentLocationId || null,
        isDirectToMain: location.isDirectToMain || false
      });
    }
  }, [location]);

  const handleSave = () => {
    updateMutation.mutate(
      { locationId, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('تم حفظ الموقع بنجاح');
        },
        onError: (error: any) => {
          alert('فشل حفظ الموقع: ' + (error?.message || 'خطأ غير معروف'));
        }
      }
    );
  };

  const handleDelete = () => {
    if (confirm('هل تريد حذف هذا الموقع؟')) {
      deleteMutation.mutate(locationId, {
        onSuccess: () => onNavigate('locations'),
        onError: (error: any) => {
          alert('فشل حذف الموقع: ' + (error?.message || 'خطأ غير معروف'));
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !location) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">فشل تحميل بيانات الموقع</p>
          <button onClick={() => onNavigate('locations')} className="text-blue-600">
            العودة للمواقع
          </button>
        </div>
      </div>
    );
  }

  const typeLabels: { [key: string]: string } = {
    'warehouse': 'مستودع',
    'branch': 'فرع',
    'external': 'خارجي',
    'supplier': 'مورد',
    'quarantine': 'حجر صحي'
  };

  const statusLabels: { [key: string]: string } = {
    'active': 'نشط',
    'inactive': 'غير نشط'
  };

  const shelves = shelvesData;

  // Calculate stats - no capacity field in backend
  const totalStored = shelves.reduce((acc, shelf) => acc + (shelf.onHandQty || 0), 0);

  const stats = [
    {
      label: 'إجمالي الأرفف',
      value: shelves.length.toString(),
      icon: Layers,
      color: 'blue'
    },
    {
      label: 'الكمية المخزنة',
      value: totalStored.toLocaleString(),
      icon: Package,
      color: 'green'
    },
    {
      label: 'طرق الصرف المستخدمة',
      value: new Set(shelves.map(s => s.dispatchMethod).filter(Boolean)).size.toString(),
      icon: Building2,
      color: 'purple'
    },
    {
      label: 'الأرفف النشطة',
      value: shelves.filter(s => (s.onHandQty || 0) > 0).length.toString(),
      icon: AlertCircle,
      color: 'orange'
    }
  ];

  const dispatchMethodLabels: { [key: string]: string } = {
    'FEFO': 'الأقرب انتهاء أولاً',
    'FIFO': 'الوارد أولاً صادر أولاً',
    'LIFO': 'الوارد أخيراً صادر أولاً',
    'MANUAL': 'يدوي'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={() => onNavigate('locations')} className="hover:text-gray-900">
          المواقع
        </button>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">{location.locationName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl">{location.locationName}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
              {typeLabels[location.locationType] || location.locationType}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${location.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
                }`}
            >
              {statusLabels[location.status] || location.status}
            </span>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location.address || 'لا يوجد عنوان'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span>تعديل</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>حذف</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>إلغاء</span>
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>حفظ الموقع</span>
              </button>
            </>
          )}
        </div>
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
                    : stat.color === 'purple'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-orange-100 text-orange-600'
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

      {/* Location Info Card */}
      {isEditing && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg mb-6">معلومات الموقع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">الاسم</label>
              <input
                type="text"
                value={formData.locationName || ''}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">النوع</label>
              <select
                value={formData.locationType || ''}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="warehouse">مستودع</option>
                <option value="branch">فرع</option>
                <option value="external">خارجي</option>
                <option value="supplier">مورد</option>
                <option value="quarantine">حجر صحي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">الحالة</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">الموقع الرئيسي</label>
              <select
                value={formData.parentLocationId || ''}
                onChange={(e) => setFormData({ ...formData, parentLocationId: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">بدون</option>
                <option>مستودع الدمام</option>
                <option>فرع جدة</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">العنوان</label>
              <textarea
                rows={3}
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shelves Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg">الأرفف</h3>
            <p className="text-sm text-gray-600 mt-1">
              إدارة أرفف التخزين وطرق الصرف
            </p>
          </div>
          <button
            onClick={() => setShowAddShelfDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>رف جديد</span>
          </button>
        </div>

        {/* Shelves Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">رقم الرف</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  طريقة الصرف
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  الكمية المخزنة
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shelves.map((shelf) => {
                const onHandQty = shelf.onHandQty || 0;
                const dispatchMethod = shelf.dispatchMethod || '-';

                return (
                  <tr
                    key={shelf.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">رف #{shelf.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {dispatchMethodLabels[dispatchMethod] || dispatchMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {onHandQty.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ShelfActions shelfId={shelf.id} shelfLabel={`رف #${shelf.id}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shelf Dialog */}
      {showAddShelfDialog && (
        <AddShelfDialog
          locationId={locationId}
          onClose={() => setShowAddShelfDialog(false)}
        />
      )}
    </div>
  );
}

function ShelfActions({ shelfId, shelfLabel }: { shelfId: string; shelfLabel: string }) {
  const deleteShelfMutation = useDeleteShelf();

  const handleDelete = () => {
    if (confirm(`هل تريد حذف "${shelfLabel}"؟`)) {
      deleteShelfMutation.mutate(shelfId);
    }
  };

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="تعديل"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        disabled={deleteShelfMutation.isPending}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        title="حذف"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddShelfDialog({ locationId, onClose }: { locationId: string; onClose: () => void }) {
  const [formData, setFormData] = useState({
    dispatchMethod: 'FEFO',
    onHandQty: 0,
  });

  const createShelfMutation = useCreateShelf();

  const handleSave = async () => {
    // Validate form - backend will validate locationId requirement
    const requestData = {
      locationId: parseInt(locationId),
      onHandQty: formData.onHandQty,
      dispatchMethod: formData.dispatchMethod
    };

    createShelfMutation.mutate({ locationId, data: requestData });
    // The mutation will handle success/error via toast in the hook
    // Close dialog on success
    if (!createShelfMutation.isError) {
      // Wait a bit for the mutation to complete
      setTimeout(() => {
        if (!createShelfMutation.isError) {
          onClose();
        }
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">إضافة رف جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              طريقة الصرف <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.dispatchMethod}
              onChange={(e) => setFormData({ ...formData, dispatchMethod: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FEFO">الأقرب انتهاء أولاً (FEFO)</option>
              <option value="FIFO">الوارد أولاً صادر أولاً (FIFO)</option>
              <option value="LIFO">الوارد أخيراً صادر أولاً (LIFO)</option>
              <option value="MANUAL">يدوي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              الكمية الحالية
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.onHandQty}
              onChange={(e) => setFormData({ ...formData, onHandQty: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={createShelfMutation.isPending}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={createShelfMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {createShelfMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ الرف
          </button>
        </div>
      </div>
    </div>
  );
}
