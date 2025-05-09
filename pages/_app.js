// pages/_app.js
import '../styles/globals.css';
import AuthProvider from '../context/AuthContext';
// 1) import MiniKitProvider
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';

function MyApp({ Component, pageProps }) {
  return (
    // 2) wrap aplikasi dengan MiniKitProvider
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain="base"               // kita deploy di Base chain
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </MiniKitProvider>
  );
}

export default MyApp;
