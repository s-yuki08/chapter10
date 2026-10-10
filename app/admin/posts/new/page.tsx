'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/app/_types'

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // フォーム送信でページがリロードされるのを止める
        await fetch('/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                thumbnailUrl,
                categories: selectedIds.map((id) => ({ id })), // [2,3] → [{id:2},{id:3}]
            }),
        })
        router.push('/admin/posts') // 作成したら一覧へ戻る
    }

    // カテゴリーのチェック切り替え
    const toggleCategory = (categoryId: number) => {
        setSelectedIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // 付いてたら外す
                : [...prev, categoryId], // 無ければ足す
        )
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-6">記事作成</h1>
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">作成</button>
            </form>
        </div>
    )
}
