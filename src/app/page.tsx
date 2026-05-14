'use client'

import { useState } from 'react'
import { mockUsers, mockAttendances } from '@/lib/mockData'
import type { AttendanceStatus } from '@/lib/types'
import Link from 'next/link'

const statusLabel: Record<string, string> = {
  present:'출석', absent:'결석', late:'지각', early_leave:'조기귀가'
}
const statusColor: Record<string, string> = {
  present:'bg-green-100 text-green-800',
  absent:'bg-red-100 text-red-800',
  late:'bg-amber-100 text-amber-800',
}

export default function DashboardPage() {
  const [attendances, setAttendances] = useState(mockAttendances)
  const today = new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' })
  const todayStr = new Date().toISOString().split('T')[0]

  const todayAtt = attendances.filter(a => a.date === todayStr)
  const present = todayAtt.filter(a => a.status === 'present').length
  const absent  = todayAtt.filter(a => a.status === 'absent').length
  const late    = todayAtt.filter(a => a.status === 'late').length
  const total   = mockUsers.length
  const unconfirmed = mockUsers.filter(u => !todayAtt.find(a => a.user_id === u.id))

  function handleQuickAttend(userId: string) {
    setAttendances(prev => [
      ...prev.filter(a => a.user_id !== userId),
      { id: 'tmp-' + userId, user_id: userId, date: todayStr, status: 'present' as AttendanceStatus,
        check_in_time: new Date().toISOString(), notified: false, created_at: '' }
    ])
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">오늘의 현황</h1>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label:'출석', value: present, color:'text-green-700' },
          { label:'결석', value: absent,  color:'text-red-600'   },
          { label:'지각', value: late,    color:'text-amber-600' },
          { label:'전체', value: total,   color:'text-gray-900'  },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-medium ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">미처리 출결</span>
          <span className="text-xs text-gray-400">{unconfirmed.length}명 미확인</span>
        </div>
        <div className="divide-y divide-gray-50">
          {unconfirmed.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">모든 출결이 처리됐어요 ✅</div>
          ) : unconfirmed.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700">
                {u.name.slice(0,1)}○
              </div>
              <div className="flex-1 text-sm text-gray-900">{u.name}</div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">미확인</span>
              <button onClick={() => handleQuickAttend(u.id)}
                className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">
                출석 처리
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">오늘 출결 현황</span>
        </div>
        <div className="divide-y divide-gray-50">
          {todayAtt.map(a => {
            const user = mockUsers.find(u => u.id === a.user_id)
            return (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700">
                  {user?.name.slice(0,1)}○
                </div>
                <div className="flex-1 text-sm text-gray-900">{user?.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[a.status] || 'bg-gray-100 text-gray-500'}`}>
                  {statusLabel[a.status]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/notices/new" className="flex-1 bg-blue-600 text-white text-sm text-center py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          📣 보호자 알림 발송
        </Link>
        <Link href="/logs/new" className="flex-1 bg-white border border-gray-200 text-sm text-center text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          📋 활동 일지 작성
        </Link>
      </div>
    </div>
  )
}
