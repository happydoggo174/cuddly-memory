import api from './axios'
import type { ApiResponse, Course, TrainingRecord, CheckinForm } from '@/types'

export const checkinApi = {
  getCourse: (slug: string) =>
    api.get<ApiResponse<Course>>(`/checkin/${slug}`),

  submit: (slug: string, data: CheckinForm) =>
    api.post<ApiResponse<{ record: TrainingRecord }>>(`/checkin/${slug}`, data),
}
