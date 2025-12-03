// Export all query hooks
export * from './config';
export * from './products';
export * from './categories';
export * from './batches';

// Re-export ingredients, suppliers, locations, and stock-levels hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientsApi, suppliersApi, measurementUnitsApi, locationsApi, shelvesApi, stockLevelsApi } from '../api';
import { queryKeys } from './config';
import { toast } from 'sonner';
import type {
  IngredientFilters,
  UpsertIngredientRequest,
  SupplierFilters,
  UpsertSupplierRequest,
  UpsertMeasurementUnitRequest,
  LocationFilters,
  UpsertLocationRequest,
  UpsertShelfRequest,
  StockLevelFilters,
  UpsertStockLevelRequest,
} from '../api/types';

// Ingredients
export const useIngredients = (filters?: IngredientFilters) => {
  return useQuery({
    queryKey: queryKeys.ingredients.list(filters),
    queryFn: () => ingredientsApi.getAll(filters),
  });
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertIngredientRequest) => ingredientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.lists() });
      toast.success('تم إنشاء المكون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء المكون'),
  });
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ingredientId, data }: { ingredientId: string; data: UpsertIngredientRequest }) =>
      ingredientsApi.update(ingredientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.lists() });
      toast.success('تم تحديث المكون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل تحديث المكون'),
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) => ingredientsApi.delete(ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.lists() });
      toast.success('تم حذف المكون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف المكون'),
  });
};

// Suppliers
export const useSuppliers = (filters?: SupplierFilters) => {
  return useQuery({
    queryKey: queryKeys.suppliers.list(filters),
    queryFn: () => suppliersApi.getAll(filters),
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertSupplierRequest) => suppliersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() });
      toast.success('تم إنشاء المورد بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء المورد'),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, data }: { supplierId: string; data: UpsertSupplierRequest }) =>
      suppliersApi.update(supplierId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() });
      toast.success('تم تحديث المورد بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل تحديث المورد'),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (supplierId: string) => suppliersApi.delete(supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() });
      toast.success('تم حذف المورد بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف المورد'),
  });
};

// Measurement Units
export const useMeasurementUnits = () => {
  return useQuery({
    queryKey: queryKeys.measurementUnits.list(),
    queryFn: () => measurementUnitsApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - reference data
  });
};

export const useCreateMeasurementUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertMeasurementUnitRequest) => measurementUnitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurementUnits.lists() });
      toast.success('تم إنشاء وحدة القياس بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء وحدة القياس'),
  });
};

export const useUpdateMeasurementUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: UpsertMeasurementUnitRequest }) =>
      measurementUnitsApi.update(unitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurementUnits.lists() });
      toast.success('تم تحديث وحدة القياس بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل تحديث وحدة القياس'),
  });
};

export const useDeleteMeasurementUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unitId: string) => measurementUnitsApi.delete(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurementUnits.lists() });
      toast.success('تم حذف وحدة القياس بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف وحدة القياس'),
  });
};

// Locations
export const useLocations = (filters?: LocationFilters) => {
  return useQuery({
    queryKey: queryKeys.locations.list(filters),
    queryFn: () => locationsApi.getAll(filters),
  });
};

export const useLocation = (locationId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.locations.detail(locationId),
    queryFn: () => locationsApi.getById(locationId),
    enabled: enabled && !!locationId,
  });
};

export const useLocationShelves = (locationId: string) => {
  return useQuery({
    queryKey: queryKeys.locations.shelves(locationId),
    queryFn: () => locationsApi.getShelves(locationId),
    enabled: !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertLocationRequest) => locationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
      toast.success('تم إنشاء الموقع بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء الموقع'),
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locationId, data }: { locationId: string; data: UpsertLocationRequest }) =>
      locationsApi.update(locationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
      toast.success('تم تحديث الموقع بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل تحديث الموقع'),
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (locationId: string) => locationsApi.delete(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
      toast.success('تم حذف الموقع بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف الموقع'),
  });
};

export const useCreateShelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locationId, data }: { locationId: string; data: UpsertShelfRequest }) =>
      locationsApi.createShelf(locationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.shelves(variables.locationId) });
      toast.success('تم إنشاء الرف بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء الرف'),
  });
};

export const useDeleteShelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shelfId: string) => shelvesApi.delete(shelfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast.success('تم حذف الرف بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف الرف'),
  });
};

// Stock Levels
export const useStockLevels = (filters?: StockLevelFilters) => {
  return useQuery({
    queryKey: queryKeys.stockLevels.list(filters),
    queryFn: () => stockLevelsApi.getAll(filters),
  });
};

export const useCreateStockLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertStockLevelRequest) => stockLevelsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLevels.lists() });
      toast.success('تم إنشاء مستوى المخزون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل إنشاء مستوى المخزون'),
  });
};

export const useUpdateStockLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertStockLevelRequest }) =>
      stockLevelsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLevels.lists() });
      toast.success('تم تحديث مستوى المخزون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل تحديث مستوى المخزون'),
  });
};

export const useDeleteStockLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stockLevelsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLevels.lists() });
      toast.success('تم حذف مستوى المخزون بنجاح');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'فشل حذف مستوى المخزون'),
  });
};
