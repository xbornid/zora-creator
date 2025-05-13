// pages/_app.js
import '../styles/globals.css'
import AuthProvider from '../context/AuthContext'
import { MiniKitProvider } from '@minikit/base'

function MyApp({ Component, pageProps }) {
  return (
    <MiniKitProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </MiniKitProvider>
  )
}

export default MyApp
