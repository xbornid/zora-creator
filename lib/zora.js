import { ZoraCoinsQuery, ZoraHistoryQuery } from '@zoralabs/coins-sdk/queries';

export async function fetchTopCoins(limit = 20) {
  const result = await ZoraCoinsQuery({ sort: 'marketcap', limit });
  return result.coins;
}

export async function fetchCoinHistory(contractAddress) {
  const history = await ZoraHistoryQuery({ contract: contractAddress, limit: 50 });
  return history;
}