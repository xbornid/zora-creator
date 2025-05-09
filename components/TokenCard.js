// components/TokenCard.js
import React from 'react';

export default function TokenCard({ coin, onBuy, onSell, onWatch, watched }) {
  const marketCapValue = coin.marketCap
    ? Number(coin.marketCap).toLocaleString()
    : 'N/A';

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="font-semibold text-lg">
        {coin.name} {coin.symbol && `(${coin.symbol})`}
      </h2>
      <p className="text-sm text-gray-600">
        Creator: {coin.creatorHandle || coin.creatorAddress || '–'}
      </p>
      <p className="mt-1">Market Cap: ${marketCapValue}</p>
      <div className="mt-3 flex space-x-2">
        <button onClick={() => onBuy(coin)} className="px-3 py-1 bg-green-500 text-white rounded">
          Buy
        </button>
        <button onClick={() => onSell(coin)} className="px-3 py-1 bg-red-500 text-white rounded">
          Sell
        </button>
        <button onClick={() => onWatch(coin)} className="px-3 py-1 bg-blue-500 text-white rounded">
          {watched ? 'Unwatch' : 'Watch'}
        </button>
      </div>
    </div>
  );
}
