'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin/posts', label: '記事一覧' },
  { href: '/admin/categories', label: 'カテゴリー一覧' },
]

export default function Sidebar() {
  // 現在のURLを取得して、開いているページのリンクを目立たせる
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-gray-100 border-r border-gray-200">
      <nav className="py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-5 py-3 text-sm hover:bg-blue-100 ${isActive ? 'bg-blue-100 font-bold' : ''
                }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
