'use client'

// このフォームが受け取る値（props）の型
type Props = {
  name: string
  setName: (name: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  submitLabel: string // ボタンの文字（「作成」か「更新」）
  onDelete?: () => void // ? は「渡さなくてもいい」という意味
}

export default function CategoryForm({
  name,
  setName,
  onSubmit,
  submitLabel,
  onDelete,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">カテゴリー名</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />
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
