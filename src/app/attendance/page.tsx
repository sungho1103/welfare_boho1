'use client'

import { useState } from 'react'
import { mockUsers, mockAttendances } from '@/lib/mockData'
import type { Attendance, AttendanceStatus } from '@/lib/types'

const tabs = ['전체','출석','결석','지각','미확인']
const statusLabel: Record<string, string> = {
  present:'출석', absent:'결석', late:'지각', early_leave:'조기귀가'
}
const statusColor: Record<string, string> = {
  present:'bg-green-100 text-green-800',
  absent:'bg-red-100 text-red-800',
  late:'bg-amber-100 text-amber-800',
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('전체')
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendances)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const todayAtt = attendances.filter(a => a.date === date)
  function getAtt(userId: string) { return todayAtt.find(a => a.user_id === userId) }

  function setStatus(userId: string, status: AttendanceStatus) {
    setAttendances(prev => {
      const existing = prev.find(a => a.user_id === userId && a.date === date)
      if (existing) return prev.map(a => a.id === existing.id ? { ...a, status } : a)
      return [...prev, { id:'tmp-'+userId, user_id:userId, date, status,
        check_in_time: status !== 'absent' ? new Date().toISOString() : undefined,
        notified:false, created_at:'' }]
    })
  }

  const counts = {
    전체: mockUsers.length,
    출석: todayAtt.filter(a=>a.status==='present').length,
    결석: todayAtt.filter(a=>a.status==='absent').length,
    지각: todayAtt.filter(a=>a.status==='late').length,
    미확인: mockUsers.filter(u=>!getAtt(u.id)).length,
  }

  const filtered = mockUsers.filter(u => {
    const a = getAtt(u.id)
    if (activeTab==='전체') return true
    if (activeTab==='출석') return a?.status==='present'
    if (activeTab==='결석') return a?.status==='absent'
    if (activeTab==='지각') return a?.status==='late'
    if (activeTab==='미확인') return !a
    return true
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">출결 관리</h1>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700" />
      </div>

      <div className="flex border-b border-gray-100 mb-4">
        {tabs.map(t => (
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeTab===t ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t} {counts[t as keyof typeof counts]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {filtered.map(u => {
          const a = getAtt(u.id)
          return (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
                {u.name.slice(0,1)}○
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{u.name}</div>
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
                  <button key={s} onClick={()=>setStatus(u.id, s)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      a?.status===s ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'
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
