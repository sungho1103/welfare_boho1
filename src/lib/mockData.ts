import type { User, Attendance, DailyLog, Notice } from './types'

export const mockUsers: User[] = [
  { id:'1', name:'강민준', code:'2021-001', group_name:'A반', worker_type:'근로인', guardian_name:'강부모', guardian_phone:'010-1234-5678', staff_id:'s1', status:'active', created_at:'' },
  { id:'2', name:'박소연', code:'2021-002', group_name:'A반', worker_type:'근로인', guardian_name:'박부모', guardian_phone:'010-2345-6789', staff_id:'s1', status:'active', created_at:'' },
  { id:'3', name:'최지훈', code:'2021-003', group_name:'B반', worker_type:'훈련인', guardian_name:'최부모', guardian_phone:'010-3456-7890', staff_id:'s1', status:'active', created_at:'' },
  { id:'4', name:'이수아', code:'2021-004', group_name:'B반', worker_type:'훈련인', guardian_name:'이부모', guardian_phone:'010-4567-8901', staff_id:'s1', status:'active', created_at:'' },
  { id:'5', name:'정우성', code:'2021-005', group_name:'A반', worker_type:'근로인', guardian_name:'정부모', guardian_phone:'010-5678-9012', staff_id:'s1', status:'active', created_at:'' },
  { id:'6', name:'김하은', code:'2021-006', group_name:'B반', worker_type:'근로인', guardian_name:'김부모', guardian_phone:'010-6789-0123', staff_id:'s1', status:'active', created_at:'' },
  { id:'7', name:'윤도현', code:'2021-007', group_name:'A반', worker_type:'훈련인', guardian_name:'윤부모', guardian_phone:'010-7890-1234', staff_id:'s1', status:'active', created_at:'' },
  { id:'8', name:'오세린', code:'2021-008', group_name:'B반', worker_type:'훈련인', guardian_name:'오부모', guardian_phone:'010-8901-2345', staff_id:'s1', status:'active', created_at:'' },
]

const today = new Date().toISOString().split('T')[0]

export const mockAttendances: Attendance[] = [
  { id:'a1', user_id:'1', date:today, status:'present', check_in_time: new Date().toISOString(), notified:true, created_at:'' },
  { id:'a2', user_id:'2', date:today, status:'present', check_in_time: new Date().toISOString(), notified:true, created_at:'' },
  { id:'a3', user_id:'3', date:today, status:'late',    check_in_time: new Date().toISOString(), notified:false, created_at:'' },
  { id:'a4', user_id:'4', date:today, status:'absent',  notified:false, created_at:'' },
  { id:'a5', user_id:'5', date:today, status:'present', check_in_time: new Date().toISOString(), notified:true, created_at:'' },
  { id:'a6', user_id:'6', date:today, status:'present', check_in_time: new Date().toISOString(), notified:true, created_at:'' },
]

export const mockLogs: DailyLog[] = [
  { id:'l1', date:today, work_content:'쇼핑백 포장 작업 — 총 350개 완성', special_note:'정우성 오후 두통 호소, 30분 휴식 후 복귀', present_count:22, total_count:27, created_at:'', updated_at:'' },
  { id:'l2', date:'2025-05-07', work_content:'택배 박스 조립 작업 — 200개 완성', special_note:'', present_count:25, total_count:27, created_at:'', updated_at:'' },
  { id:'l3', date:'2025-05-06', work_content:'쇼핑백 포장 작업 — 400개 완성', special_note:'외부 강사 방문 (도예 체험 사전 안내)', present_count:24, total_count:27, created_at:'', updated_at:'' },
]

export const mockNotices: Notice[] = [
  { id:'n1', type:'urgent', title:'5월 15일 석가탄신일 휴무 안내', body:'5월 15일(목) 쉽니다. 대체 작업일 없음.', target_type:'all', send_method:'sms', sent_count:27, created_at:'2025-05-08T08:30:00Z' },
  { id:'n2', type:'program', title:'도예 체험 프로그램 안내', body:'', program_date:'2025-05-20', program_time_start:'10:00', program_time_end:'15:00', program_location:'○○문화센터 2층', supplies:['편한 복장','앞치마'], homecoming_time:'15:00', has_vehicle:true, needs_guardian_pickup:false, target_type:'all', send_method:'sms', sent_count:27, created_at:'2025-05-07T09:00:00Z' },
  { id:'n3', type:'salary', title:'5월 급여(공임) 지급 안내', body:'5월 급여는 5월 25일 지급 예정입니다.', target_type:'all', send_method:'sms', sent_count:27, created_at:'2025-05-06T10:00:00Z' },
]
