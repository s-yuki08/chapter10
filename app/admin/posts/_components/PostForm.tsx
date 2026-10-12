'use client'

import { Category } from '@/app/_types'

// このフォームが受け取る値（props）の型
type Props = {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void
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
  thumbnailUrl,
  setThumbnailUrl,
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
        <label className="block text-sm mb-1">サムネイルURL</label>
        <input
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full border rounded p-2"
        />
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
