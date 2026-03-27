import api from './axios'
import type { ApiResponse, AuthResponse, Admin } from '@/types'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password }),

  me: () =>
    api.get<ApiResponse<Admin>>('/api/auth/me'),
}
