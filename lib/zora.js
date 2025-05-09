// lib/zora.js

import {
  getCoinsMostValuable,
  getCoin,
  getOnchainCoinDetails
} from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Buat client RPC publik Base (gunakan RPC publik, tanpa API key)
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
});

/**
 * Ambil daftar koin berdasarkan marketcap tertinggi
 * @param {number} limit jumlah koin yang diambil
 * @returns {Promise<Array>} array node koin
 */
export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({ count: limit });
  return res.data?.exploreList?.edges?.map(e => e.node) || [];
}

/**
 * Ambil metadata satu koin (nama, symbol, supply, dll)
 * @param {string} address alamat kontrak token
 * @returns {Promise<Object|null>} objek zora20Token
 */
export async function fetchCoinDetails(address) {
  const res = await getCoin({ address, chain: base.id });
  return res.data?.zora20Token || null;
}

/**
 * Ambil detail onchain (owner, ownerBalance, totalSupply, dll)
 * @param {string} address alamat kontrak token
 * @param {string} user alamat user (optional untuk balance)
 * @returns {Promise<Object>} detail onchain
 */
export async function fetchOnchainDetails(address, user) {
  return await getOnchainCoinDetails({
    coin: address,
    user,
    publicClient,
  });
}
