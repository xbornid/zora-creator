// lib/zora.js
import {
  getCoinsMostValuable,
  getCoin,
  getOnchainCoinDetails
} from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
});

export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({ count: limit });
  return res.data?.exploreList?.edges?.map(e => e.node) || [];
}

export async function fetchCoinDetails(address) {
  const res = await getCoin({ address, chain: base.id });
  return res.data?.zora20Token || null;
}

export async function fetchOnchainDetails(address, user) {
  return await getOnchainCoinDetails({
    coin: address,
    user,
    publicClient,
  });
}
