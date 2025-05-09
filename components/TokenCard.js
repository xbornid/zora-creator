// components/TokenCard.js
import React from 'react';

export default function TokenCard({ coin, onBuy, onSell, onWatch, watched }) {
  return (
    <div className="border rounded p-4 shadow bg-white">
      <h2 className="font-semibold">{coin.name || '[No Name]'}</h2>
      <p className="text-sm text-gray-600">
        Creator: {coin.creatorHandle || '–'}
      </p>
      <p className="mt-1">Market Cap: ${Number(coin.marketCap||0).toLocaleString()}</p>
      <div className="mt-3 flex space-x-2">
        <button onClick={onBuy} className="px-2 py-1 bg-green-500 text-white rounded">Buy</button>
        <button onClick={onSell} className="px-2 py-1 bg-red-500 text-white rounded">Sell</button>
        <button onClick={onWatch} className="px-2 py-1 bg-blue-500 text-white rounded">
          {watched ? 'Unwatch' : 'Watch'}
        </button>
      </div>
    </div>
  );
}
