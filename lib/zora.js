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
  transport: http('https://mainnet.base.org'),
});

// 1) Top coins by market cap
export async function fetchTopCoins(limit = 20) {
  const { data } = await getCoinsMostValuable({ count: limit });
  return data.exploreList.edges.map(e => e.node);
}

// 2) Search Zora creators by handle
const ZORA_GRAPHQL = 'https://api.zora.co/v1/graphql';
export async function searchCreatorsByUsername(handle) {
  const res = await fetch(ZORA_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($q: String!) {
          searchUsers(query: $q, limit: 10) {
            items { address handle }
          }
        }
      `,
      variables: { q: handle },
    }),
  });
  const { data } = await res.json();
  return data.searchUsers.items;
}

// 3) Fetch coins created/owned by a creator
export async function fetchCoinsByCreator(address, limit = 20) {
  const { data } = await getProfileBalances({
    identifier: address,
    count: limit
  });
  return data.profile.coinBalances.edges.map(e => e.node.token);
}

// 4) Detail & history (onchain)
export async function fetchCoinDetails(address) {
  const { data } = await getCoin({ address, chain: base.id });
  return data.zora20Token;
}
export async function fetchCoinHistory(address) {
  const { amount, events } = await getOnchainCoinDetails({
    coin: address,
    user: undefined,
    publicClient
  });
  return events;
}
