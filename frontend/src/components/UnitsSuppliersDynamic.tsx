import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  X,
  Ruler,
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import {
  useMeasurementUnits,
  useCreateMeasurementUnit,
  useUpdateMeasurementUnit,
  useDeleteMeasurementUnit,
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier
} from '@/lib/query';

type Tab = 'units' | 'suppliers';

export function UnitsSuppliers() {
  const [activeTab, setActiveTab] = useState<Tab>('units');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [searchText, setSearchText] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>الرئيسية</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">الوحدات والموردون</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">الوحدات والموردون</h1>
          <p className="text-gray-600">إدارة وحدات القياس وبيانات الموردين</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'units' ? 'وحدة جديدة' : 'مورد جديد'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('units')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'units'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Ruler className="w-5 h-5" />
            <span>وحدات القياس</span>
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'suppliers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>الموردون</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'units' ? (
        <UnitsTab 
          searchText={searchText} 
          setSearchText={setSearchText}
          onEdit={(item) => {
            setEditItem(item);
            setShowCreateDialog(true);
          }}
        />
      ) : (
        <SuppliersTab 
          searchText={searchText} 
          setSearchText={setSearchText}
          onEdit={(item) => {
            setEditItem(item);
            setShowCreateDialog(true);
          }}
        />
      )}

      {/* Create/Edit Dialog */}
      {showCreateDialog && (
        <CreateDialog
          type={activeTab}
          editItem={editItem}
          onClose={() => {
            setShowCreateDialog(false);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
}

function UnitsTab({
  searchText,
  setSearchText,
  onEdit
}: {
  searchText: string;
  setSearchText: (value: string) => void;
  onEdit: (item: any) => void;
}) {
  const { data: unitsData, isLoading, isError } = useMeasurementUnits();
  const deleteMutation = useDeleteMeasurementUnit();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل تريد حذف وحدة القياس "${name}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUnits = unitsData?.filter(unit =>
    !searchText || unit.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

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
            placeholder="ابحث في وحدات القياس..."
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

      {/* Units Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            فشل تحميل وحدات القياس
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Ruler className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد وحدات قياس متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(unit)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id.toString(), unit.name)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{unit.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {unit.code || 'لا يوجد رمز'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SuppliersTab({
  searchText,
  setSearchText,
  onEdit
}: {
  searchText: string;
  setSearchText: (value: string) => void;
  onEdit: (item: any) => void;
}) {
  const { data: suppliersData, isLoading, isError } = useSuppliers({ name: searchText });
  const deleteMutation = useDeleteSupplier();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل تريد حذف المورد "${name}"؟`)) {
      deleteMutation.mutate(id);
    }
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
            placeholder="ابحث في الموردين..."
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

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            فشل تحميل الموردين
          </div>
        ) : !suppliersData || suppliersData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد موردين متاحين</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الاسم</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">جهة الاتصال</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الهاتف</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">البريد</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">العنوان</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliersData.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{supplier.supplierName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{supplier.activeStatus || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {supplier.supplierPhone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {supplier.supplierPhone}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {supplier.supplierEmail ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {supplier.supplierEmail}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {supplier.country ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {supplier.country}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(supplier)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id.toString(), supplier.supplierName)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
    </div>
  );
}

function CreateDialog({ type, editItem, onClose }: { type: Tab; editItem?: any; onClose: () => void }) {
  const [formData, setFormData] = useState<any>({
    name: editItem?.name || editItem?.supplierName || '',
    abbreviation: editItem?.code || '',
    contactPerson: '',
    phone: editItem?.phone || editItem?.supplierPhone || '',
    email: editItem?.email || editItem?.supplierEmail || '',
    country: editItem?.country || ''
  });

  const createUnitMutation = useCreateMeasurementUnit();
  const updateUnitMutation = useUpdateMeasurementUnit();
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();

  const handleSubmit = () => {
    if (type === 'units') {
      if (editItem) {
        updateUnitMutation.mutate(
          { unitId: editItem.id.toString(), data: { name: formData.name, code: formData.abbreviation, description: '' } },
          { onSuccess: () => onClose() }
        );
      } else {
        createUnitMutation.mutate(
          { name: formData.name, code: formData.abbreviation, description: '' },
          { onSuccess: () => onClose() }
        );
      }
    } else {
      const supplierData = {
        supplierName: formData.name,
        supplierPhone: formData.phone,
        supplierEmail: formData.email,
        country: formData.country,
        activeStatus: 'active' as const
      };
      
      if (editItem) {
        updateSupplierMutation.mutate(
          { supplierId: editItem.id.toString(), data: supplierData },
          { onSuccess: () => onClose() }
        );
      } else {
        createSupplierMutation.mutate(supplierData, {
          onSuccess: () => onClose()
        });
      }
    }
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">
            {editItem
              ? (type === 'units' ? 'تعديل وحدة القياس' : 'تعديل المورد')
              : (type === 'units' ? 'إضافة وحدة قياس جديدة' : 'إضافة مورد جديد')
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل الاسم"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === 'units' ? (
            <div>
              <label className="block text-sm text-gray-700 mb-2">الاختصار</label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                placeholder="مثال: كجم، لتر"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-2">جهة الاتصال</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="اسم جهة الاتصال"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 XX XXX XXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">العنوان</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="العنوان الكامل"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || createUnitMutation.isPending || createSupplierMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createUnitMutation.isPending || createSupplierMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'حفظ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
