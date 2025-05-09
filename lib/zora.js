// lib/zora.js
import {
  getCoinsMostValuable,
  getCoin,
  getOnchainCoinDetails,
  getProfileBalances      // ← ganti import di sini
} from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_RPC ||
    'https://mainnet.base.org'
  ),
});

// 1) Top coins by market cap
export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({ count: limit });
  return res.data?.exploreList?.edges?.map(e => e.node) || [];
}

// 2) Detail satu coin (untuk halaman detail)
export async function fetchCoinDetails(address) {
  const res = await getCoin({ address, chain: base.id });
  return res.data?.zora20Token || null;
}

// 3) Riwayat transaksi buy/sell (history)
export async function fetchCoinHistory(address) {
  const history = await getOnchainCoinDetails({
    coin: address,
    user: undefined,
    publicClient,
  });
  return history; // sesuaikan rendering di detail page
}

// 4) Cari creator berdasarkan username (handle)
export async function searchCreatorsByUsername(handle) {
  const res = await fetch('https://api.zora.co/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query SearchUsers($query: String!) {
          searchUsers(query: $query, limit: 20) {
            items { address handle }
          }
        }
      `,
      variables: { query: handle }
    }),
  });
  const { data } = await res.json();
  return data.searchUsers.items || []; // [{ address, handle }, …]
}

// 5) Fetch semua coin milik satu creator
export async function fetchCoinsByCreator(address, limit = 20) {
  // gunakan Profile Balances API untuk daftar token creator
  const res = await getProfileBalances({
    identifier: address, 
    count: limit
  });
  const edges = res.data?.profile?.coinBalances?.edges || [];
  // setiap edge.node merepresentasikan token
  return edges.map(edge => edge.node.token);
}
