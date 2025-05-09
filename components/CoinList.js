// components/CoinList.js
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  fetchTopCoins,
  searchCreatorsByUsername,
  fetchCoinsByCreator
} from '../lib/zora';
import TokenCard from './TokenCard';
import { AuthContext } from '../context/AuthContext';

export default function CoinList({ search }) {
  const router = useRouter();
  const { account } = useContext(AuthContext);
  const [coins, setCoins] = useState(null);
  const [watched, setWatched] = useState({});

  useEffect(() => {
    (async () => {
      setCoins(null);
      try {
        let list = [];
        if (search && search.trim()) {
          const creators = await searchCreatorsByUsername(search.trim());
          for (const c of creators) {
            const tokens = await fetchCoinsByCreator(c.address);
            tokens.forEach(t =>
              list.push({ ...t, creatorHandle: c.handle })
            );
          }
        } else {
          const tops = await fetchTopCoins();
          tops.forEach(t => list.push({ ...t, creatorHandle: null }));
        }
        setCoins(list);
      } catch (e) {
        console.error(e);
        setCoins([]);
      }
    })();
  }, [search]);

  if (coins === null) {
    return <p className="text-center text-gray-500">Memuat koin…</p>;
  }
  if (coins.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada koin.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map(c => (
        <div
          key={c.address}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/coin/${c.address}`)}
        >
          <TokenCard
            coin={c}
            onBuy={() => router.push(`/coin/${c.address}`)}
            onSell={() => router.push(`/coin/${c.address}`)}
            onWatch={async () => {
              await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'watch', coin: c, fid: account }),
              });
              setWatched(w => ({ ...w, [c.address]: !w[c.address] }));
            }}
            watched={!!watched[c.address]}
          />
        </div>
      ))}
    </div>
  );
}
