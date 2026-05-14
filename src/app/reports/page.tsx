'use client'

import { useState } from 'react'
import { mockUsers, mockAttendances } from '@/lib/mockData'
import type { WorkerType, AttendanceStatus } from '@/lib/types'

// ── 데이터 헬퍼 ──────────────────────────────────────────────
function getAttendanceForDate(date: string) {
  return mockAttendances.filter(a => a.date === date)
}

function statusKr(s: AttendanceStatus | undefined): string {
  if (!s) return '미확인'
  return { present:'출석', absent:'결석', late:'지각', early_leave:'조기귀가' }[s] ?? '미확인'
}

function statusCell(s: AttendanceStatus | undefined) {
  const base = 'text-xs px-1.5 py-0.5 rounded-full font-medium'
  if (!s) return <span className={`${base} bg-gray-100 text-gray-400`}>미확인</span>
  const map: Record<string,[string,string]> = {
    present:    ['bg-green-100','text-green-800'],
    absent:     ['bg-red-100','text-red-700'],
    late:       ['bg-amber-100','text-amber-700'],
    early_leave:['bg-purple-100','text-purple-700'],
  }
  const [bg, text] = map[s] ?? ['bg-gray-100','text-gray-400']
  return <span className={`${base} ${bg} ${text}`}>{statusKr(s)}</span>
}

