// components/CoinList.js
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import {
  fetchTopCoins,
  searchCreatorsByUsername,
  fetchCoinsByCreator
} from '../lib/zora';
import TokenCard from './TokenCard';
import { AuthContext } from '../context/AuthContext';

function normalizeCoin(raw, creatorHandle = null) {
  // raw bisa berupa Zora20Token atau hasil fetchCoinsByCreator
  const address = raw.address || raw.token?.address;
  const name = raw.name || raw.token?.name || '[No Name]';
  const symbol = raw.symbol || raw.token?.symbol || '';
  const marketCap = raw.marketCap || raw.token?.marketCap || 0;
  return { address, name, symbol, marketCap, creatorHandle };
}

export default function CoinList({ search }) {
  const { account } = useContext(AuthContext);
  const [coins, setCoins] = useState(null);
  const [watched, setWatched] = useState({});

  useEffect(() => {
    (async () => {
      setCoins(null);
      try {
        let list = [];
        if (search && search.trim()) {
          // Cari creators
          const creators = await searchCreatorsByUsername(search.trim());
          // Untuk tiap creator, fetch coins, attach handle
          for (const c of creators) {
            const tokens = await fetchCoinsByCreator(c.address);
            list.push(
              ...tokens.map(t => normalizeCoin(t, c.handle))
            );
          }
        } else {
          // Default: top coins
          const tops = await fetchTopCoins();
          list = tops.map(t => normalizeCoin(t, null));
        }
        setCoins(list);
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
        <Link key={coin.address} href={`/coin/${coin.address}`} passHref>
          <a className="cursor-pointer hover:shadow-lg transition-shadow block">
            <TokenCard
              coin={coin}
              onBuy={() => alert('Klik detail untuk Buy')}
              onSell={() => alert('Klik detail untuk Sell')}
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
          </a>
        </Link>
      ))}
    </div>
  );
}
