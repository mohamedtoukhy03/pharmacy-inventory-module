import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
  Tag,
  Pill,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProductCategories,
  useProductIngredients,
  useCategories,
  useIngredients,
  useAddProductCategory,
  useRemoveProductCategory,
  useAddProductIngredient,
  useRemoveProductIngredient
} from '@/lib/query';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: any) => void;
}

type Tab = 'overview' | 'categories' | 'ingredients';

export function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddIngredientDialog, setShowAddIngredientDialog] = useState(false);
  const [ingredientFormData, setIngredientFormData] = useState({ ingredientId: '', amount: 0 });

  // Fetch product data
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: productCategories = [] } = useProductCategories(productId);
  const { data: productIngredients = [] } = useProductIngredients(productId);
  const { data: allCategories = [] } = useCategories();
  const { data: allIngredients = [] } = useIngredients();

  // Mutations
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const addCategoryMutation = useAddProductCategory();
  const removeCategoryMutation = useRemoveProductCategory();
  const addIngredientMutation = useAddProductIngredient();
  const removeIngredientMutation = useRemoveProductIngredient();

  // Prepare data for rendering
  const categories = productCategories;
  const ingredients = productIngredients;
  const availableCategories = allCategories.filter(
    cat => !categories.find(c => c.id === cat.id)
  );
  const availableIngredients = allIngredients.filter(
    ing => !ingredients.find(i => i.ingredientId === ing.id)
  );

  // Initialize form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        barcode: product.barcode || '',
        sku: product.sku || '',
        scientificName: product.scientificName || '',
        description: product.description || '',
        cost: product.cost || 0,
        sellingPrice: product.sellingPrice || 0,
        isDrug: product.isDrug || false,
        controlledSubstance: product.controlledSubstance || false,
        measurementUnitId: product.measurementUnitId || null
      });
    }
  }, [product]);

  const handleSave = () => {
    updateMutation.mutate(
      { productId, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('تم حفظ المنتج بنجاح');
        },
        onError: (error: any) => {
          alert('فشل حفظ المنتج: ' + (error?.message || 'خطأ غير معروف'));
        }
      }
    );
  };

  const handleDelete = () => {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
      deleteMutation.mutate(productId, {
        onSuccess: () => onNavigate('products'),
        onError: (error: any) => {
          alert('فشل حذف المنتج: ' + (error?.message || 'خطأ غير معروف'));
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

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">فشل تحميل بيانات المنتج</p>
          <button onClick={() => onNavigate('products')} className="text-blue-600">
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={() => onNavigate('products')} className="hover:text-gray-900">
          المنتجات
        </button>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl">{product.name}</h1>
            {product.isDrug && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                <Pill className="w-4 h-4" />
                دواء
              </span>
            )}
            {product.controlledSubstance && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                خاضع للرقابة
              </span>
            )}
          </div>
          <p className="text-gray-600">SKU: {product.sku}</p>
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
                <span>حفظ المنتج</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            التصنيفات
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'ingredients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            المكونات
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg mb-6">معلومات المنتج</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">الاسم</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.name || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">الباركود</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.barcode || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">SKU</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.sku || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">الاسم العلمي</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.scientificName || ''}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.scientificName || '-'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">الوصف</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.description || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">التركيز</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.strength || ''}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.strength}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">الشركة المُصنِِّعة</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">التصنيف الأساسي</label>
                {isEditing ? (
                  <select
                    value={formData.primaryCategory || ''}
                    onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>أدوية القلب</option>
                    <option>المضادات الحيوية</option>
                    <option>مسكنات الألم</option>
                  </select>
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">
                    {product.primaryCategory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">وحدة القياس</label>
                {isEditing ? (
                  <select
                    value={formData.measurementUnit || ''}
                    onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>علبة</option>
                    <option>شريط</option>
                    <option>قرص</option>
                    <option>زجاجة</option>
                  </select>
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">
                    {product.measurementUnit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">سعر البيع</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice || 0}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">
                    {product.sellingPrice.toFixed(2)} ر.س
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">كمية إعادة الطلب</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.reorderQty || 0}
                    onChange={(e) => setFormData({ ...formData, reorderQty: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">{product.reorderQty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  المخزون الدوري الأدنى
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.minCyclicStock || 0}
                    onChange={(e) => setFormData({ ...formData, minCyclicStock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">
                    {product.minCyclicStock}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  مخزون الأمان الأدنى
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.minSafetyStock || 0}
                    onChange={(e) => setFormData({ ...formData, minSafetyStock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-lg">
                    {product.minSafetyStock}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">هل هو دواء؟</div>
                    <div className="text-sm text-gray-600">حدد إذا كان المنتج دواء</div>
                  </div>
                  {isEditing ? (
                    <button
                      onClick={() => setFormData({ ...formData, isDrug: !formData.isDrug })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${formData.isDrug ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.isDrug ? 'right-1' : 'left-1'
                          }`}
                      />
                    </button>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-lg ${product.isDrug
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {product.isDrug ? 'نعم' : 'لا'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">
                      مادة خاضعة للرقابة؟
                    </div>
                    <div className="text-sm text-gray-600">
                      حدد إذا كان المنتج خاضع للرقابة
                    </div>
                  </div>
                  {isEditing ? (
                    <button
                      onClick={() => setFormData({ ...formData, controlledSubstance: !formData.controlledSubstance })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${formData.controlledSubstance ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.controlledSubstance ? 'right-1' : 'left-1'
                          }`}
                      />
                    </button>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-lg ${product.controlledSubstance
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {product.controlledSubstance ? 'نعم' : 'لا'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">تصنيفات المنتج</h3>
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl group hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                          <Tag className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <button
                        onClick={() => removeCategoryMutation.mutate({ productId, categoryId: category.id })}
                        disabled={removeCategoryMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>لا توجد تصنيفات مرتبطة</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Categories */}
              <div>
                <h3 className="text-lg mb-4">إضافة تصنيفات</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      اختر التصنيفات
                    </label>
                    <select
                      multiple
                      value={selectedCategories}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedCategories(selected);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedCategories.length > 0) {
                        selectedCategories.forEach(categoryId => {
                          addCategoryMutation.mutate({ productId, categoryId });
                        });
                        setSelectedCategories([]);
                      }
                    }}
                    disabled={selectedCategories.length === 0 || addCategoryMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addCategoryMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    <span>ربط التصنيفات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg">مكونات المنتج</h3>
              <button
                onClick={() => setShowAddIngredientDialog(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة مكوِّن</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-right px-6 py-4 text-sm text-gray-600">
                      اسم المكوِّن
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-gray-600">الكمية</th>
                    <th className="text-right px-6 py-4 text-sm text-gray-600">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.ingredientId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <Pill className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{ingredient.ingredientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg">
                          {ingredient.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Set up for editing - populate form and show dialog
                              setIngredientFormData({
                                ingredientId: ingredient.ingredientId,
                                amount: ingredient.amount
                              });
                              setShowAddIngredientDialog(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeIngredientMutation.mutate({ productId, ingredientId: ingredient.ingredientId })}
                            disabled={removeIngredientMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {ingredients.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا توجد مكونات مسجلة لهذا المنتج</p>
              </div>
            )}

            {/* Add Ingredient Dialog */}
            {showAddIngredientDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
                  <h3 className="text-xl font-semibold mb-6">إضافة مكوِّن</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المكوِّن <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={ingredientFormData.ingredientId}
                        onChange={(e) => setIngredientFormData({ ...ingredientFormData, ingredientId: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر المكوِّن</option>
                        {availableIngredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                      {availableIngredients.length === 0 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          لا توجد مكونات متاحة. جميع المكونات مضافة بالفعل أو لا توجد مكونات في النظام.
                        </p>
                      )}
                      {availableIngredients.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {availableIngredients.length} مكون متاح
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">الكمية</label>
                      <input
                        type="number"
                        value={ingredientFormData.amount}
                        onChange={(e) => setIngredientFormData({ ...ingredientFormData, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل الكمية"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        if (!ingredientFormData.ingredientId || ingredientFormData.amount <= 0) {
                          alert('يرجى اختيار المكوِّن وإدخال كمية صحيحة');
                          return;
                        }
                        addIngredientMutation.mutate(
                          {
                            productId,
                            data: {
                              ingredientId: ingredientFormData.ingredientId,
                              amount: ingredientFormData.amount
                            }
                          },
                          {
                            onSuccess: () => {
                              setShowAddIngredientDialog(false);
                              setIngredientFormData({ ingredientId: '', amount: 0 });
                            },
                            onError: (error: any) => {
                              alert('فشل إضافة المكوِّن: ' + (error?.message || 'خطأ غير معروف'));
                            }
                          }
                        );
                      }}
                      disabled={addIngredientMutation.isPending}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {addIngredientMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جاري الإضافة...
                        </>
                      ) : (
                        'إضافة'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddIngredientDialog(false);
                        setIngredientFormData({ ingredientId: '', amount: 0 });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
