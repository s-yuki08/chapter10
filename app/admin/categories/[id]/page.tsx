'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '../_components/CategoryForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { UpdateCategoryRequestBody } from '@/app/api/admin/categories/[id]/route'

export default function Page() {
  const { id } = useParams<{ id: string }>() // URLの [id] 部分
  const router = useRouter() // 削除後に一覧へ戻るため

  // フォームの入力値
  const [name, setName] = useState('')

  // 開いたときに今のカテゴリーを取ってきて、フォームに入れる
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category } = await res.json() // ← 単数形の category
      setName(category.name)
    }
    fetcher()
  }, [id])

  // 更新（PUT）
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // フォーム送信でページがリロードされるのを止める
    // 送るデータにバックエンドと同じ型を付ける（形がズレると型エラーになる）
    const body: UpdateCategoryRequestBody = { name }
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    alert('更新しました')
  }

  // 削除（DELETE）
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    router.push('/admin/categories') // 一覧へ戻る
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">カテゴリー編集</h1>
      <CategoryForm
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        submitLabel="更新"
        onDelete={handleDelete}
      />
    </div>
  )
}