// components/Layout.js
import Link from 'next/link';
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold"><Link href="/"><a>Zora Creator</a></Link></h1>
        <nav className="space-x-12">
          <Link href="/"><a>Home</a></Link>
          <Link href="/profile"><a>Profil</a></Link>
        </nav>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="p-4 text-center text-sm text-gray-500">&copy; Zora Creator</footer>
    </div>
  );
}
