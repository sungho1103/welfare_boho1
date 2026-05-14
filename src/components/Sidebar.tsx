'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/',           icon: '🏠', label: '대시보드' },
  { href: '/attendance', icon: '✅', label: '출결 관리' },
  { href: '/reports',    icon: '📊', label: '출결 보고' },
  { href: '/logs',       icon: '📋', label: '활동 일지' },
  { href: '/notices',    icon: '📣', label: '보호자 알림' },
  { href: '/users',      icon: '👥', label: '이용자 관리' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-900">보호작업장</div>
        <div className="text-xs text-gray-400 mt-0.5">관리 시스템</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">홍길동 · 사회복지사</div>
      </div>
    </aside>
  )
}
