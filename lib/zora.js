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

export async function fetchTopCoins(limit = 20) {
  const res = await getCoinsMostValuable({ count: limit });
  return res.data?.exploreList?.edges?.map(e => e.node) || [];
}

export async function fetchCoinDetails(address) {
  const res = await getCoin({ address, chain: base.id });
  return res.data?.zora20Token || null;
}

export async function fetchCoinHistory(address) {
  return await getOnchainCoinDetails({
    coin: address,
    user: undefined,
    publicClient,
  });
}

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
      variables: { query: handle },
    }),
  });
  const { data } = await res.json();
  return data.searchUsers.items || [];
}

export async function fetchCoinsByCreator(address, limit = 20) {
  const res = await getProfileBalances({
    identifier: address,
    count: limit,
  });
  const edges = res.data?.profile?.coinBalances?.edges || [];
  return edges.map(edge => edge.node.token);
}
