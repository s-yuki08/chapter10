'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/app/_types'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      // 公開用の記事一覧APIを叩く（管理用の /api/admin/posts ではない）
      const res = await fetch('/api/posts')
      const { posts } = await res.json()
      setPosts(posts)
      setIsLoading(false)
    }

    fetcher()
  }, [])

  if (isLoading) return <div className="p-8">読み込み中...</div>

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10">
      {posts.length === 0 ? (
        <p className="text-gray-500">記事がありません。</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border border-gray-300 p-4 mb-6">
              <Link href={`/posts/${post.id}`} className="block">
                <div className="flex justify-between items-center">
                  <time
                    className="text-gray-500 text-sm"
                    dateTime={post.createdAt}
                  >
                    {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                  </time>
                  <div className="flex gap-2">
                    {post.postCategories.map((pc) => (
                      <span
                        key={pc.category.id}
                        className="border border-blue-500 text-blue-500 rounded px-2 py-0.5 text-xs"
                      >
                        {pc.category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-bold mt-2">{post.title}</div>
                {/* 本文は長いので2行までで省略する */}
                <div className="text-gray-600 mt-2 line-clamp-2">
                  {post.content}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
