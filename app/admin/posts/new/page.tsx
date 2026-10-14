'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/app/_types'
import PostForm from '../_components/PostForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { CreatePostRequestBody } from '@/app/api/admin/posts/route'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const router = useRouter() // 作成後に一覧へ戻るため
  const { token } = useSupabaseSession()

  // フォームの入力値（新規なので最初は空）
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // チェックされたカテゴリーのid
  // 選択肢として出す全カテゴリー
  const [categories, setCategories] = useState<Category[]>([])

  // 開いたときにカテゴリーの選択肢だけ取ってくる（記事はまだ無いので取らない）
  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch('/api/admin/categories', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const { categories } = await res.json()
      setCategories(categories)
    }
    fetcher()
  }, [token])

  // 作成（POST）
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // フォーム送信でページがリロードされるのを止める
    // 送るデータにバックエンドと同じ型を付ける（形がズレると型エラーになる）
    const body: CreatePostRequestBody = {
      title,
      content,
      thumbnailImageKey,
      categories: selectedIds.map((id) => ({ id })), // [2,3] → [{id:2},{id:3}]
    }
    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
      body: JSON.stringify(body),
    })
    router.push('/admin/posts') // 作成したら一覧へ戻る
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">記事作成</h1>
      <PostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </div>
  )
}
