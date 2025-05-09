import React from 'react';

export default function TokenCard({ coin, onBuy, onSell, onWatch, watched }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold">{coin.name}</h2>
      <p>Marketcap: ${coin.marketcap.toLocaleString()}</p>
      <div className="mt-2 flex space-x-2">
        <button onClick={() => onBuy(coin)} className="px-3 py-1 bg-green-500 text-white rounded">Buy</button>
        <button onClick={() => onSell(coin)} className="px-3 py-1 bg-red-500 text-white rounded">Sell</button>
        <button onClick={() => onWatch(coin)} className="px-3 py-1 bg-blue-500 text-white rounded">
          {watched ? 'Unwatch' : 'Watch'}
        </button>
      </div>
    </div>
  );
}