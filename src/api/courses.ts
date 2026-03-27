import api from './axios'
import type { ApiResponse, Course, CourseForm, Attendee, CourseFilters } from '@/types'

export const coursesApi = {
  list: (params?: CourseFilters) =>
    api.get<ApiResponse<Course[]>>('/api/courses', { params }),

  get: (id: string) =>
    api.get<ApiResponse<Course>>(`/api/courses/${id}`),

  create: (data: CourseForm) =>
    api.post<ApiResponse<Course>>('/api/courses', data),

  update: (id: string, data: Partial<CourseForm>) =>
    api.put<ApiResponse<Course>>(`/api/courses/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/api/courses/${id}`),

  attendees: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Attendee[]>>(`/api/courses/${id}/attendees`, { params }),
}
