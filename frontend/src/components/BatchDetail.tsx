import { useState } from 'react';
import {
  ChevronLeft,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  Layers,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BatchDetailProps {
  batchId: string;
  onNavigate: (page: any) => void;
}

export function BatchDetail({ batchId, onNavigate }: BatchDetailProps) {
  const [showAddShelfDialog, setShowAddShelfDialog] = useState(false);

  // Mock batch data
  const batch = {
    id: batchId,
    product: 'أسبرين 100 مجم',
    location: 'الفرع الرئيسي - الرياض',
    batchNumber: 'BTH-2024-001',
    quantity: 500,
    cost: 12.50,
    supplier: 'الشركة الدولية للأدوية',
    manufacturingDate: '2024-01-15',
    expiryDate: '2026-01-15',
    receivingDate: '2024-01-20',
    stockType: 'متاح',
    daysToExpiry: 395
  };

  const allocatedShelves = [
    {
      id: '1',
      shelfCode: 'A-001',
      quantity: 200,
      threshold: 50,
      fillPercentage: 75,
      dispatchMethod: 'FEFO'
    },
    {
      id: '2',
      shelfCode: 'A-002',
      quantity: 150,
      threshold: 40,
      fillPercentage: 60,
      dispatchMethod: 'FEFO'
    },
    {
      id: '3',
      shelfCode: 'B-001',
      quantity: 150,
      threshold: 50,
      fillPercentage: 55,
      dispatchMethod: 'FEFO'
    }
  ];

  const stats = [
    {
      label: 'الكمية الإجمالية',
      value: batch.quantity.toString(),
      icon: Package,
      color: 'blue'
    },
    {
      label: 'الكمية المخصصة',
      value: allocatedShelves.reduce((sum, shelf) => sum + shelf.quantity, 0).toString(),
      icon: Layers,
      color: 'green'
    },
    {
      label: 'الكمية غير المخصصة',
      value: (batch.quantity - allocatedShelves.reduce((sum, shelf) => sum + shelf.quantity, 0)).toString(),
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      label: 'عدد الأرفف',
      value: allocatedShelves.length.toString(),
      icon: Layers,
      color: 'purple'
    }
  ];

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
            <h1 className="text-2xl">{batch.product}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono">
              {batch.batchNumber}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${
                batch.stockType === 'متاح'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {batch.stockType}
            </span>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {batch.location}
          </p>
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
                    : stat.color === 'yellow'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-purple-100 text-purple-600'
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
            <p className="font-medium text-gray-900">{batch.product}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">الموقع</span>
            </div>
            <p className="font-medium text-gray-900">{batch.location}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">المورد</span>
            </div>
            <p className="font-medium text-gray-900">{batch.supplier}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">التكلفة</span>
            </div>
            <p className="font-medium text-gray-900">{batch.cost.toFixed(2)} ر.س</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">تاريخ التصنيع</span>
            </div>
            <p className="font-medium text-gray-900">{batch.manufacturingDate}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">تاريخ الانتهاء</span>
            </div>
            <p className="font-medium text-gray-900">{batch.expiryDate}</p>
            <p
              className={`text-xs mt-1 ${
                batch.daysToExpiry <= 90
                  ? 'text-red-600'
                  : batch.daysToExpiry <= 180
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              {batch.daysToExpiry} يوم متبقي
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">تاريخ الاستلام</span>
            </div>
            <p className="font-medium text-gray-900">{batch.receivingDate}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">نوع المخزون</span>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-lg text-sm ${
                batch.stockType === 'متاح'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {batch.stockType}
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

        {/* Shelves Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الرف</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  العتبة الدنيا
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  نسبة الامتلاء
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">
                  طريقة الصرف
                </th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allocatedShelves.map((shelf) => (
                <tr
                  key={shelf.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">{shelf.shelfCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xl font-medium text-gray-900">
                      {shelf.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{shelf.threshold}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            shelf.fillPercentage >= 90
                              ? 'bg-red-500'
                              : shelf.fillPercentage >= 70
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${shelf.fillPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {shelf.fillPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                      {shelf.dispatchMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {shelf.quantity > shelf.threshold ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2 w-fit">
                        <CheckCircle className="w-4 h-4" />
                        جيد
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm flex items-center gap-2 w-fit">
                        <AlertTriangle className="w-4 h-4" />
                        منخفض
                      </span>
                    )}
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

        {allocatedShelves.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد أرفف مخصصة لهذه الدفعة</p>
          </div>
        )}
      </div>

      {/* Add Shelf Dialog */}
      {showAddShelfDialog && (
        <AddShelfDialog onClose={() => setShowAddShelfDialog(false)} />
      )}
    </div>
  );
}

function AddShelfDialog({ onClose }: { onClose: () => void }) {
  const availableShelves = [
    { id: '4', code: 'C-001', capacity: 2000, used: 800 },
    { id: '5', code: 'C-002', capacity: 2000, used: 1200 },
    { id: '6', code: 'D-001', capacity: 2000, used: 500 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              اختر الرف <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">اختر رف...</option>
              {availableShelves.map((shelf) => (
                <option key={shelf.id} value={shelf.id}>
                  {shelf.code} - متاح: {shelf.capacity - shelf.used} من {shelf.capacity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              الكمية <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="أدخل الكمية"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              الكمية المتبقية من الدفعة: 500 وحدة
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              العتبة الدنيا
            </label>
            <input
              type="number"
              placeholder="50"
              defaultValue={50}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              سيتم التنبيه عند انخفاض الكمية عن هذا الحد
            </p>
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
            إضافة الرف
          </button>
        </div>
      </div>
    </div>
  );
}
