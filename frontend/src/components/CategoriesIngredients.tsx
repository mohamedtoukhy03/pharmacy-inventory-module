import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  X,
  Tag,
  Pill,
  Search,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

type Tab = 'categories' | 'ingredients';

export function CategoriesIngredients() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>الرئيسية</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">التصنيفات والمكونات</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">التصنيفات والمكونات</h1>
          <p className="text-gray-600">
            إدارة تصنيفات المنتجات والمكونات الفعالة
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'categories' ? 'تصنيف جديد' : 'مكوِّن جديد'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span>التصنيفات</span>
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ingredients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Pill className="w-5 h-5" />
            <span>المكونات</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' ? (
        <CategoriesTab searchText={searchText} setSearchText={setSearchText} />
      ) : (
        <IngredientsTab searchText={searchText} setSearchText={setSearchText} />
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

function CategoriesTab({
  searchText,
  setSearchText
}: {
  searchText: string;
  setSearchText: (value: string) => void;
}) {
  const categories = [
    {
      id: '1',
      name: 'أدوية القلب',
      description: 'أدوية علاج أمراض القلب والأوعية الدموية',
      productsCount: 145
    },
    {
      id: '2',
      name: 'المضادات الحيوية',
      description: 'أدوية مضادة للعدوى البكتيرية',
      productsCount: 89
    },
    {
      id: '3',
      name: 'مسكنات الألم',
      description: 'أدوية تسكين الألم وخفض الحرارة',
      productsCount: 234
    },
    {
      id: '4',
      name: 'الفيتامينات والمكملات',
      description: 'فيتامينات ومكملات غذائية',
      productsCount: 178
    },
    {
      id: '5',
      name: 'العناية الشخصية',
      description: 'منتجات العناية الشخصية والتجميل',
      productsCount: 312
    },
    {
      id: '6',
      name: 'أدوية الجهاز الهضمي',
      description: 'أدوية علاج أمراض الجهاز الهضمي',
      productsCount: 67
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
            placeholder="ابحث في التصنيفات..."
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

      {/* Categories Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Tag className="w-6 h-6" />
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
              <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">عدد المنتجات</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  {category.productsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IngredientsTab({
  searchText,
  setSearchText
}: {
  searchText: string;
  setSearchText: (value: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const ingredients = [
    {
      id: '1',
      name: 'Acetylsalicylic Acid',
      description: 'حمض الأسيتيل ساليسيليك - مسكن للألم ومضاد للالتهاب',
      isActive: true,
      productsCount: 45
    },
    {
      id: '2',
      name: 'Paracetamol',
      description: 'باراسيتامول - مسكن للألم وخافض للحرارة',
      isActive: true,
      productsCount: 78
    },
    {
      id: '3',
      name: 'Amoxicillin',
      description: 'أموكسيسيلين - مضاد حيوي واسع الطيف',
      isActive: true,
      productsCount: 34
    },
    {
      id: '4',
      name: 'Ibuprofen',
      description: 'إيبوبروفين - مسكن للألم ومضاد للالتهاب',
      isActive: true,
      productsCount: 56
    },
    {
      id: '5',
      name: 'Omeprazole',
      description: 'أوميبرازول - مثبط مضخة البروتون',
      isActive: true,
      productsCount: 23
    },
    {
      id: '6',
      name: 'Metformin',
      description: 'ميتفورمين - علاج السكري من النوع الثاني',
      isActive: false,
      productsCount: 12
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
              placeholder="ابحث في المكونات..."
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

          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              نشط
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              غير نشط
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-6 py-4 text-sm text-gray-600">اسم المكوِّن</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الوصف</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">الحالة</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">
                المنتجات المرتبطة
              </th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                      <Pill className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600 line-clamp-1">{ingredient.description}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 w-fit ${
                      ingredient.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ingredient.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        نشط
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        غير نشط
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    {ingredient.productsCount} منتج
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
  type: 'categories' | 'ingredients';
  onClose: () => void;
}) {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">
            {type === 'categories' ? 'إنشاء تصنيف جديد' : 'إنشاء مكوِّن جديد'}
          </h2>
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
              placeholder={
                type === 'categories' ? 'أدخل اسم التصنيف' : 'أدخل اسم المكوِّن'
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">الوصف</label>
            <textarea
              rows={4}
              placeholder="أدخل الوصف..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === 'ingredients' && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">الحالة</div>
                <div className="text-sm text-gray-600">هل المكوِّن نشط؟</div>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  isActive ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    isActive ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
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
