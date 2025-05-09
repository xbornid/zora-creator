
```markdown
# Zora Creator Mini App

Zora Creator is a Farcaster Mini App that allows users to monitor their favorite Zora creators and receive real-time Warpcast notifications whenever those creators post new tokens. Users can browse top Zora tokens by market cap, search by creator username, view token details and transaction history, and buy/sell directly from the app.

## Features

- **Auto-login** via Warpcast Frame SDK (fallback to MetaMask in browser)
- **Home / Coin List**  
  - Default view: top tokens by market cap  
  - Search by Zora creator username  
- **Creator Monitoring**  
  - Watch / Unwatch creators  
  - Profile page lists all watched creators  
- **Token Detail Page**  
  - Token metadata (name, symbol, market cap)  
  - Transaction history (buy/sell)  
  - Buy & Sell buttons (via on-frame wallet)  
- **Real-time Notifications**  
  - Serverless cron job polls Zora for new tokens by watched creators  
  - Sends Warpcast push notifications when new tokens are posted  
- **Easy Deployment** on Vercel with Upstash Redis for persistence

## Project Structure

```

/public
/.well-known/farcaster.json    # Mini App manifest
/og-image.png                  # Embed preview image
/splash.png                    # Splash image

/lib
zora.js      # Zora SDK wrappers
farcaster.js # Warpcast notification helper
wallet.js    # useWarplet hook

/context
AuthContext.js                # Provides account & signer

/components
Layout.js
CoinList.js
TokenCard.js
CoinDetail.js

/pages
\_app.js
\_document.js
index.js
profile.js
/coin/\[address].js            # Token detail page
/api
webhook.js                  # Frame subscription API
cron-check.js               # Scheduled token polling & notifications
profile.js                  # Watched creators API

vercel.json                    # Build, routing & cron config
package.json                   # Dependencies & scripts

````

## Getting Started

### Prerequisites

- Node.js >= 16
- Git
- (Optional) MetaMask extension for local testing

### Local Development

1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/zora-creator.git
   cd zora-creator
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and set variables:

   ```bash
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
   UPSTASH_REDIS_REST_URL=your-upstash-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   ```
4. Run development server:

   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

1. Push your code to GitHub.
2. Import the repo in Vercel.
3. Set the same environment variables in Vercel dashboard.
4. Vercel will auto-deploy and schedule `/api/cron-check` every 5 minutes.

## Environment Variables

| Name                        | Description                                   |
| --------------------------- | --------------------------------------------- |
| NEXT\_PUBLIC\_BASE\_URL     | Your app’s base URL (e.g. `https://your.app`) |
| NEXT\_PUBLIC\_BASE\_RPC     | (Optional) Base network RPC URL               |
| UPSTASH\_REDIS\_REST\_URL   | Upstash Redis REST endpoint                   |
| UPSTASH\_REDIS\_REST\_TOKEN | Upstash Redis REST token                      |

## Built With

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [@zoralabs/coins-sdk](https://docs.zora.co/)
* [Viem](https://viem.sh/)
* [Ethers.js](https://docs.ethers.org/)
* [Upstash Redis](https://upstash.com/)
* [Vercel](https://vercel.com/)

---

Feel free to contribute, report issues or request features on the GitHub repository. Enjoy monitoring your favorite Zora creators!
