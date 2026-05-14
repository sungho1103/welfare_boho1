'use client'

import { useState } from 'react'
import { mockUsers, mockAttendances } from '@/lib/mockData'
import type { Attendance, AttendanceStatus, WorkerType } from '@/lib/types'

const statusLabel: Record<string, string> = {
  present:'출석', absent:'결석', late:'지각', early_leave:'조기귀가'
}
const statusColor: Record<string, string> = {
  present:'bg-green-100 text-green-800',
  absent:'bg-red-100 text-red-800',
  late:'bg-amber-100 text-amber-800',
}

type MainTab = '근로인' | '훈련인'
type SubTab = '전체' | '출석' | '결석' | '지각' | '미확인'

export default function AttendancePage() {
  const [mainTab, setMainTab] = useState<MainTab>('근로인')
  const [subTab, setSubTab] = useState<SubTab>('전체')
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendances)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const todayAtt = attendances.filter(a => a.date === date)
  function getAtt(userId: string) { return todayAtt.find(a => a.user_id === userId) }

  function setStatus(userId: string, status: AttendanceStatus) {
    setAttendances(prev => {
      const existing = prev.find(a => a.user_id === userId && a.date === date)
      if (existing) return prev.map(a => a.id === existing.id ? { ...a, status } : a)
      return [...prev, {
        id: 'tmp-' + userId, user_id: userId, date, status,
        check_in_time: status !== 'absent' ? new Date().toISOString() : undefined,
        notified: false, created_at: ''
      }]
    })
  }

  // 근로인/훈련인 필터된 이용자
  const groupUsers = mockUsers.filter(u => u.worker_type === mainTab)

  // 서브탭 필터
  const filtered = groupUsers.filter(u => {
    const a = getAtt(u.id)
    if (subTab === '전체')   return true
    if (subTab === '출석')   return a?.status === 'present'
    if (subTab === '결석')   return a?.status === 'absent'
    if (subTab === '지각')   return a?.status === 'late'
    if (subTab === '미확인') return !a
    return true
  })

  // 서브탭 카운트
  function getCounts(wType: WorkerType) {
    const users = mockUsers.filter(u => u.worker_type === wType)
    const atts  = users.map(u => getAtt(u.id))
    return {
      전체:   users.length,
      출석:   atts.filter(a => a?.status === 'present').length,
      결석:   atts.filter(a => a?.status === 'absent').length,
      지각:   atts.filter(a => a?.status === 'late').length,
      미확인: users.filter(u => !getAtt(u.id)).length,
    }
  }

  const counts = getCounts(mainTab)

  // 메인탭 요약 (근로인/훈련인 각각 출석 수)
  const workerCounts  = getCounts('근로인')
  const traineeCounts = getCounts('훈련인')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-medium text-gray-900">출결 관리</h1>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700" />
      </div>

      {/* 메인탭: 근로인 / 훈련인 */}
      <div className="flex gap-3 mb-4">
        {(['근로인', '훈련인'] as MainTab[]).map(t => {
          const c = t === '근로인' ? workerCounts : traineeCounts
          const isActive = mainTab === t
          return (
            <button key={t} onClick={() => { setMainTab(t); setSubTab('전체') }}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                isActive
                  ? t === '근로인'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              <div className="text-base font-semibold">{t}</div>
              <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                출석 {c.출석} / 전체 {c.전체}
              </div>
            </button>
          )
        })}
      </div>

      {/* 서브탭: 전체/출석/결석/지각/미확인 */}
      <div className="flex border-b border-gray-100 mb-4">
        {(['전체','출석','결석','지각','미확인'] as SubTab[]).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
              subTab === t
                ? mainTab === '근로인'
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-violet-500 text-violet-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t} {counts[t]}
          </button>
        ))}
      </div>

      {/* 이용자 목록 */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">해당 항목이 없습니다</div>
        ) : filtered.map(u => {
          const a = getAtt(u.id)
          return (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                u.worker_type === '근로인' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'
              }`}>
                {u.name.slice(0,1)}○
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{u.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded text-white ${
                    u.worker_type === '근로인' ? 'bg-blue-500' : 'bg-violet-500'
                  }`}>{u.worker_type}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {a?.check_in_time
                    ? new Date(a.check_in_time).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) + ' 입실'
                    : u.group_name}
                </div>
              </div>
              {a
                ? <span className={`text-xs px-2 py-1 rounded-full ${statusColor[a.status]}`}>{statusLabel[a.status]}</span>
                : <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">미확인</span>
              }
              <div className="flex gap-1">
                {(['present','late','absent'] as AttendanceStatus[]).map(s => (
                  <button key={s} onClick={() => setStatus(u.id, s)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      a?.status === s ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
