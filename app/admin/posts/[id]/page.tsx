'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Category } from '@/app/_types'

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()   // フォーム送信でページがリロードされるのを止める
        await fetch(`/api/admin/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                thumbnailUrl,
                categories: selectedIds.map((id) => ({ id })),  // [2,3] → [{id:2},{id:3}]
            }),
        })
        alert('更新しました')
    }

    // ④ 削除（DELETE）

    const handleDelete = async () => {
        if (!confirm('削除しますか？')) return
        await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
        router.push('/admin/posts')   // 一覧へ戻る
    }

    // ⑤ カテゴリーのチェック切り替え

    const toggleCategory = (categoryId: number) => {
        setSelectedIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)  // 付いてたら外す
                : [...prev, categoryId],                  // 無ければ足す
        )
    }

    // ⑥ 見た目（フォーム）

    return (
        <div>
            <h1 className="text-xl font-bold mb-6">記事編集</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">タイトル</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">内容</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded p-2 h-40" />
                </div>
                <div>
                    <label className="block text-sm mb-1">サムネイルURL</label>
                    <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="w-full border rounded p-2" />
                </div>
                <div>
                    <span className="block text-sm mb-1">カテゴリー</span>
                    {categories.map((c) => (
                        <label key={c.id} className="mr-4">
                            <input type="checkbox"
                                checked={selectedIds.includes(c.id)}
                                onChange={() => toggleCategory(c.id)} /> {c.name}
                        </label>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
                    <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
                </div>
            </form>
        </div>
    )
}