'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NoticeType } from '@/lib/types'

const noticeTypes: { value: NoticeType; label: string; icon: string }[] = [
  { value: 'urgent',     label: '긴급 공지',    icon: '🚨' },
  { value: 'general',    label: '일반 공지',    icon: '📢' },
  { value: 'program',    label: '프로그램 안내', icon: '⭐' },
  { value: 'schedule',   label: '일정·행사',    icon: '📅' },
  { value: 'homecoming', label: '귀가 안내',    icon: '🏠' },
  { value: 'salary',     label: '급여 안내',    icon: '💰' },
]

export default function NewNoticePage() {
  const router = useRouter()
  const [type, setType] = useState<NoticeType>('general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [programDate, setProgramDate] = useState('')
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [location, setLocation] = useState('')
  const [supplies, setSupplies] = useState<string[]>([''])
  const [homecomingTime, setHomecomingTime] = useState('')
  const [hasVehicle, setHasVehicle] = useState(false)
  const [needsPickup, setNeedsPickup] = useState(false)

  function addSupply() { setSupplies([...supplies, '']) }
  function updateSupply(i: number, v: string) { const n=[...supplies]; n[i]=v; setSupplies(n) }
  function removeSupply(i: number) { setSupplies(supplies.filter((_,idx)=>idx!==i)) }

  function buildPreview() {
    const typeMap: Record<NoticeType,string> = {
      urgent:'긴급공지', general:'공지', program:'프로그램 안내',
      schedule:'일정 안내', homecoming:'귀가 안내', salary:'급여 안내'
    }
    let msg = `[${typeMap[type]}] ${title || '제목 없음'}\n\n안녕하세요. ○○보호작업장입니다.\n`
    if (body) msg += `\n${body}\n`
    if (type === 'program') {
      if (programDate) msg += `\n📅 날짜: ${programDate}`
      if (timeStart && timeEnd) msg += `\n🕙 시간: ${timeStart} ~ ${timeEnd}`
      if (location) msg += `\n📍 장소: ${location}`
      const valid = supplies.filter(s=>s.trim())
      if (valid.length > 0) msg += `\n\n🎒 준비물\n` + valid.map(s=>`· ${s}`).join('\n')
    }
    if (type === 'program' || type === 'homecoming') {
      if (homecomingTime) msg += `\n\n🚌 귀가 안내\n· 퇴근 시간: ${homecomingTime}`
      if (hasVehicle) msg += `\n· 시설 차량 운행`
      if (needsPickup) msg += `\n· 보호자 픽업 필요`
    }
    return msg
  }

  function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요')
    alert('발송됐습니다! (Supabase 연결 후 실제 발송됩니다)')
    router.push('/notices')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-medium text-gray-900 mb-6">공지사항 작성</h1>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="text-xs font-medium text-gray-500 mb-3">공지 유형</div>
        <div className="grid grid-cols-3 gap-2">
          {noticeTypes.map(t => (
            <button key={t.value} onClick={()=>setType(t.value)}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-sm transition-colors ${
                type===t.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 space-y-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">제목</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="공지 제목 입력"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">내용</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="보호자에게 전달할 내용..."
            rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
        </div>

        {type === 'program' && (
          <>
            <div className="border-t border-gray-50 pt-4">
              <div className="text-xs font-medium text-gray-500 mb-3">프로그램 정보</div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">날짜</label>
                    <input type="date" value={programDate} onChange={e=>setProgramDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">장소</label>
                    <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="장소"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">시작</label>
                    <input type="time" value={timeStart} onChange={e=>setTimeStart(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">종료</label>
                    <input type="time" value={timeEnd} onChange={e=>setTimeEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-50 pt-4">
              <div className="text-xs font-medium text-gray-500 mb-3">🎒 준비물</div>
              {supplies.map((s,i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={s} onChange={e=>updateSupply(i,e.target.value)} placeholder={`준비물 ${i+1}`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={()=>removeSupply(i)} className="text-gray-300 hover:text-red-400 px-2">✕</button>
                </div>
              ))}
              <button onClick={addSupply} className="text-sm text-blue-500 hover:text-blue-700">+ 항목 추가</button>
            </div>
          </>
        )}

        {(type === 'program' || type === 'homecoming') && (
          <div className="border-t border-gray-50 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-3">🚌 귀가 안내</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">퇴근 시간</label>
                <input type="time" value={homecomingTime} onChange={e=>setHomecomingTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasVehicle} onChange={e=>setHasVehicle(e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-700">시설 차량 운행</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={needsPickup} onChange={e=>setNeedsPickup(e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-700">보호자 픽업 필요</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-5">
        <div className="text-xs text-gray-400 mb-2">👁 발송 미리보기</div>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{buildPreview()}</pre>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          전체 발송 (27명)
        </button>
        <button onClick={()=>router.back()}
          className="px-6 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
          취소
        </button>
      </div>
    </div>
  )
}
