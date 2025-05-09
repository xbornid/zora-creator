import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { fetchTopCoins } from '../lib/zora';
import TokenCard from './TokenCard';
import { AuthContext } from '../context/AuthContext';

export default function CoinList({ search }) {
  const { account, signer } = useContext(AuthContext);
  const [coins, setCoins] = useState([]);
  const [watched, setWatched] = useState({});

  useEffect(() => {
    fetchTopCoins().then(setCoins);
  }, []);

  async function handleWatch(coin) {
    await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'watch', coin, fid: account }),
    });
    setWatched(w => ({ ...w, [coin.address]: !w[coin.address] }));
  }

  async function handleBuy(coin) {
    if (!signer) return alert('Wallet belum siap');
    try {
      const tx = await signer.sendTransaction({
        to: coin.address,
        value: ethers.utils.parseEther('0.1'),
      });
      console.log('Buy TX:', tx.hash);
      await tx.wait();
      alert('Pembelian berhasil! TX ' + tx.hash);
    } catch (err) {
      console.error(err);
      alert('Gagal membeli: ' + err.message);
    }
  }

  async function handleSell(coin) {
    if (!signer) return alert('Wallet belum siap');
    try {
      const tx = await signer.sendTransaction({
        to: coin.owner,
        data: '0x', 
      });
      console.log('Sell TX:', tx.hash);
      await tx.wait();
      alert('Penjualan berhasil! TX ' + tx.hash);
    } catch (err) {
      console.error(err);
      alert('Gagal jual: ' + err.message);
    }
  }

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map(coin => (
        <TokenCard
          key={coin.address}
          coin={coin}
          onBuy={handleBuy}
          onSell={handleSell}
          onWatch={handleWatch}
          watched={!!watched[coin.address]}
        />
      ))}
    </div>
  );
}