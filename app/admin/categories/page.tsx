'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Category } from '@/app/_types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      // 作成したNext.jsのAPIを叩く
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
      setIsLoading(false)
    }

    fetcher()
  }, [])

  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          新規作成
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">カテゴリーがありません。</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="border-b border-gray-300 py-4">
              <Link href={`/admin/categories/${category.id}`} className="block">
                <div className="text-lg font-bold">{category.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}