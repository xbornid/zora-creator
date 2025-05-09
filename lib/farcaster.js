// lib/farcaster.js

/**
 * Kirim notifikasi ke Farcaster via warpcast notification URL
 *
 * @param {string} notificationUrl  URL yang disediakan Frakcater pada frame_added/notifications_enabled
 * @param {string} token            Token yang disediakan Frakcater pada event
 * @param {string} notificationId   Unique ID untuk idempotency (misal: `${fid}-${Date.now()}`)
 * @param {string} title            Judul notifikasi (maks 32 char)
 * @param {string} body             Isi notifikasi (maks 128 char)
 * @param {string} targetUrl        URL tujuan saat user klik notifikasi
 */
export async function sendNotification(notificationUrl, token, notificationId, title, body, targetUrl) {
  const res = await fetch(notificationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notificationId,
      title,
      body,
      targetUrl,
      tokens: [token],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notification failed: ${res.status} ${text}`);
  }
  return res.json();
}
