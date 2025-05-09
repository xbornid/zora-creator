// pages/api/cron-check.js
import { fetchCoinsByCreator } from '../../lib/zora';
import { sendNotification } from '../../lib/farcaster';
import Redis from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const subs = await redis.hgetall('subscriptions'); 
  for (const fid in subs) {
    const sub = JSON.parse(subs[fid]);
    for (const creator of sub.creators) {
      const coins = await fetchCoinsByCreator(creator, 1);
      if (!coins.length) continue;
      const newest = coins[0].address;
      if (sub.lastSeen[creator] === newest) continue;
      // kirim notif
      await sendNotification(
        sub.notificationUrl, sub.token,
        `${fid}-${Date.now()}`,
        `Kreator ${creator} posting koin baru!`,
        `${coins[0].name} (MC: ${Number(coins[0].marketCap).toLocaleString()})`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/coin/${newest}`
      );
      sub.lastSeen[creator] = newest;
    }
    await redis.hset('subscriptions', { [fid]: JSON.stringify(sub) });
  }
  res.status(200).json({ ok: true });
}
