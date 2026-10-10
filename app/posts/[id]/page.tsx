'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Post } from '@/app/_types'
import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import classes from './PostDetail.module.css'
// import Category from '../../_components/Category'
// import type { MicroCmsPost } from '../../_types/MicroCmsPost'

// type Props = {
//     params: Promise<{
//         id: string
//     }>
// }

// export default async function Page({ params }: Props) {
export default function Page() {
    // const { id } = await params
    const { id } = useParams<{ id: string }>()

    // const res = await fetch(
    //     `https://btlktymkz4.microcms.io/api/v1/posts/${id}`, {
    //     headers: {
    //         'X-MICROCMS-API-KEY': process.env
    //             .NEXT_PUBLIC_MICROCMS_API_KEY as string,
    //     },
    // })

    // if (!res.ok) {
    //     notFound()
    // }

    // const post: MicroCmsPost = await res.json()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetcher = async () => {
            const res = await fetch(`/api/posts/${id}`)

            if (res.ok) {
                const { post } = await res.json()
                setPost(post)
            }

            setIsLoading(false)
        }

        fetcher()
    }, [id])

    if (isLoading) return <div>読み込み中...</div>
    if (!post) return <div>記事が見つかりません。</div>

    return (
        <div className="max-w-3xl mx-auto w-full px-4 py-10">
            <div>
                {/* thumbnailUrl は任意の文字列が入るので、next/image ではなく img で表示する */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-auto"
                />
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center">
                    <time
                        className="text-gray-500 text-sm"
                        dateTime={post.createdAt}
                    >
                        {new Date(post.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                <div className="text-2xl font-bold mt-4">
                    {post.title}
                </div>
                <div className="mt-4 whitespace-pre-wrap">
                    {post.content}
                </div>

                <div className="mt-10">
                    <Link href="/" className="text-blue-500 underline">
                        記事一覧へ戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}