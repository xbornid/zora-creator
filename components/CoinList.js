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
        let data;
        if (search && search.trim()) {
          // 1) Cari creator by handle
          const creators = await searchCreatorsByUsername(search.trim());
          // 2) Ambil semua token tiap creator, attach creatorHandle
          const lists = await Promise.all(
            creators.map(async (c) => {
              const tokens = await fetchCoinsByCreator(c.address);
              return tokens.map(t => ({ ...t, creatorHandle: c.handle }));
            })
          );
          data = lists.flat();
        } else {
          // Default: top coins by market cap
          const tops = await fetchTopCoins();
          // 3) Enrich each top coin with creatorHandle
          const enriched = await Promise.all(
            tops.map(async (t) => {
              // cari username Zora dari address
              const users = await searchCreatorsByUsername(t.creatorAddress);
              const u = users.find(u => u.address.toLowerCase() === t.creatorAddress.toLowerCase());
              return { ...t, creatorHandle: u?.handle || null };
            })
          );
          data = enriched;
        }
        setCoins(data);
      } catch (err) {
        console.error('[CoinList] error:', err);
        setCoins([]);
      }
    })();
  }, [search]);

  if (coins === null) {
    return <p className="text-center text-gray-500">Memuat koin…</p>;
  }
  if (coins.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {search
          ? `Tidak menemukan koin untuk kreator "${search}".`
          : 'Tidak ada koin ditemukan.'}
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map(coin => (
        <div
          key={coin.address}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/coin/${coin.address}`)}
        >
          <TokenCard
            coin={coin}
            onBuy={() => router.push(`/coin/${coin.address}`)}
            onSell={() => router.push(`/coin/${coin.address}`)}
            onWatch={async () => {
              await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'watch', coin, fid: account }),
              });
              setWatched(w => ({ ...w, [coin.address]: !w[coin.address] }));
            }}
            watched={!!watched[coin.address]}
          />
        </div>
      ))}
    </div>
  );
}
