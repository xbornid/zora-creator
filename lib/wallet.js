// lib/wallet.js
import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

export function useWarplet() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === 'undefined' || !window.frame?.sdk) {
        console.error('Frame SDK tidak tersedia');
        return;
      }
      const sdk = window.frame.sdk;
      await sdk.actions.ready();
      const provider = new BrowserProvider(sdk.wallet.ethProvider);
      await provider.send('eth_requestAccounts', []);
      const _signer = await provider.getSigner();
      const address = await _signer.getAddress();
      if (!mounted) return;
      setSigner(_signer);
      setAccount(address);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { account, signer };
}
