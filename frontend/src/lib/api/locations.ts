import apiClient from './client';
import type {
  Location,
  UpsertLocationRequest,
  LocationFilters,
  Shelf,
  UpsertShelfRequest,
} from './types';

export const locationsApi = {
  // Get all locations with optional filters
  getAll: async (filters?: LocationFilters): Promise<Location[]> => {
    const { data } = await apiClient.get<Location[]>('/locations', {
      params: filters,
    });
    return data;
  },

  // Get single location by ID
  getById: async (locationId: string): Promise<Location> => {
    const { data } = await apiClient.get<Location>(`/locations/${locationId}`);
    return data;
  },

  // Create new location
  create: async (location: UpsertLocationRequest): Promise<Location> => {
    const { data } = await apiClient.post<Location>('/locations', location);
    return data;
  },

  // Update existing location
  update: async (locationId: string, location: UpsertLocationRequest): Promise<Location> => {
    const { data } = await apiClient.patch<Location>(`/locations/${locationId}`, location);
    return data;
  },

  // Delete location
  delete: async (locationId: string): Promise<void> => {
    await apiClient.delete(`/locations/${locationId}`);
  },

  // Get shelves for a location
  getShelves: async (locationId: string): Promise<Shelf[]> => {
    const { data } = await apiClient.get<Shelf[]>(`/locations/${locationId}/shelves`);
    return data;
  },

  // Create shelf in location
  createShelf: async (locationId: string, shelf: UpsertShelfRequest): Promise<Shelf> => {
    const { data } = await apiClient.post<Shelf>(`/locations/${locationId}/shelves`, shelf);
    return data;
  },
};

export const shelvesApi = {
  // Get single shelf by ID
  getById: async (shelfId: string): Promise<Shelf> => {
    const { data } = await apiClient.get<Shelf>(`/shelves/${shelfId}`);
    return data;
  },

  // Update existing shelf
  update: async (shelfId: string, shelf: UpsertShelfRequest): Promise<Shelf> => {
    const { data } = await apiClient.patch<Shelf>(`/shelves/${shelfId}`, shelf);
    return data;
  },

  // Delete shelf
  delete: async (shelfId: string): Promise<void> => {
    await apiClient.delete(`/shelves/${shelfId}`);
  },
};
