// pages/api/webhook.js
import { sendNotification } from '../../lib/farcaster';

const subscriptions = [];
// Bentuk item: { fid, notificationUrl, token, contracts: [] }

export default async function handler(req, res) {
  const evt = req.body;

  // 1) Host menambahkan frame → dapatkan notificationUrl & token
  if (evt.event === 'frame_added' && evt.notificationDetails) {
    const { url, token } = evt.notificationDetails;
    // Decode fid dari JWS payload:
    const [, payloadBase64] = evt.payload.split('.');
    const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const fid = decoded.fid;

    subscriptions.push({
      fid,
      notificationUrl: url,
      token,
      contracts: [],
    });
    return res.status(200).json({ ok: true });
  }

  // 2) User klik Watch → simpan contract Zora
  if (req.method === 'POST' && evt.action === 'watch') {
    const sub = subscriptions.find(s => s.fid === evt.fid);
    if (sub && !sub.contracts.includes(evt.coin.address)) {
      sub.contracts.push(evt.coin.address);
    }
    return res.status(200).json({ ok: true });
  }

  // 3) Event dari Zora (payload custom) → kirim notifikasi
  if (req.method === 'POST' && evt.contractAddress) {
    const targets = subscriptions.filter(s => s.contracts.includes(evt.contractAddress));
    await Promise.all(
      targets.map(sub =>
        sendNotification(
          sub.notificationUrl,
          sub.token,
          `${sub.fid}-${Date.now()}`,                 // notificationId unik
          `Koin Baru dari ${evt.creator}!`,           // judul
          `${evt.coinName} (${evt.marketcap.toLocaleString()})`, // body
          `${process.env.NEXT_PUBLIC_BASE_URL}/?coin=${encodeURIComponent(evt.contractAddress)}` // targetUrl
        )
      )
    );
    return res.status(200).json({ ok: true, notified: targets.length });
  }

  // 4) selain itu → Method not allowed
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} not allowed`);
}
