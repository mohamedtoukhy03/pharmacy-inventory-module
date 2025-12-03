import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  X,
  MapPin,
  Building2,
  Warehouse,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: string;
  status: string;
  address: string;
  isDirectToMain: boolean;
  shelvesCount: number;
  productsCount: number;
}

interface LocationsListProps {
  onNavigate: (page: 'location-detail', id: string) => void;
}

export function LocationsList({ onNavigate }: LocationsListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const locations: Location[] = [
    {
      id: '1',
      name: 'الفرع الرئيسي - الرياض',
      type: 'فرع',
      status: 'نشط',
      address: 'طريق الملك فهد، الرياض',
      isDirectToMain: true,
      shelvesCount: 45,
      productsCount: 1247
    },
    {
      id: '2',
      name: 'فرع جدة',
      type: 'فرع',
      status: 'نشط',
      address: 'شارع التحلية، جدة',
      isDirectToMain: false,
      shelvesCount: 32,
      productsCount: 856
    },
    {
      id: '3',
      name: 'مستودع الدمام',
      type: 'مستودع',
      status: 'نشط',
      address: 'المنطقة الصناعية الثانية، الدمام',
      isDirectToMain: false,
      shelvesCount: 120,
      productsCount: 3456
    },
    {
      id: '4',
      name: 'فرع الخبر',
      type: 'فرع',
      status: 'نشط',
      address: 'الكورنيش الشمالي، الخبر',
      isDirectToMain: false,
      shelvesCount: 28,
      productsCount: 734
    },
    {
      id: '5',
      name: 'مستودع الحجر الصحي',
      type: 'حجر صحي',
      status: 'نشط',
      address: 'المستودع المركزي، الرياض',
      isDirectToMain: false,
      shelvesCount: 15,
      productsCount: 89
    },
    {
      id: '6',
      name: 'فرع المدينة المنورة',
      type: 'فرع',
      status: 'معلق',
      address: 'شارع قباء، المدينة المنورة',
      isDirectToMain: false,
      shelvesCount: 18,
      productsCount: 456
    }
  ];

  const typeIcons = {
    'فرع': Building2,
    'مستودع': Warehouse,
    'حجر صحي': Home,
    'خارجي': MapPin
  };

  const stats = [
    {
      label: 'إجمالي المواقع',
      value: '12',
      icon: MapPin,
      color: 'blue',
      subtext: 'موقع نشط'
    },
    {
      label: 'الفروع',
      value: '8',
      icon: Building2,
      color: 'green',
      subtext: 'فرع نشط'
    },
    {
      label: 'المستودعات',
      value: '3',
      icon: Warehouse,
      color: 'purple',
      subtext: 'مستودع نشط'
    },
    {
      label: 'إجمالي الأرفف',
      value: '258',
      icon: CheckCircle,
      color: 'orange',
      subtext: 'رف مخصص'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>الرئيسية</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">المواقع</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">المواقع</h1>
          <p className="text-gray-600">إدارة الفروع والمستودعات ومواقع التخزين</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>موقع جديد</span>
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
            <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث عن موقع..."
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

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">كل الأنواع</option>
              <option>فرع</option>
              <option>مستودع</option>
              <option>خارجي</option>
              <option>حجر صحي</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">كل الحالات</option>
              <option>نشط</option>
              <option>معلق</option>
              <option>غير نشط</option>
            </select>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locations.map((location) => {
              const IconComponent = typeIcons[location.type as keyof typeof typeIcons] || MapPin;
              
              return (
                <div
                  key={location.id}
                  className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all bg-gradient-to-br from-white to-gray-50"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{location.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3" />
                          {location.address}
                        </p>
                      </div>
                    </div>
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

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">النوع</div>
                      <div className="font-medium text-gray-900">{location.type}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">عدد الأرفف</div>
                      <div className="font-medium text-gray-900">{location.shelvesCount}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">عدد المنتجات</div>
                      <div className="font-medium text-gray-900">{location.productsCount}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">موقع رئيسي</div>
                      <div className="flex items-center gap-1">
                        {location.isDirectToMain ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">نعم</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">لا</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onNavigate('location-detail', location.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>تفاصيل</span>
                    </button>
                    <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Location Dialog */}
      {showCreateDialog && (
        <CreateLocationDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </div>
  );
}

function CreateLocationDialog({ onClose }: { onClose: () => void }) {
  const [isDirectToMain, setIsDirectToMain] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">إنشاء موقع جديد</h2>
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
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل اسم الموقع"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                النوع <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>فرع</option>
                <option>مستودع</option>
                <option>خارجي</option>
                <option>حجر صحي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                الحالة <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>نشط</option>
                <option>معلق</option>
                <option>غير نشط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">العنوان</label>
            <textarea
              rows={3}
              placeholder="أدخل العنوان الكامل"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">الموقع الرئيسي</label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">بدون</option>
              <option>الفرع الرئيسي - الرياض</option>
              <option>مستودع الدمام</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">موقع رئيسي</div>
              <div className="text-sm text-gray-600">
                حدد إذا كان هذا موقع رئيسي
              </div>
            </div>
            <button
              onClick={() => setIsDirectToMain(!isDirectToMain)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isDirectToMain ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isDirectToMain ? 'right-1' : 'left-1'
                }`}
              />
            </button>
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
            حفظ الموقع
          </button>
        </div>
      </div>
    </div>
  );
}
