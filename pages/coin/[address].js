// pages/coin/[address].js
import React from 'react';
import Layout from '../../components/Layout';
import { fetchCoinDetails, fetchCoinHistory } from '../../lib/zora';
import { parseEther } from 'ethers';
import { useWarplet } from '../../lib/wallet';

export default function CoinDetail({ coin, history }) {
  const { signer } = useWarplet();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">
        {coin.name} ({coin.symbol})
      </h1>
      <p>Creator: {coin.creatorAddress || '–'}</p>
      <p>Market Cap: ${Number(coin.marketCap).toLocaleString()}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Riwayat Transaksi</h2>
        <ul className="list-disc pl-5 space-y-1">
          {history.map((h, i) => (
            <li key={i}>
              {h.type} – {h.amount} – TX:{' '}
              <a
                href={`https://etherscan.io/tx/${h.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {h.txHash.slice(0, 10)}…
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={async () => {
            if (!signer) return alert('Wallet belum siap');
            const tx = await signer.sendTransaction({
              to: coin.address,
              value: parseEther('0.1'),
            });
            await tx.wait();
            alert(`Pembelian berhasil! TX ${tx.hash}`);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Buy
        </button>
        <button
          onClick={async () => {
            if (!signer) return alert('Wallet belum siap');
            const tx = await signer.sendTransaction({
              to: coin.owner,
              data: '0x',
            });
            await tx.wait();
            alert(`Penjualan berhasil! TX ${tx.hash}`);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sell
        </button>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const coin = await fetchCoinDetails(params.address);
  const history = await fetchCoinHistory(params.address);
  return { props: { coin, history } };
}
