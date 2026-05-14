'use client'

import { useState } from 'react'
import { mockNotices } from '@/lib/mockData'
import type { NoticeType } from '@/lib/types'
import Link from 'next/link'

const typeConfig: Record<NoticeType, { label:string; color:string; icon:string }> = {
  urgent:     { label:'긴급',    color:'bg-red-100 text-red-800',       icon:'🚨' },
  general:    { label:'공지',    color:'bg-blue-100 text-blue-800',     icon:'📢' },
  program:    { label:'프로그램', color:'bg-purple-100 text-purple-800', icon:'⭐' },
  schedule:   { label:'일정',    color:'bg-indigo-100 text-indigo-800', icon:'📅' },
  homecoming: { label:'귀가',    color:'bg-teal-100 text-teal-800',     icon:'🏠' },
  salary:     { label:'급여',    color:'bg-amber-100 text-amber-800',   icon:'💰' },
}

export default function NoticesPage() {
  const [filter, setFilter] = useState<'all'|NoticeType>('all')
  const filtered = filter==='all' ? mockNotices : mockNotices.filter(n=>n.type===filter)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">보호자 알림</h1>
        <Link href="/notices/new" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
          + 공지 작성
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {(['all', ...Object.keys(typeConfig)] as ('all'|NoticeType)[]).map(t => (
          <button key={t} onClick={()=>setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter===t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {t==='all' ? '전체' : typeConfig[t].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(n => {
          const cfg = typeConfig[n.type]
          return (
            <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-sm font-medium text-gray-900">{n.title}</span>
                  </div>
                  {n.body && <p className="text-xs text-gray-500 mb-1">{n.body}</p>}
                  {n.type==='program' && (
                    <div className="text-xs text-gray-400 space-y-0.5 mt-1">
                      {n.program_date && <div>📅 {n.program_date} {n.program_time_start}~{n.program_time_end}</div>}
                      {n.program_location && <div>📍 {n.program_location}</div>}
                      {n.supplies && n.supplies.length>0 && <div>🎒 {n.supplies.join(', ')}</div>}
                      {n.homecoming_time && <div>🚌 퇴근 {n.homecoming_time} {n.has_vehicle ? '· 차량 운행' : ''}</div>}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{new Date(n.created_at).toLocaleDateString('ko-KR')}</span>
                    <span>발송 {n.sent_count}명</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
