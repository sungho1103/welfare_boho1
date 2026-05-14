-- 보호작업장 관리 시스템 DB 스키마

-- 1. 이용자 테이블
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,           -- 등록번호 (예: 2021-003)
  group_name text,                     -- 반 (A반, B반 등)
  guardian_name text,                  -- 보호자 이름
  guardian_phone text,                 -- 보호자 연락처
  guardian_phone2 text,                -- 보호자 연락처 2 (선택)
  staff_id uuid references staff(id),  -- 담당 직원
  status text default 'active',        -- active / inactive / leave
  note text,
  created_at timestamptz default now()
);

-- 2. 직원 테이블
create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,                           -- 사회복지사, 작업지도사 등
  email text unique,
  phone text,
  created_at timestamptz default now()
);

-- 3. 출결 테이블
create table attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  date date not null,
  status text not null,                -- present / absent / late / early_leave
  check_in_time timestamptz,
  check_out_time timestamptz,
  reason text,                         -- 결석/지각 사유
  noted_by uuid references staff(id), -- 기록 직원
  notified boolean default false,      -- 보호자 알림 발송 여부
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- 4. 활동 일지 테이블
create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  work_content text,                   -- 작업 내용
  special_note text,                   -- 특이사항
  staff_id uuid references staff(id),  -- 작성 직원
  present_count int,                   -- 출석 인원 (자동 계산)
  total_count int,                     -- 전체 인원
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4-1. 개인 활동 메모 (이용자별)
create table user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  date date not null,
  content text not null,
  staff_id uuid references staff(id),
  created_at timestamptz default now()
);

-- 5. 공지사항 테이블
create table notices (
  id uuid primary key default gen_random_uuid(),
  type text not null,                  -- general / urgent / program / schedule / homecoming / salary
  title text not null,
  body text not null,
  -- 프로그램 안내 전용 필드
  program_date date,
  program_time_start time,
  program_time_end time,
  program_location text,
  supplies jsonb,                      -- 준비물 목록 배열
  -- 귀가 안내 전용 필드
  homecoming_time time,
  has_vehicle boolean default false,
  needs_guardian_pickup boolean default false,
  homecoming_note text,
  -- 발송 설정
  target_type text default 'all',      -- all / group / individual
  target_group text,                   -- 그룹명 (target_type = group 일 때)
  send_method text default 'sms',      -- sms / kakao / push
  scheduled_at timestamptz,           -- 예약 발송 시각 (null이면 즉시)
  sent_at timestamptz,                -- 실제 발송 시각
  sent_count int default 0,
  staff_id uuid references staff(id),
  created_at timestamptz default now()
);

-- 6. 알림 발송 내역 테이블
create table notification_logs (
  id uuid primary key default gen_random_uuid(),
  notice_id uuid references notices(id),    -- 공지 연결 (공지 알림일 때)
  attendance_id uuid references attendance(id), -- 출결 연결 (출결 알림일 때)
  user_id uuid references users(id),
  guardian_phone text not null,
  message text not null,
  method text not null,                -- sms / kakao / push
  status text default 'pending',       -- pending / sent / failed
  sent_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

-- 인덱스
create index idx_attendance_date on attendance(date);
create index idx_attendance_user on attendance(user_id);
create index idx_notices_type on notices(type);
create index idx_notification_logs_status on notification_logs(status);
