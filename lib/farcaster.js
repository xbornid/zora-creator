import { Warpcast } from '@farcasterxyz/minikit';

const warp = new Warpcast();

export function sendNotification(recipientFid, message) {
  return warp.cast({ fid: recipientFid, text: message });
}