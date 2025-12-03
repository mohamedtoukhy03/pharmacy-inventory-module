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
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';

type Tab = 'units' | 'suppliers';

export function UnitsSuppliers() {
  const [activeTab, setActiveTab] = useState<Tab>('units');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
        <UnitsTab searchText={searchText} setSearchText={setSearchText} />
      ) : (
        <SuppliersTab searchText={searchText} setSearchText={setSearchText} />
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateDialog type={activeTab} onClose={() => setShowCreateDialog(false)} />
      )}
    </div>
  );
}

function UnitsTab({
  searchText,
  setSearchText
}: {
  searchText: string;
  setSearchText: (value: string) => void;
}) {
  const units = [
    {
      id: '1',
      name: 'علبة',
      symbol: 'BOX',
      isBaseUnit: true,
      conversionFactor: 1,
      description: 'الوحدة الأساسية للتعبئة'
    },
    {
      id: '2',
      name: 'شريط',
      symbol: 'STRIP',
      isBaseUnit: false,
      conversionFactor: 0.1,
      description: 'شريط يحتوي على 10 أقراص'
    },
    {
      id: '3',
      name: 'قرص',
      symbol: 'TAB',
      isBaseUnit: false,
      conversionFactor: 0.01,
      description: 'قرص واحد'
    },
    {
      id: '4',
      name: 'زجاجة',
      symbol: 'BTL',
      isBaseUnit: true,
      conversionFactor: 1,
      description: 'زجاجة للسوائل'
    },
    {
      id: '5',
      name: 'كبسولة',
      symbol: 'CAP',
      isBaseUnit: false,
      conversionFactor: 0.01,
      description: 'كبسولة واحدة'
    },
    {
      id: '6',
      name: 'أنبوبة',
      symbol: 'TUBE',
      isBaseUnit: true,
      conversionFactor: 1,
      description: 'أنبوبة للكريمات والمراهم'
    }
  ];

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

      {/* Units Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الاسم</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الرمز</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                وحدة أساسية
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                معامل التحويل
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الوصف</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                      <Ruler className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{unit.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
                    {unit.symbol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {unit.isBaseUnit ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2 w-fit">
                      <CheckCircle className="w-4 h-4" />
                      نعم
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-2 w-fit">
                      <XCircle className="w-4 h-4" />
                      لا
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900 font-mono">
                    {unit.conversionFactor}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{unit.description}</td>
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

function SuppliersTab({
  searchText,
  setSearchText
}: {
  searchText: string;
  setSearchText: (value: string) => void;
}) {
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const suppliers = [
    {
      id: '1',
      name: 'الشركة الدولية للأدوية',
      phone: '+966501234567',
      email: 'info@intpharma.com',
      country: 'السعودية',
      currency: 'SAR',
      status: 'نشط',
      totalOrders: 145,
      rating: 4.8
    },
    {
      id: '2',
      name: 'الشركة العربية للأدوية',
      phone: '+966507654321',
      email: 'contact@arabpharma.com',
      country: 'الأردن',
      currency: 'JOD',
      status: 'نشط',
      totalOrders: 89,
      rating: 4.5
    },
    {
      id: '3',
      name: 'مصنع الأدوية الوطني',
      phone: '+966509876543',
      email: 'sales@natpharma.com',
      country: 'مصر',
      currency: 'EGP',
      status: 'نشط',
      totalOrders: 234,
      rating: 4.9
    },
    {
      id: '4',
      name: 'شركة المكملات الصحية',
      phone: '+966502468135',
      email: 'info@healthsup.com',
      country: 'الإمارات',
      currency: 'AED',
      status: 'معلق',
      totalOrders: 45,
      rating: 4.2
    },
    {
      id: '5',
      name: 'شركة العناية الشخصية',
      phone: '+966503691472',
      email: 'contact@personalcare.com',
      country: 'الكويت',
      currency: 'KWD',
      status: 'نشط',
      totalOrders: 178,
      rating: 4.6
    }
  ];

  return (
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
              placeholder="ابحث عن مورد..."
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
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الدول</option>
            <option>السعودية</option>
            <option>الأردن</option>
            <option>مصر</option>
            <option>الإمارات</option>
            <option>الكويت</option>
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

      {/* Suppliers Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(supplier.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 mr-1">
                        {supplier.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    supplier.status === 'نشط'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {supplier.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{supplier.currency}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm text-gray-600">إجمالي الطلبات</div>
                  <div className="text-xl text-gray-900 mt-1">
                    {supplier.totalOrders}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateDialog({
  type,
  onClose
}: {
  type: 'units' | 'suppliers';
  onClose: () => void;
}) {
  const [isBaseUnit, setIsBaseUnit] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">
            {type === 'units' ? 'إنشاء وحدة قياس جديدة' : 'إنشاء مورد جديد'}
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
          {type === 'units' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: علبة"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  الرمز <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: BOX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  معامل التحويل <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1.00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">الوصف</label>
                <textarea
                  rows={3}
                  placeholder="وصف الوحدة..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">وحدة أساسية</div>
                  <div className="text-sm text-gray-600">
                    هل هذه وحدة القياس الأساسية؟
                  </div>
                </div>
                <button
                  onClick={() => setIsBaseUnit(!isBaseUnit)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isBaseUnit ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isBaseUnit ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  اسم المورد <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="أدخل اسم المورد"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+966XXXXXXXXX"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">الدولة</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>السعودية</option>
                    <option>الأردن</option>
                    <option>مصر</option>
                    <option>الإمارات</option>
                    <option>الكويت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">العملة</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>SAR - ريال سعودي</option>
                    <option>JOD - دينار أردني</option>
                    <option>EGP - جنيه مصري</option>
                    <option>AED - درهم إماراتي</option>
                    <option>KWD - دينار كويتي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">الحالة</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>نشط</option>
                  <option>معلق</option>
                  <option>غير نشط</option>
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
