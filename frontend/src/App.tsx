import { useState } from 'react';
import { 
  Package, 
  Layers,
  Users, 
  MapPin, 
  Archive,
  Menu,
  X
} from 'lucide-react';
import { ProductsList } from './components/ProductsList';
import { ProductDetail } from './components/ProductDetail';
import { CategoriesIngredients } from './components/CategoriesIngredientsDynamic';
import { UnitsSuppliers } from './components/UnitsSuppliersDynamic';
import { LocationsListDynamic as LocationsList } from './components/LocationsListDynamic';
import { LocationDetail } from './components/LocationDetail';
import { StockManagementDynamic as StockManagement } from './components/StockManagementDynamic';
import { BatchDetailDynamic as BatchDetail } from './components/BatchDetailDynamic';
import { ErrorBoundary } from './components/ErrorBoundary';

type Page = 
  | 'products'
  | 'product-detail'
  | 'categories-ingredients'
  | 'units-suppliers'
  | 'locations'
  | 'location-detail'
  | 'stock-management'
  | 'batch-detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('products');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const masterDataMenu = [
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'categories-ingredients', label: 'التصنيفات والمكونات', icon: Layers },
    { id: 'units-suppliers', label: 'الوحدات والموردين', icon: Users },
  ];

  const stockMenu = [
    { id: 'locations', label: 'المواقع', icon: MapPin },
    { id: 'stock-management', label: 'إدارة المخزون', icon: Archive },
  ];

  const handleNavigate = (page: Page, id?: string) => {
    if (page === 'product-detail' && id) {
      setSelectedProductId(id);
    } else if (page === 'location-detail' && id) {
      setSelectedLocationId(id);
    } else if (page === 'batch-detail' && id) {
      setSelectedBatchId(id);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل صفحة المنتجات">
            <ProductsList onNavigate={handleNavigate} />
          </ErrorBoundary>
        );
      case 'product-detail':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل تفاصيل المنتج">
            <ProductDetail 
              productId={selectedProductId!} 
              onNavigate={handleNavigate}
            />
          </ErrorBoundary>
        );
      case 'categories-ingredients':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل التصنيفات والمكونات">
            <CategoriesIngredients />
          </ErrorBoundary>
        );
      case 'units-suppliers':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل الوحدات والموردين">
            <UnitsSuppliers />
          </ErrorBoundary>
        );
      case 'locations':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل صفحة المواقع">
            <LocationsList onNavigate={handleNavigate} />
          </ErrorBoundary>
        );
      case 'location-detail':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل تفاصيل الموقع">
            <LocationDetail 
              locationId={selectedLocationId!}
              onNavigate={handleNavigate}
            />
          </ErrorBoundary>
        );
      case 'stock-management':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل إدارة المخزون">
            <StockManagement onNavigate={handleNavigate} />
          </ErrorBoundary>
        );
      case 'batch-detail':
        return (
          <ErrorBoundary fallbackMessage="خطأ في تحميل تفاصيل الدفعة">
            <BatchDetail 
              batchId={selectedBatchId!}
              onNavigate={handleNavigate}
            />
          </ErrorBoundary>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-gray-600 mb-2">قريباً</h2>
              <p className="text-gray-400">هذه الصفحة قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`bg-[#1e3a5f] text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden flex-shrink-0`}
      >
        <div className="p-6">
          <h1 className="text-xl mb-8">نظام ERP الصيدلية</h1>
          
          {/* Master Data Module */}
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-blue-300 mb-3">
              البيانات الرئيسية
            </h3>
            <nav className="space-y-1">
              {masterDataMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-900/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Stock Module */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-blue-300 mb-3">
              إدارة المخزون
            </h3>
            <nav className="space-y-1">
              {stockMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-900/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="text-sm text-gray-600">مرحباً،</p>
              <p className="font-medium">مدير الصيدلية</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              م
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}