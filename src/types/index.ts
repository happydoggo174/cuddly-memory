export interface Admin {
  id: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  admin: Admin
}

export interface Course {
  id: string
  course_name: string
  start_date: string
  end_date: string
  instructor: string
  duration: string
  training_format: TrainingFormat
  training_type: string
  // These fields are only present in admin API responses, not in public checkin API
  checkin_slug?: string
  checkin_url?: string
  qr_code_value?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
  _count?: { training_records: number }
}

export interface CourseForm {
  course_name: string
  start_date: string
  end_date: string
  instructor: string
  duration: string
  training_format: TrainingFormat | ''
  training_type: string
  is_active?: boolean
}

export interface TrainingRecord {
  id: string
  employee_name: string
  employee_id: string
  department: string
  checkin_time: string
  attendance_status: AttendanceStatus
  course_id: string
  course_name: string
  training_type: string
  training_format: string
  start_date: string
  end_date: string
  duration: string
  instructor: string
}

export interface Attendee {
  id: string
  employee_name: string
  employee_id: string
  department: string
  checkin_time: string
  attendance_status: AttendanceStatus
}

export interface CheckinForm {
  employee_name: string
  employee_id: string
  department: string
}

export interface DashboardStats {
  total_courses: number
  total_records: number
  by_month: { month: string; count: number }[]
  by_department: { department: string; count: number }[]
  by_training_type: { training_type: string; count: number }[]
  by_training_format: { training_format: string; count: number }[]
}

export interface Meta {
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: Meta
}

export type TrainingFormat = 'Offline' | 'Online live' | 'E-learning' | 'Blended'
export type AttendanceStatus = 'checked_in' | 'duplicate_blocked' | 'cancelled'

export interface RecordFilters {
  search?: string
  department?: string
  training_type?: string
  training_format?: string
  course_name?: string
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CourseFilters {
  search?: string
  training_type?: string
  training_format?: string
  is_active?: boolean
  page?: number
  limit?: number
}
