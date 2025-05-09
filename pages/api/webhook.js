// pages/api/webhook.js
import Redis from '@upstash/redis';

const redis = Redis.fromEnv(); // pakai UPSTASH env vars

export default async function handler(req, res) {
  const evt = req.body;

  // 1) Tangani frame_added → simpan fid, notif URL & token
  if (evt.event === 'frame_added' && evt.notificationDetails) {
    const { url, token } = evt.notificationDetails;
    const [, payload] = evt.payload.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    const fid = decoded.fid;
    // simpan object subscription kosong
    await redis.hset('subscriptions', fid, JSON.stringify({
      fid, notificationUrl: url, token,
      creators: [], lastSeen: {}
    }));
    return res.status(200).json({ ok: true });
  }

  // 2) Watch / Unwatch creator
  if (req.method === 'POST' && (evt.action === 'watch' || evt.action === 'unwatch')) {
    const subRaw = await redis.hget('subscriptions', evt.fid);
    if (!subRaw) return res.status(404).end('Subscription tidak ditemukan');
    const sub = JSON.parse(subRaw);
    const addr = evt.coin.creatorAddress || evt.coin.creator.address;
    if (evt.action === 'watch') sub.creators.push(addr);
    else sub.creators = sub.creators.filter(a => a !== addr);
    await redis.hset('subscriptions', evt.fid, JSON.stringify(sub));
    return res.status(200).json({ ok: true, creators: sub.creators });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} not allowed`);
}
