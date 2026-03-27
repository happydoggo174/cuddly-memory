import api from './axios'
import type { ApiResponse, TrainingRecord, RecordFilters } from '@/types'

export const recordsApi = {
  list: (params?: RecordFilters) =>
    api.get<ApiResponse<TrainingRecord[]>>('/api/records', { params }),

  exportExcel: (params?: RecordFilters) =>
    api.get('/api/records/export/excel', { params, responseType: 'blob' }),

  exportCsv: (params?: RecordFilters) =>
    api.get('/api/records/export/csv', { params, responseType: 'blob' }),
}
