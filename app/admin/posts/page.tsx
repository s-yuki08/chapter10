'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/app/_types'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      // 作成したNext.jsのAPIを叩く
      const res = await fetch('/api/admin/posts')
      const { posts } = await res.json()
      setPosts(posts)
      setIsLoading(false)
    }

    fetcher()
  }, [])

  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          新規作成
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">記事がありません。</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-300 py-4">
              <Link href={`/admin/posts/${post.id}`} className="block">
                <div className="text-lg font-bold">{post.title}</div>
                <div className="text-gray-500 text-sm mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 mt-2">
                  {post.postCategories.map((pc) => (
                    <span
                      key={pc.category.id}
                      className="border border-blue-500 text-blue-500 rounded px-2 py-0.5 text-xs"
                    >
                      {pc.category.name}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
