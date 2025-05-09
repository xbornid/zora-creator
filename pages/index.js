import React, { useState } from 'react';
import Layout from '../components/Layout';
import CoinList from '../components/CoinList';

export default function Home() {
  const [search, setSearch] = useState('');

  return (
    <Layout>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Cari kreator atau koin..."
        className="border p-2 w-full mb-4 rounded"
      />
      <CoinList search={search} />
    </Layout>
  );
}