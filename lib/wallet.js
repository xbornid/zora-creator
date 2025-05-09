// lib/wallet.js
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { ethers } from 'ethers';

export function useWarplet() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    (async () => {
      // Tunggu SDK siap
      await sdk.actions.ready();

      // Buat provider Ethers dari ethProvider yang disuntikkan
      const provider = new ethers.providers.Web3Provider(sdk.wallet.ethProvider);
      // Minta izin akun
      await provider.send('eth_requestAccounts', []);
      const _signer = provider.getSigner();
      const address = await _signer.getAddress();

      setSigner(_signer);
      setAccount(address);
    })();
  }, []);

  return { account, signer };
}
