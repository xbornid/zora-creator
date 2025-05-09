import { useState, useEffect } from 'react';
import { Warplet } from '@farcasterxyz/warplet';
import { ethers } from 'ethers';

let warplet, signer;
export function useWarplet() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    (async () => {
      warplet = new Warplet();
      const acc = await warplet.connect();
      signer = warplet.getSigner();
      setAccount(acc);
    })();
  }, []);

  return { account, signer };
}