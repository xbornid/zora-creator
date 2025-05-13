// pages/_app.js
import '../styles/globals.css'
import AuthProvider from '../context/AuthContext'
// import MiniKitProvider dari OnchainKit
import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { base } from 'viem/chains'

function MyApp({ Component, pageProps }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'light',
        },
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </MiniKitProvider>
  )
}

export default MyApp
