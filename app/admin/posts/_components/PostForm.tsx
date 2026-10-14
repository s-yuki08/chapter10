'use client'

import { Category } from '@/app/_types'
import { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'

// このフォームが受け取る値（props）の型
type Props = {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailImageKey: string
  setThumbnailImageKey: (thumbnailImageKey: string) => void
  selectedIds: number[] // チェックされたカテゴリーのid
  setSelectedIds: (ids: number[]) => void
  categories: Category[] // 選択肢として出す全カテゴリー
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  submitLabel: string // ボタンの文字（「作成」か「更新」）
  onDelete?: () => void // ? は「渡さなくてもいい」という意味
}

export default function PostForm({
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  selectedIds,
  setSelectedIds,
  categories,
  onSubmit,
  submitLabel,
  onDelete,
}: Props) {
  // カテゴリーのチェック切り替え
  const toggleCategory = (categoryId: number) => {
    setSelectedIds(
      selectedIds.includes(categoryId)
        ? selectedIds.filter((id) => id !== categoryId) // 付いてたら外す
        : [...selectedIds, categoryId], // 無ければ足す
    )
  }

  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した key（thumbnailImageKey）を用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  // 画像を選んだら Supabase Storage にアップロードする
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得

    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // 保存した場所（key）を、ページの thumbnailImageKey に入れる
    setThumbnailImageKey(data.path)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 h-40"
        />
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />
        {/* 画像の表示 */}
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <span className="block text-sm mb-1">カテゴリー</span>
        {categories.map((c) => (
          <label key={c.id} className="mr-4">
            <input
              type="checkbox"
              checked={selectedIds.includes(c.id)}
              onChange={() => toggleCategory(c.id)}
            />{' '}
            {c.name}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {submitLabel}
        </button>
        {/* onDelete が渡されたとき（編集ページ）だけ削除ボタンを出す */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        )}
      </div>
    </form>
  )
}
