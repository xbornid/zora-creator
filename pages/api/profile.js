// pages/api/profile.js
import Redis from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { fid } = req.query;
  if (!fid) return res.status(400).json({ error: 'fid diperlukan' });

  const raw = await redis.hget('subscriptions', fid);
  if (!raw) return res.status(200).json({ creators: [] });

  const sub = JSON.parse(raw);
  return res.status(200).json({ creators: sub.creators || [] });
}
