// lib/wallet.js
import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

export function useWarplet() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let provider;

      // 1) Frame SDK (Warpcast)
      if (typeof window !== 'undefined' && window.frame?.sdk) {
        await window.frame.sdk.actions.ready();
        provider = new BrowserProvider(window.frame.sdk.wallet.ethProvider);

      // 2) fallback MetaMask
      } else if (typeof window !== 'undefined' && window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        console.error('Ethereum provider tidak ditemukan');
        return;
      }

      try {
        await provider.send('eth_requestAccounts', []);
        const _signer = provider.getSigner();
        const address = await _signer.getAddress();
        if (!mounted) return;
        setSigner(_signer);
        setAccount(address);
      } catch (err) {
        console.error('Gagal koneksi provider:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { account, signer };
}
