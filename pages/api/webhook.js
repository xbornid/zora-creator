import { sendNotification } from '../../lib/farcaster';

const subscriptions = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, coin, fid } = req.body;
    if (action === 'watch') {
      subscriptions.push({ fid, contract: coin.address });
      return res.status(200).json({ ok: true, subscriptions });
    }
    const event = req.body;
    const targets = subscriptions
      .filter(s => s.contract === event.contractAddress)
      .map(s => s.fid);

    await Promise.all(
      targets.map(fid =>
        sendNotification(fid, `Kreator ${event.creator} memposting koin ${event.coinName}!`)
      )
    );
    return res.status(200).json({ ok: true, notified: targets.length });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} not allowed`);
}