// 이번달 날짜 배열 생성
function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = []
  const total = new Date(year, month, 0).getDate()
  for (let d = 1; d <= total; d++) {
    days.push(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`)
  }
  return days
}

// 주말 여부
function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay()
  return day === 0 || day === 6
}

// ── 컴포넌트 ──────────────────────────────────────────────────
export default function ReportsPage() {
  const today = new Date()
  const [view, setView] = useState<'daily'|'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [workerType, setWorkerType] = useState<'전체'|WorkerType>('전체')

  // ── 일별 리포트 ─────────────────────────────────────────────
  const DailyReport = () => {
    const atts = getAttendanceForDate(selectedDate)
    const users = mockUsers.filter(u =>
      workerType === '전체' ? true : u.worker_type === workerType
    )
    const present = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='present')).length
    const absent  = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='absent')).length
    const late    = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='late')).length
    const unconf  = users.filter(u => !atts.find(a=>a.user_id===u.id)).length
    const rate    = users.length > 0 ? Math.round((present / users.length) * 100) : 0

    return (
      <div>
        {/* 요약 카드 */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label:'전체', value: users.length,  color:'text-gray-900' },
            { label:'출석', value: present,        color:'text-green-700' },
            { label:'결석', value: absent,         color:'text-red-600' },
            { label:'지각', value: late,           color:'text-amber-600' },
            { label:'출석률', value: `${rate}%`,   color: rate >= 80 ? 'text-green-700' : 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-medium ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 근로인 / 훈련인 별도 요약 */}
        {workerType === '전체' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['근로인','훈련인'] as WorkerType[]).map(wt => {
              const wu = mockUsers.filter(u => u.worker_type === wt)
              const wp = wu.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='present')).length
              const wr = wu.length > 0 ? Math.round(wp/wu.length*100) : 0
              return (
                <div key={wt} className={`rounded-xl border p-4 ${wt==='근로인'?'border-blue-100 bg-blue-50':'border-violet-100 bg-violet-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${wt==='근로인'?'text-blue-700':'text-violet-700'}`}>{wt}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${wt==='근로인'?'bg-blue-100 text-blue-700':'bg-violet-100 text-violet-700'}`}>
                      출석률 {wr}%
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>전체 {wu.length}</span>
                    <span className="text-green-700">출석 {wp}</span>
                    <span className="text-red-600">결석 {wu.filter(u=>atts.find(a=>a.user_id===u.id&&a.status==='absent')).length}</span>
                    <span className="text-amber-600">지각 {wu.filter(u=>atts.find(a=>a.user_id===u.id&&a.status==='late')).length}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 이용자별 상세 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-12 text-xs font-medium text-gray-500">
            <span className="col-span-1">#</span>
            <span className="col-span-3">이름</span>
            <span className="col-span-2">구분</span>
            <span className="col-span-2">반</span>
            <span className="col-span-2">상태</span>
            <span className="col-span-2">입실시간</span>
          </div>
          <div className="divide-y divide-gray-50">
            {users.map((u, i) => {
              const a = atts.find(att => att.user_id === u.id)
              return (
                <div key={u.id} className="px-4 py-3 grid grid-cols-12 text-sm items-center">
                  <span className="col-span-1 text-gray-400 text-xs">{i+1}</span>
                  <span className="col-span-3 font-medium text-gray-900">{u.name}</span>
                  <span className="col-span-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded text-white ${u.worker_type==='근로인'?'bg-blue-500':'bg-violet-500'}`}>
                      {u.worker_type}
                    </span>
                  </span>
                  <span className="col-span-2 text-xs text-gray-500">{u.group_name}</span>
                  <span className="col-span-2">{statusCell(a?.status)}</span>
                  <span className="col-span-2 text-xs text-gray-400">
                    {a?.check_in_time ? new Date(a.check_in_time).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── 월별 리포트 ─────────────────────────────────────────────
  const MonthlyReport = () => {
    const days = getDaysInMonth(selectedYear, selectedMonth)
    const users = mockUsers.filter(u =>
      workerType === '전체' ? true : u.worker_type === workerType
    )

    // 이용자별 월간 집계
    const userStats = users.map(u => {
      let present=0, absent=0, late=0, unconf=0
      days.filter(d => !isWeekend(d)).forEach(d => {
        const a = mockAttendances.find(a => a.user_id===u.id && a.date===d)
        if (!a)                         unconf++
        else if (a.status==='present')  present++
        else if (a.status==='absent')   absent++
        else if (a.status==='late')     late++
      })
      const workdays = days.filter(d => !isWeekend(d)).length
      const rate = workdays > 0 ? Math.round((present / workdays) * 100) : 0
      return { ...u, present, absent, late, unconf, workdays, rate }
    })

    // 일별 전체 집계 (달력 행)
    const workdays = days.filter(d => !isWeekend(d))
    const dayStats = workdays.map(d => {
      const atts = getAttendanceForDate(d)
      const p = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='present')).length
      const ab = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='absent')).length
      const lt = users.filter(u => atts.find(a=>a.user_id===u.id&&a.status==='late')).length
      const rate = users.length > 0 ? Math.round(p/users.length*100) : 0
      return { date:d, present:p, absent:ab, late:lt, rate }
    })

    const totalWorkdays = workdays.length
    const avgRate = dayStats.length > 0
      ? Math.round(dayStats.reduce((s,d)=>s+d.rate,0)/dayStats.length)
      : 0

    return (
      <div>
        {/* 월간 요약 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label:'등록 인원',   value: users.length,      color:'text-gray-900' },
            { label:'근무일수',    value: `${totalWorkdays}일`, color:'text-gray-900' },
            { label:'평균 출석률', value: `${avgRate}%`,     color: avgRate>=80?'text-green-700':'text-red-600' },
            { label:'근로인/훈련인', value: `${mockUsers.filter(u=>u.worker_type==='근로인').length}/${mockUsers.filter(u=>u.worker_type==='훈련인').length}`, color:'text-gray-900' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-medium ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 일별 출결 현황 테이블 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">일별 출결 현황</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="px-4 py-2.5 text-left font-medium">날짜</th>
                  <th className="px-3 py-2.5 text-center font-medium">출석</th>
                  <th className="px-3 py-2.5 text-center font-medium">결석</th>
                  <th className="px-3 py-2.5 text-center font-medium">지각</th>
                  <th className="px-3 py-2.5 text-center font-medium">출석률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dayStats.map(d => {
                  const dt = new Date(d.date)
                  return (
                    <tr key={d.date} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">
                        {dt.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric',weekday:'short'})}
                      </td>
                      <td className="px-3 py-2.5 text-center text-green-700 font-medium">{d.present}</td>
                      <td className="px-3 py-2.5 text-center text-red-600">{d.absent}</td>
                      <td className="px-3 py-2.5 text-center text-amber-600">{d.late}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-xs font-medium ${d.rate>=80?'text-green-700':'text-red-600'}`}>
                          {d.rate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 이용자별 월간 집계 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">이용자별 월간 출결</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="px-4 py-2.5 text-left font-medium">이름</th>
                  <th className="px-3 py-2.5 text-center font-medium">구분</th>
                  <th className="px-3 py-2.5 text-center font-medium">출석</th>
                  <th className="px-3 py-2.5 text-center font-medium">결석</th>
                  <th className="px-3 py-2.5 text-center font-medium">지각</th>
                  <th className="px-3 py-2.5 text-center font-medium">미확인</th>
                  <th className="px-3 py-2.5 text-center font-medium">출석률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {userStats.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{u.name}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded text-white ${u.worker_type==='근로인'?'bg-blue-500':'bg-violet-500'}`}>
                        {u.worker_type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-green-700 font-medium">{u.present}</td>
                    <td className="px-3 py-2.5 text-center text-red-600">{u.absent}</td>
                    <td className="px-3 py-2.5 text-center text-amber-600">{u.late}</td>
                    <td className="px-3 py-2.5 text-center text-gray-400">{u.unconf}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${u.rate>=80?'bg-green-500':'bg-red-400'}`}
                            style={{width:`${u.rate}%`}} />
                        </div>
                        <span className={`text-xs font-medium ${u.rate>=80?'text-green-700':'text-red-600'}`}>
                          {u.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-medium text-gray-900">출결 상황 보고</h1>
        <div className="flex gap-2">
          {/* 근로인/훈련인 필터 */}
          {(['전체','근로인','훈련인'] as const).map(t => (
            <button key={t} onClick={() => setWorkerType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                workerType===t
                  ? t==='근로인' ? 'bg-blue-600 text-white border-blue-600'
                  : t==='훈련인' ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* 일별 / 월별 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {(['daily','monthly'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              view===v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {v==='daily' ? '일별 보고' : '월별 보고'}
          </button>
        ))}
      </div>

      {/* 날짜 선택 */}
      {view === 'daily' ? (
        <div className="flex items-center gap-3 mb-5">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700" />
          <span className="text-sm text-gray-500">
            {new Date(selectedDate).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-5">
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
            {[2024,2025,2026].map(y => <option key={y} value={y}>{y}년</option>)}
          </select>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
            {Array.from({length:12},(_,i)=>i+1).map(m => <option key={m} value={m}>{m}월</option>)}
          </select>
        </div>
      )}

      {/* 리포트 본문 */}
      {view === 'daily' ? <DailyReport /> : <MonthlyReport />}
    </div>
  )
}
