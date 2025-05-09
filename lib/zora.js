// lib/zora.js

import {
  getCoinsMostValuable,
  getCoin,
  getCoinsNew,
} from '@zoralabs/coins-sdk';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
});

/**
 * Ambil daftar koin berdasarkan market cap (most valuable)
 */
export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({
    count: limit,
    after: undefined,
  });
  // struktur: res.data.exploreList.edges[].node
  return res.data?.exploreList?.edges?.map(edge => edge.node) || [];
}

/**
 * Ambil detail satu koin (misal untuk halaman detail)
 */
export async function fetchCoinDetails(address) {
  const res = await getCoin({
    address,
    chain: base.id,
  });
  return res.data?.zora20Token;
}

/**
 * Ambil riwayat onchain (marketcap, owner, dll)
 */
export async function fetchOnchainDetails(address, user) {
  const details = await getOnchainCoinDetails({
    coin: address,
    user,
    publicClient,
  });
  return details;
}
