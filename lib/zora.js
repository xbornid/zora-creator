// lib/zora.js
import {
  getCoinsMostValuable,
  getCoin,
  getOnchainCoinDetails,
  getProfileBalances
} from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import fetch from 'cross-fetch';

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

// 1. Top coins by market cap
export async function fetchTopCoins(limit = 20) {
  const { data } = await getCoinsMostValuable({ count: limit });
  return data.exploreList.edges.map(e => e.node);
}

// 2. Detail satu coin
export async function fetchCoinDetails(address) {
  const { data } = await getCoin({ address, chain: base.id });
  return data.zora20Token;
}

// 3. Riwayat onchain detail
export async function fetchCoinHistory(address) {
  const { events } = await getOnchainCoinDetails({
    coin: address,
    user: undefined,
    publicClient,
  });
  return events;
}

// 4. Search creators by handle (username Zora)
const ZORA_GRAPHQL = 'https://api.zora.co/v1/graphql';
export async function searchCreatorsByUsername(handle) {
  const res = await fetch(ZORA_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query SearchUsers($q: String!) {
          searchUsers(query: $q, limit: 10) {
            items { address handle }
          }
        }
      `,
      variables: { q: handle },
    }),
  });
  const { data } = await res.json();
  return data?.searchUsers?.items || [];
}

// 5. Fetch coins by creator address
export async function fetchCoinsByCreator(address, limit = 20) {
  const { data } = await getProfileBalances({
    identifier: address,
    count: limit
  });
  return data.profile.coinBalances.edges.map(e => e.node.token);
}
