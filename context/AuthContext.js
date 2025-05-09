// context/AuthContext.js
import React, { createContext } from 'react';
import { useWarplet } from '../lib/wallet';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const { account, signer } = useWarplet();
  return (
    <AuthContext.Provider value={{ account, signer }}>
      {children}
    </AuthContext.Provider>
  );
}
