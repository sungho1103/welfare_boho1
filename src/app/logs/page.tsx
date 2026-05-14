'use client'

import { mockLogs } from '@/lib/mockData'
import Link from 'next/link'

export default function LogsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">활동 일지</h1>
        <Link href="/logs/new" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
          + 일지 작성
        </Link>
      </div>
      <div className="space-y-3">
        {mockLogs.map(log => (
          <div key={log.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                {new Date(log.date).toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'})}
              </span>
              <span className="text-xs text-gray-400">{log.present_count}/{log.total_count}명 출석</span>
            </div>
            {log.work_content && <p className="text-sm text-gray-600 mb-2">{log.work_content}</p>}
            {log.special_note && (
              <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">{log.special_note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
