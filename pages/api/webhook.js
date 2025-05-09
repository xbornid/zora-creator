// pages/api/webhook.js
import { sendNotification } from '../../lib/farcaster';
import { Buffer } from 'buffer';

const subscriptions = []; 
// setiap item: { fid, notificationUrl, token, contracts: [] }

export default async function handler(req, res) {
  const evt = req.body;

  // 1) Tangani event frame_added (simpan URL + token)
  if (evt.event === 'frame_added' && evt.notificationDetails) {
    const { url, token } = evt.notificationDetails;
    const [, payload] = evt.payload.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    const fid = decoded.fid;
    subscriptions.push({ fid, notificationUrl: url, token, contracts: [] });
    return res.status(200).json({ ok: true });
  }

  // 2) Aksi Watch dari client
  if (req.method === 'POST' && evt.action === 'watch') {
    const sub = subscriptions.find(s => s.fid === evt.fid);
    if (sub && !sub.contracts.includes(evt.coin.address)) {
      sub.contracts.push(evt.coin.address);
    }
    return res.status(200).json({ ok: true });
  }

  // 3) Event Zora (custom payload dengan contractAddress)
  if (req.method === 'POST' && evt.contractAddress) {
    let notified = 0;
    for (const sub of subscriptions.filter(s => s.contracts.includes(evt.contractAddress))) {
      await sendNotification(
        sub.notificationUrl,
        sub.token,
        `${sub.fid}-${Date.now()}`,
        `Koin Baru dari ${evt.creator}!`,
        `${evt.coinName} (Marketcap: ${evt.marketcap})`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/?coin=${encodeURIComponent(evt.contractAddress)}`
      );
      notified++;
    }
    return res.status(200).json({ ok: true, notified });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} not allowed`);
}
