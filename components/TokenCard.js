// components/TokenCard.js
import React from 'react';

export default function TokenCard({ coin, onBuy, onSell, onWatch, watched }) {
  const name = coin?.name || '[Unknown]';
  const symbol = coin?.symbol || '';
  const marketCapValue = coin?.marketCap
    ? Number(coin.marketCap).toLocaleString()
    : 'N/A';
  const creatorHandle = coin?.creatorHandle || '–';

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="font-semibold text-lg">
        {name} {symbol && `(${symbol})`}
      </h2>
      <p className="text-sm text-gray-600">Creator: {creatorHandle}</p>
      <p className="mt-1">Market Cap: ${marketCapValue}</p>
      <div className="mt-3 flex space-x-2">
        <button onClick={onBuy} className="px-3 py-1 bg-green-500 text-white rounded">
          Buy
        </button>
        <button onClick={onSell} className="px-3 py-1 bg-red-500 text-white rounded">
          Sell
        </button>
        <button onClick={onWatch} className="px-3 py-1 bg-blue-500 text-white rounded">
          {watched ? 'Unwatch' : 'Watch'}
        </button>
      </div>
    </div>
  );
}
