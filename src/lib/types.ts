export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave'
export type NoticeType = 'general' | 'urgent' | 'program' | 'schedule' | 'homecoming' | 'salary'
export type NotificationStatus = 'pending' | 'sent' | 'failed'
export type UserStatus = 'active' | 'inactive' | 'leave'
export type WorkerType = '근로인' | '훈련인'

export interface Staff {
  id: string
  name: string
  role: string
  email: string
  phone: string
  created_at: string
}

export interface User {
  id: string
  name: string
  code: string
  group_name: string
  worker_type: WorkerType
  guardian_name: string
  guardian_phone: string
  guardian_phone2?: string
  staff_id: string
  status: UserStatus
  note?: string
  created_at: string
  staff?: Staff
}

export interface Attendance {
  id: string
  user_id: string
  date: string
  status: AttendanceStatus
  check_in_time?: string
  check_out_time?: string
  reason?: string
  noted_by?: string
  notified: boolean
  created_at: string
  user?: User
}

export interface DailyLog {
  id: string
  date: string
  work_content?: string
  special_note?: string
  staff_id?: string
  present_count?: number
  total_count?: number
  created_at: string
  updated_at: string
  staff?: Staff
}

export interface UserNote {
  id: string
  user_id: string
  date: string
  content: string
  staff_id?: string
  created_at: string
  staff?: Staff
}

export interface Notice {
  id: string
  type: NoticeType
  title: string
  body: string
  program_date?: string
  program_time_start?: string
  program_time_end?: string
  program_location?: string
  supplies?: string[]
  homecoming_time?: string
  has_vehicle?: boolean
  needs_guardian_pickup?: boolean
  homecoming_note?: string
  target_type: 'all' | 'group' | 'individual'
  target_group?: string
  send_method: 'sms' | 'kakao' | 'push'
  scheduled_at?: string
  sent_at?: string
  sent_count: number
  staff_id?: string
  created_at: string
  staff?: Staff
}

export interface NotificationLog {
  id: string
  notice_id?: string
  attendance_id?: string
  user_id: string
  guardian_phone: string
  message: string
  method: string
  status: NotificationStatus
  sent_at?: string
  error_message?: string
  created_at: string
  user?: User
}

export interface DashboardStats {
  present: number
  absent: number
  late: number
  total: number
  unconfirmed: number
}
