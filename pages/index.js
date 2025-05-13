// pages/index.js
import { useState } from 'react'
import Layout from '../components/Layout'
import CoinList from '../components/CoinList'

export default function Home() {
  const [search, setSearch] = useState('')

  return (
    <Layout>
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Cari kreator Zora..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <CoinList search={search} />
    </Layout>
  )
}
