// APIのレスポンスに合わせた型定義
// 注意: APIのroute.ts側では createdAt/updatedAt は Date 型だが、
// JSONを経由して受け取ると string になる。フロント側では string で扱う。

export type Category = {
  id: number
  name: string
}

// 記事とカテゴリーの中間テーブル。categoryをネストして持つ
export type PostCategory = {
  category: Category
}

export type Post = {
  id: number
  title: string
  content: string
  thumbnailImageKey: string
  createdAt: string
  updatedAt: string
  postCategories: PostCategory[]
}
