import apiClient from './client';
import type {
  MeasurementUnit,
  UpsertMeasurementUnitRequest,
} from './types';

export const measurementUnitsApi = {
  // Get all measurement units
  getAll: async (): Promise<MeasurementUnit[]> => {
    const { data } = await apiClient.get<MeasurementUnit[]>('/measurement-units');
    return data;
  },

  // Get single measurement unit by ID
  getById: async (unitId: string): Promise<MeasurementUnit> => {
    const { data } = await apiClient.get<MeasurementUnit>(`/measurement-units/${unitId}`);
    return data;
  },

  // Create new measurement unit
  create: async (unit: UpsertMeasurementUnitRequest): Promise<MeasurementUnit> => {
    const { data } = await apiClient.post<MeasurementUnit>('/measurement-units', unit);
    return data;
  },

  // Update existing measurement unit
  update: async (unitId: string, unit: UpsertMeasurementUnitRequest): Promise<MeasurementUnit> => {
    const { data } = await apiClient.patch<MeasurementUnit>(`/measurement-units/${unitId}`, unit);
    return data;
  },

  // Delete measurement unit
  delete: async (unitId: string): Promise<void> => {
    await apiClient.delete(`/measurement-units/${unitId}`);
  },
};
