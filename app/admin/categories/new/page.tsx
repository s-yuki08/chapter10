'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryForm from '../_components/CategoryForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { CreateCategoryRequestBody } from '@/app/api/admin/categories/route'

export default function Page() {
  const router = useRouter() // 作成後に一覧へ戻るため

  // フォームの入力値（新規なので最初は空）
  const [name, setName] = useState('')

  // 作成（POST）
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // フォーム送信でページがリロードされるのを止める
    // 送るデータにバックエンドと同じ型を付ける（形がズレると型エラーになる）
    const body: CreateCategoryRequestBody = { name }
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    router.push('/admin/categories') // 作成したら一覧へ戻る
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">カテゴリー作成</h1>
      <CategoryForm
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </div>
  )
}
