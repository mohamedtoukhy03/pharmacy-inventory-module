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
  AlertTriangle
} from 'lucide-react';
import {
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation
} from '../lib/query';
import type { Location, LocationType, LocationStatus } from '../lib/api/types';

interface LocationsListProps {
  onNavigate: (page: 'location-detail', id: string) => void;
}

export function LocationsListDynamic({ onNavigate }: LocationsListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<LocationType | ''>('');
  const [statusFilter, setStatusFilter] = useState<LocationStatus | ''>('');

  // Fetch locations
  const { data: locations = [], isLoading, error } = useLocations({
    name: searchText || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  // Get stats from locations
  const stats = [
    {
      label: 'إجمالي المواقع',
      value: locations.length.toString(),
      icon: MapPin,
      color: 'blue',
      subtext: 'موقع نشط'
    },
    {
      label: 'الفروع',
      value: locations.filter(l => l.locationType === 'branch').length.toString(),
      icon: Building2,
      color: 'green',
      subtext: 'فرع نشط'
    },
    {
      label: 'المستودعات',
      value: locations.filter(l => l.locationType === 'warehouse').length.toString(),
      icon: Warehouse,
      color: 'purple',
      subtext: 'مستودع نشط'
    },
    {
      label: 'إجمالي الأرفف',
      value: locations.reduce((sum, l) => sum + (l.shelfCount || 0), 0).toString(),
      icon: CheckCircle,
      color: 'orange',
      subtext: 'رف مخصص'
    }
  ];

  const typeIcons: Record<LocationType, any> = {
    'branch': Building2,
    'warehouse': Warehouse,
    'external': MapPin,
    'supplier': Building2,
    'quarantine': AlertTriangle,
    'clinic': Building2
  };

  const typeLabels: Record<LocationType, string> = {
    'branch': 'فرع',
    'warehouse': 'مستودع',
    'external': 'خارجي',
    'supplier': 'مورد',
    'quarantine': 'حجر صحي',
    'clinic': 'عيادة'
  };

  const statusLabels: Record<LocationStatus, string> = {
    'active': 'نشط',
    'inactive': 'غير نشط'
  };

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
              onChange={(e) => setTypeFilter(e.target.value as LocationType | '')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">كل الأنواع</option>
              <option value="branch">فرع</option>
              <option value="warehouse">مستودع</option>
              <option value="external">خارجي</option>
              <option value="clinic">عيادة</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LocationStatus | '')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">معلق</option>
              <option value="inactive">غير نشط</option>
            </select>
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
            <div className="text-red-600 mb-2">حدث خطأ أثناء تحميل المواقع</div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && locations.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد مواقع</p>
          </div>
        )}

        {/* Locations Grid */}
        {!isLoading && !error && locations.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {locations.map((location) => {
                const IconComponent = typeIcons[location.locationType] || MapPin;
                
                return (
                  <LocationCard
                    key={location.id}
                    location={location}
                    IconComponent={IconComponent}
                    typeLabel={typeLabels[location.locationType]}
                    statusLabel={statusLabels[location.status]}
                    onEdit={() => setEditingLocation(location)}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Location Dialog */}
      {(showCreateDialog || editingLocation) && (
        <LocationDialog
          location={editingLocation}
          onClose={() => {
            setShowCreateDialog(false);
            setEditingLocation(null);
          }}
        />
      )}
    </div>
  );
}

interface LocationCardProps {
  location: Location;
  IconComponent: any;
  typeLabel: string;
  statusLabel: string;
  onEdit: () => void;
  onNavigate: (page: 'location-detail', id: string) => void;
}

function LocationCard({ location, IconComponent, typeLabel, statusLabel, onEdit, onNavigate }: LocationCardProps) {
  const deleteMutation = useDeleteLocation();

  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف الموقع "${location.locationName}"?`)) {
      deleteMutation.mutate(location.id);
    }
  };

  return (
    <div className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{location.locationName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3" />
              {location.address || 'لا يوجد عنوان'}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-sm ${
            location.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">النوع</div>
          <div className="font-medium text-gray-900">{typeLabel}</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">عدد الأرفف</div>
          <div className="font-medium text-gray-900">{location.shelfCount || 0}</div>
        </div>
        <div className="p-3 bg-green-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">عدد المنتجات</div>
          <div className="font-medium text-gray-900">{location.productCount || 0}</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">موقع رئيسي</div>
          <div className="flex items-center gap-1">
            {location.parentLocationId ? (
              <>
                <XCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">لا</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">نعم</span>
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
        <button 
          onClick={onEdit}
          className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface LocationDialogProps {
  location: Location | null;
  onClose: () => void;
}

function LocationDialog({ location, onClose }: LocationDialogProps) {
  const [formData, setFormData] = useState({
    locationName: location?.locationName || '',
    locationType: location?.locationType || ('branch' as LocationType),
    status: location?.status || ('active' as LocationStatus),
    address: location?.address || '',
    parentLocationId: location?.parentLocationId || null,
    isDirectToMain: location?.isDirectToMain || false,
  });

  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      locationName: formData.locationName,
      locationType: formData.locationType,
      status: formData.status,
      address: formData.address || undefined,
      parentLocationId: formData.parentLocationId ? Number(formData.parentLocationId) : null,
      isDirectToMain: formData.isDirectToMain,
    };

    try {
      if (location) {
        await updateMutation.mutateAsync({ locationId: location.id, data: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error is handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">{location ? 'تعديل موقع' : 'إنشاء موقع جديد'}</h2>
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
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              placeholder="أدخل اسم الموقع"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                النوع <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.locationType}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value as LocationType })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="branch">فرع</option>
                <option value="warehouse">مستودع</option>
                <option value="external">خارجي</option>
                <option value="supplier">مورد</option>
                <option value="quarantine">حجر صحي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                الحالة <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LocationStatus })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">نشط</option>
                <option value="suspended">معلق</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">العنوان</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              placeholder="أدخل العنوان الكامل"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">موقع رئيسي</div>
              <div className="text-sm text-gray-600">حدد إذا كان هذا موقع رئيسي</div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isDirectToMain: !formData.isDirectToMain })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.isDirectToMain ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.isDirectToMain ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) ? 'جاري الحفظ...' : location ? 'تحديث الموقع' : 'حفظ الموقع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
