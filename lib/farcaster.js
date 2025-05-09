// lib/farcaster.js
export async function sendNotification(
  notificationUrl, token,
  notificationId, title, body, targetUrl
) {
  const res = await fetch(notificationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notificationId, title, body, targetUrl, tokens: [token] })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notification gagal: ${res.status} ${text}`);
  }
  return res.json();
}
