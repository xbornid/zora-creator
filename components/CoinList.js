// components/CoinList.js
import React, { useEffect, useState, useContext } from 'react';
import { fetchTopCoins } from '../lib/zora';
import TokenCard from './TokenCard';
import { AuthContext } from '../context/AuthContext';
import { parseEther } from 'ethers';

export default function CoinList({ search }) {
  const { account, signer } = useContext(AuthContext);
  const [coins, setCoins] = useState(null);    // null = loading, [] = loaded tapi kosong
  const [watched, setWatched] = useState({});

  useEffect(() => {
    (async () => {
      try {
        console.log('[CoinList] memanggil fetchTopCoins…');
        const data = await fetchTopCoins();
        console.log('[CoinList] data koin:', data);
        setCoins(data);
      } catch (err) {
        console.error('[CoinList] Gagal fetchTopCoins:', err);
        setCoins([]); // supaya tidak terus loading
      }
    })();
  }, []);

  // Loading state
  if (coins === null) {
    return <p className="text-center text-gray-500">Memuat daftar koin…</p>;
  }

  // Filter berdasarkan pencarian
  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filtered.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada koin ditemukan.</p>;
  }

  // Render daftar TokenCard
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map(coin => (
        <TokenCard
          key={coin.address}
          coin={coin}
          onBuy={async () => {
            if (!signer) return alert('Wallet belum siap');
            try {
              const tx = await signer.sendTransaction({
                to: coin.address,
                value: parseEther('0.1'),
              });
              await tx.wait();
              alert(`Pembelian berhasil! TX ${tx.hash}`);
            } catch (e) {
              console.error(e);
              alert(`Gagal membeli: ${e.message}`);
            }
          }}
          onSell={async () => {
            if (!signer) return alert('Wallet belum siap');
            try {
              const tx = await signer.sendTransaction({
                to: coin.owner,
                data: '0x',
              });
              await tx.wait();
              alert(`Penjualan berhasil! TX ${tx.hash}`);
            } catch (e) {
              console.error(e);
              alert(`Gagal jual: ${e.message}`);
            }
          }}
          onWatch={async () => {
            try {
              const res = await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'watch', coin, fid: account }),
              });
              if (!res.ok) throw new Error(await res.text());
              setWatched(w => ({ ...w, [coin.address]: !w[coin.address] }));
              alert(`${watched[coin.address] ? 'Berhenti' : 'Mulai'} memantau ${coin.name}`);
            } catch (e) {
              console.error(e);
              alert(`Gagal mengubah watch: ${e.message}`);
            }
          }}
          watched={!!watched[coin.address]}
        />
      ))}
    </div>
  );
}
