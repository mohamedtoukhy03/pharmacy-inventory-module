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
  Loader2
} from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useIngredients,
  useCreateIngredient,
  useDeleteIngredient
} from '@/lib/query';

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
  const { data: categoriesData, isLoading, isError } = useCategories();
  const deleteMutation = useDeleteCategory();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل تريد حذف التصنيف "${name}"؟`)) {
      deleteMutation.mutate(id.toString());
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            فشل تحميل التصنيفات
          </div>
        ) : !categoriesData || categoriesData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد تصنيفات متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData.filter(cat => 
              !searchText || cat.name.toLowerCase().includes(searchText.toLowerCase())
            ).map((category) => (
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
                    <button 
                      onClick={() => handleDelete(category.id.toString(), category.name)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description || 'لا يوجد وصف'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">التصنيف</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
  const { data: ingredientsData, isLoading, isError } = useIngredients();
  const deleteMutation = useDeleteIngredient();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل تريد حذف المكون "${name}"؟`)) {
      deleteMutation.mutate(id.toString());
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
      </div>

      {/* Ingredients Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            فشل تحميل المكونات
          </div>
        ) : !ingredientsData || ingredientsData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد مكونات متاحة</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الاسم</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">الوصف</th>
                <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredientsData.filter(ing => 
                !searchText || ing.name.toLowerCase().includes(searchText.toLowerCase())
              ).map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Pill className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{ingredient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ingredient.description || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id.toString(), ingredient.name)}
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

function CreateDialog({ type, onClose }: { type: Tab; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCategoryMutation = useCreateCategory();
  const createIngredientMutation = useCreateIngredient();

  const handleSubmit = () => {
    if (type === 'categories') {
      createCategoryMutation.mutate({ name, description }, {
        onSuccess: () => onClose()
      });
    } else {
      createIngredientMutation.mutate({ name, description }, {
        onSuccess: () => onClose()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl">
            {type === 'categories' ? 'إضافة تصنيف جديد' : 'إضافة مكوِّن جديد'}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل الاسم"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">الوصف</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل الوصف"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            disabled={!name || createCategoryMutation.isPending || createIngredientMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {createCategoryMutation.isPending || createIngredientMutation.isPending ? (
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
