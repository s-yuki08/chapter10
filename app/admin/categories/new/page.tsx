'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter() // 作成後に一覧へ戻るため

  // フォームの入力値（新規なので最初は空）
  const [name, setName] = useState('')

  // 作成（POST）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // フォーム送信でページがリロードされるのを止める
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    router.push('/admin/categories') // 作成したら一覧へ戻る
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">カテゴリー作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">
            カテゴリー名
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          作成
        </button>
      </form>
    </div>
  )
}
