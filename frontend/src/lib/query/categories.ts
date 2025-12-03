import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api';
import { queryKeys } from './config';
import type { UpsertCategoryRequest, CategoryFilters } from '../api/types';
import { toast } from 'sonner';

export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () => categoriesApi.getAll(filters),
  });
};

export const useCategory = (categoryId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => categoriesApi.getById(categoryId),
    enabled: enabled && !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpsertCategoryRequest) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast.success('تم إنشاء التصنيف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء التصنيف');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: UpsertCategoryRequest }) =>
      categoriesApi.update(categoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.categoryId) });
      toast.success('تم تحديث التصنيف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل تحديث التصنيف');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryId: string) => categoriesApi.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast.success('تم حذف التصنيف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل حذف التصنيف. قد يكون مرتبطًا بمنتجات.');
    },
  });
};
