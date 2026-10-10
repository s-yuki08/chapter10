'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // フォーム送信でページがリロードされるのを止める
        await fetch(`/api/admin/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">カテゴリー名</label>
                    <input value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded p-2" />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
                    <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
                </div>
            </form>
        </div>
    )
}