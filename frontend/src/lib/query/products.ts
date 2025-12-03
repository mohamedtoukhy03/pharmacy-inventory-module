import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { queryKeys } from './config';
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  UpsertProductIngredientRequest,
} from '../api/types';
import { toast } from 'sonner';

// Query hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsApi.getAll(filters),
  });
};

export const useProduct = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => productsApi.getById(productId),
    enabled: enabled && !!productId,
  });
};

export const useProductCategories = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.categories(productId),
    queryFn: () => productsApi.getCategories(productId),
    enabled: !!productId,
  });
};

export const useProductIngredients = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.ingredients(productId),
    queryFn: () => productsApi.getIngredients(productId),
    enabled: !!productId,
  });
};

// Mutation hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast.success('تم إنشاء المنتج بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء المنتج');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductRequest }) =>
      productsApi.update(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) });
      toast.success('تم تحديث المنتج بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل تحديث المنتج');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => productsApi.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast.success('تم حذف المنتج بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل حذف المنتج');
    },
  });
};

export const useAddProductCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, categoryId }: { productId: string; categoryId: string }) =>
      productsApi.addCategory(productId, categoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories(variables.productId) });
      toast.success('تم إضافة التصنيف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إضافة التصنيف');
    },
  });
};

export const useRemoveProductCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, categoryId }: { productId: string; categoryId: string }) =>
      productsApi.removeCategory(productId, categoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories(variables.productId) });
      toast.success('تم إزالة التصنيف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إزالة التصنيف');
    },
  });
};

export const useAddProductIngredient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpsertProductIngredientRequest }) =>
      productsApi.addOrUpdateIngredient(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.ingredients(variables.productId) });
      toast.success('تم إضافة المكون بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إضافة المكون');
    },
  });
};

export const useRemoveProductIngredient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, ingredientId }: { productId: string; ingredientId: string }) =>
      productsApi.removeIngredient(productId, ingredientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.ingredients(variables.productId) });
      toast.success('تم إزالة المكون بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إزالة المكون');
    },
  });
};
