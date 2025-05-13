// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

export const AuthContext = createContext({ account: null, signer: null })

export default function AuthProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [signer, setSigner]   = useState(null)

  useEffect(() => {
    if (!window.ethereum) {
      console.warn('Warplet tidak tersedia')
      return
    }
    ;(async () => {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const sig = provider.getSigner()
        setAccount(await sig.getAddress())
        setSigner(sig)
      } catch (e) {
        console.error('Gagal koneksi Warplet', e)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider value={{ account, signer }}>
      {children}
    </AuthContext.Provider>
  )
}
