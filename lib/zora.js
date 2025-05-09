// lib/zora.js
import {
  getCoinsMostValuable,
  getCoin,
  getOnchainCoinDetails,
  getProfileBalances
} from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'
  ),
});

// 1) Top coins by market cap
export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({ count: limit });
  return res.data?.exploreList?.edges?.map(e => e.node) || [];
}

// 2) Detail satu coin
export async function fetchCoinDetails(address) {
  const res = await getCoin({ address, chain: base.id });
  return res.data?.zora20Token || null;
}

// 3) Riwayat transaksi buy/sell
export async function fetchCoinHistory(address) {
  return await getOnchainCoinDetails({
    coin: address,
    user: undefined,
    publicClient,
  });
}

// 4) Cari creator berdasarkan handle
export async function searchCreatorsByUsername(handle) {
  const res = await fetch('https://api.zora.co/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query SearchUsers($query: String!) {
          searchUsers(query: $query, limit: 20) {
            items {
              address
              handle
            }
          }
        }
      `,
      variables: { query: handle },
    }),
  });
  const { data } = await res.json();
  return data.searchUsers.items || [];
}

// 5) Fetch semua coin milik satu creator
export async function fetchCoinsByCreator(address, limit = 20) {
  const res = await getProfileBalances({
    identifier: address,
    count: limit,
  });
  const edges = res.data?.profile?.coinBalances?.edges || [];
  return edges.map(edge => edge.node.token);
}
