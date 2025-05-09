// context/AuthContext.js
import React, { createContext, useContext } from 'react';
import { useWarplet } from '@farcaster/frame-sdk';

export const AuthContext = createContext({ account: null, signer: null });

export default function AuthProvider({ children }) {
  const { warplet } = useWarplet();
  const account = warplet?.fid || null;
  const signer = warplet?.signer || null;

  return (
    <AuthContext.Provider value={{ account, signer }}>
      {children}
    </AuthContext.Provider>
  );
}
