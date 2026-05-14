'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockLogs } from '@/lib/mockData'

export default function NewLogPage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [workContent, setWorkContent] = useState('')
  const [specialNote, setSpecialNote] = useState('')

  function handleSave() {
    if (!workContent.trim()) return alert('작업 내용을 입력해주세요')
    // mock: 실제 저장 대신 목록으로 이동
    alert('저장됐습니다! (Supabase 연결 후 실제 저장됩니다)')
    router.push('/logs')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-medium text-gray-900 mb-6">활동 일지 작성</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">날짜</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3 py-3 bg-gray-50 rounded-lg px-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">출석 인원</div>
            <div className="text-sm font-medium text-gray-700">자동 집계</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">작성자</div>
            <div className="text-sm font-medium text-gray-700">자동 입력</div>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">작업 내용</label>
          <textarea value={workContent} onChange={e=>setWorkContent(e.target.value)}
            placeholder="오늘 진행한 작업 내용을 입력하세요" rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">특이사항</label>
          <textarea value={specialNote} onChange={e=>setSpecialNote(e.target.value)}
            placeholder="이용자 특이사항, 사고, 건강 관련 내용 등..." rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400" />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          저장
        </button>
        <button onClick={()=>router.back()}
          className="px-6 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
          취소
        </button>
      </div>
    </div>
  )
}
