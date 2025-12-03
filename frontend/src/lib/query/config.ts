import { QueryClient } from '@tanstack/react-query';

// Create QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    categories: (id: string) => [...queryKeys.products.detail(id), 'categories'] as const,
    ingredients: (id: string) => [...queryKeys.products.detail(id), 'ingredients'] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  
  // Ingredients
  ingredients: {
    all: ['ingredients'] as const,
    lists: () => [...queryKeys.ingredients.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.ingredients.lists(), filters] as const,
    details: () => [...queryKeys.ingredients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.ingredients.details(), id] as const,
  },
  
  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.suppliers.lists(), filters] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.suppliers.details(), id] as const,
  },
  
  // Measurement Units
  measurementUnits: {
    all: ['measurement-units'] as const,
    lists: () => [...queryKeys.measurementUnits.all, 'list'] as const,
    list: () => [...queryKeys.measurementUnits.lists()] as const,
    details: () => [...queryKeys.measurementUnits.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.measurementUnits.details(), id] as const,
  },
  
  // Locations
  locations: {
    all: ['locations'] as const,
    lists: () => [...queryKeys.locations.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    shelves: (id: string) => [...queryKeys.locations.detail(id), 'shelves'] as const,
  },
  
  // Shelves
  shelves: {
    all: ['shelves'] as const,
    details: () => [...queryKeys.shelves.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.shelves.details(), id] as const,
  },
  
  // Batches
  batches: {
    all: ['batches'] as const,
    lists: () => [...queryKeys.batches.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.batches.lists(), filters] as const,
    details: () => [...queryKeys.batches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.batches.details(), id] as const,
    allocations: (id: string) => [...queryKeys.batches.detail(id), 'allocations'] as const,
  },
  
  // Stock Levels
  stockLevels: {
    all: ['stock-levels'] as const,
    lists: () => [...queryKeys.stockLevels.all, 'list'] as const,
    list: (filters?: unknown) => [...queryKeys.stockLevels.lists(), filters] as const,
    details: () => [...queryKeys.stockLevels.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.stockLevels.details(), id] as const,
  },
};
