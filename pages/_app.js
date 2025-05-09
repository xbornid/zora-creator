// pages/_app.js
import '../styles/globals.css';
import { WarpletProvider } from '@farcaster/frame-sdk';
import AuthProvider from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <WarpletProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </WarpletProvider>
  );
}

export default MyApp;
