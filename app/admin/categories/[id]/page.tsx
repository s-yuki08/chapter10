'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '../_components/CategoryForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { UpdateCategoryRequestBody } from '@/app/api/admin/categories/[id]/route'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useSupabaseSession()

  // フォームの入力値
  const [name, setName] = useState('')

  // 開いたときに今のカテゴリーを取ってきて、フォームに入れる
  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const { category } = await res.json()
      setName(category.name)
    }
    fetcher()
  }, [id, token])

  // 更新（PUT）
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body: UpdateCategoryRequestBody = { name }
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
      body: JSON.stringify(body),
    })
    alert('更新しました')
  }

  // 削除（DELETE）
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token!,
      },
    })
    router.push('/admin/categories')
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