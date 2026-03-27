import api from './axios'
import type { ApiResponse, DashboardStats } from '@/types'

export const dashboardApi = {
  stats: () =>
    api.get<ApiResponse<DashboardStats>>('/api/dashboard'),
}
