import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface LocationDetailProps {
  locationId: string;
  onNavigate: (page: any) => void;
}

export function LocationDetail({ locationId, onNavigate }: LocationDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddShelfDialog, setShowAddShelfDialog] = useState(false);

  // Mock data
  const location = {
    id: locationId,
    name: 'الفرع الرئيسي - الرياض',
    type: 'فرع',
    status: 'نشط',
    address: 'طريق الملك فهد، الرياض',
    isDirectToMain: true,
    parentLocation: null
  };

  const shelves = [
    {
      id: '1',
      code: 'A-001',
      dispatchMethod: 'FEFO',
      onHandQty: 1250,
      capacity: 2000,
      productsCount: 45
    },
    {
      id: '2',
      code: 'A-002',
      dispatchMethod: 'FIFO',
      onHandQty: 890,
      capacity: 2000,
      productsCount: 32
    },
    {
      id: '3',
      code: 'B-001',
      dispatchMethod: 'FEFO',
      onHandQty: 1567,
      capacity: 2000,
      productsCount: 67
    },
    {
      id: '4',
      code: 'B-002',
      dispatchMethod: 'LIFO',
      onHandQty: 456,
      capacity: 2000,
      productsCount: 23
    },
    {
      id: '5',
      code: 'C-001',
      dispatchMethod: 'FEFO',
      onHandQty: 1823,
      capacity: 2000,
      productsCount: 89
    },
    {
      id: '6',
      code: 'C-002',
      dispatchMethod: 'FIFO',
      onHandQty: 234,
      capacity: 2000,
      productsCount: 12
    }
  ];

  const stats = [
    {
      label: 'إجمالي الأرفف',
      value: shelves.length.toString(),
      icon: Layers,
      color: 'blue'
    },
    {
      label: 'الكمية المخزنة',
      value: shelves.reduce((acc, shelf) => acc + shelf.onHandQty, 0).toString(),
      icon: Package,
      color: 'green'
    },
    {
      label: 'السعة الإجمالية',
      value: (shelves.length * 2000).toString(),
      icon: Building2,
      color: 'purple'
    },
    {
      label: 'نسبة الامتلاء',
      value: Math.round((shelves.reduce((acc, shelf) => acc + shelf.onHandQty, 0) / (shelves.length * 2000)) * 100) + '%',
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
        <span className="text-gray-900">{location.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl">{location.name}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
              {location.type}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${
                location.status === 'نشط'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {location.status}
            </span>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location.address}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span>تعديل</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>إلغاء</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>حفظ التعديلات</span>
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
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue'
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
                defaultValue={location.name}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">النوع</label>
              <select
                defaultValue={location.type}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>فرع</option>
                <option>مستودع</option>
                <option>خارجي</option>
                <option>حجر صحي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">الحالة</label>
              <select
                defaultValue={location.status}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>نشط</option>
                <option>معلق</option>
                <option>غير نشط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">الموقع الرئيسي</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">بدون</option>
                <option>مستودع الدمام</option>
                <option>فرع جدة</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">العنوان</label>
              <textarea
                rows={3}
                defaultValue={location.address}
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
                <th className="text-right px-6 py-4 text-sm text-gray-600">السعة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  نسبة الامتلاء
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  عدد المنتجات
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shelves.map((shelf) => {
                const fillPercentage = (shelf.onHandQty / shelf.capacity) * 100;
                
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
                        <span className="font-medium text-gray-900">{shelf.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {dispatchMethodLabels[shelf.dispatchMethod]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {shelf.onHandQty.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {shelf.capacity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fillPercentage >= 90
                                ? 'bg-red-500'
                                : fillPercentage >= 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {fillPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {shelf.productsCount} منتج
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shelf Dialog */}
      {showAddShelfDialog && (
        <AddShelfDialog onClose={() => setShowAddShelfDialog(false)} />
      )}
    </div>
  );
}

function AddShelfDialog({ onClose }: { onClose: () => void }) {
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
              رقم/رمز الرف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: A-001"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              طريقة الصرف <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="FEFO">الأقرب انتهاء أولاً (FEFO)</option>
              <option value="FIFO">الوارد أولاً صادر أولاً (FIFO)</option>
              <option value="LIFO">الوارد أخيراً صادر أولاً (LIFO)</option>
              <option value="MANUAL">يدوي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              السعة <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="2000"
              defaultValue={2000}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              الكمية الحالية
            </label>
            <input
              type="number"
              placeholder="0"
              defaultValue={0}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            حفظ الرف
          </button>
        </div>
      </div>
    </div>
  );
}
