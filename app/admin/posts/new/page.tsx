'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/app/_types'
import PostForm from '../_components/PostForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { CreatePostRequestBody } from '@/app/api/admin/posts/route'

export default function Page() {
  const router = useRouter() // 作成後に一覧へ戻るため

  // フォームの入力値（新規なので最初は空）
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // チェックされたカテゴリーのid
  // 選択肢として出す全カテゴリー
  const [categories, setCategories] = useState<Category[]>([])

  // 開いたときにカテゴリーの選択肢だけ取ってくる（記事はまだ無いので取らない）
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
    }
    fetcher()
  }, [])

  // 作成（POST）
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // フォーム送信でページがリロードされるのを止める
    // 送るデータにバックエンドと同じ型を付ける（形がズレると型エラーになる）
    const body: CreatePostRequestBody = {
      title,
      content,
      thumbnailUrl,
      categories: selectedIds.map((id) => ({ id })), // [2,3] → [{id:2},{id:3}]
    }
    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </div>
  )
}
