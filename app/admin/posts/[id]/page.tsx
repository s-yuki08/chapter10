'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Category } from '@/app/_types'
import PostForm from '../_components/PostForm'
// バックエンドが受け取る形の型（import type なので型だけを読み込む）
import type { UpdatePostRequestBody } from '@/app/api/admin/posts/[id]/route'

export default function Page() {
  const { id } = useParams<{ id: string }>()   // URLの [id] 部分
  const router = useRouter()                    // 削除後に一覧へ戻るため

  // フォームの入力値
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // チェックされたカテゴリーのid
  // 選択肢として出す全カテゴリー
  const [categories, setCategories] = useState<Category[]>([])

  // ② 開いたときに記事とカテゴリーを取ってきて、フォームに入れる

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`)
      const { post } = await res.json()   // ← 単数形の post
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      // postCategories から category の id だけ取り出す
      setSelectedIds(post.postCategories.map((pc: { category: Category }) => pc.category.id))

      const res2 = await fetch('/api/admin/categories')
      const { categories } = await res2.json()
      setCategories(categories)
    }
    fetcher()
  }, [id])
  // ここが新規作成ページとの一番の違いです。新規作成は空のフォームから始まりますが、編集は今の値を入れた状態から始まります。

  // ③ 更新（PUT）

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()   // フォーム送信でページがリロードされるのを止める
    // 送るデータにバックエンドと同じ型を付ける（形がズレると型エラーになる）
    const body: UpdatePostRequestBody = {
      title,
      content,
      thumbnailUrl,
      categories: selectedIds.map((id) => ({ id })),  // [2,3] → [{id:2},{id:3}]
    }
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    alert('更新しました')
  }

  // ④ 削除（DELETE）

  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    router.push('/admin/posts')   // 一覧へ戻る
  }

  // ⑤ 見た目（フォーム部分は PostForm にまとめてある）

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">記事編集</h1>
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
        submitLabel="更新"
        onDelete={handleDelete}
      />
    </div>
  )
}