// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    // Definisikan FrameEmbed spec
    const frameEmbed = {
      version: 'next',                              // sesuai spec v2
      imageUrl: 'https://zora-creator-sigma.vercel.app/og-image.png',  // 3:2 ratio
      button: {
        title: 'Open Zora Creator',                 // max 32 char
        action: {
          type: 'launch_frame',                     // wajib
          name: 'Zora Creator',                     // max 32 char
          url: 'https://zora-creator-sigma.vercel.app',           // root app
          splashImageUrl: 'https://zora-creator-sigma.vercel.app/splash.png', // 200×200
          splashBackgroundColor: '#ffffff'          // hex code
        }
      }
    };

    return (
      <Html>
        <Head>
          {/* Meta tag untuk embed Frame v2 */}
          <meta
            name="fc:frame"
            // isi harus stringified JSON tanpa spasi baris baru
            content={JSON.stringify(frameEmbed)}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
