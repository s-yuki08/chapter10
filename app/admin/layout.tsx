import Link from 'next/link'
import Sidebar from './_components/Sidebar'

// /admin 配下の全ページで共通のレイアウト（ヘッダー＋サイドバー＋メインエリア）
export default function AdminLayout(props: LayoutProps<'/admin'>) {
  return (
    <div className="flex flex-col flex-1 bg-white text-gray-900">
      <header className="bg-gray-800 text-white px-6 py-4">
        <Link href="/" className="font-bold">
          Blog
        </Link>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">{props.children}</main>
      </div>
    </div>
  )
}
