From the HAR file, I can see Polymarket’s frontend interacts with quite a few third-party and in-house services.

---

## **1️⃣ Services it uses**

Here are the notable ones from the network requests:

| Category                          | Service / Domain                                                                                                                     | Purpose                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Auth / Wallet**                 | `auth.magic.link`                                                                                                                    | Magic Link – email/social wallet onboarding          |
| **Wallet Connectors**             | `pulse.walletconnect.org`                                                                                                            | WalletConnect relays for EVM wallets                 |
| **Google Login**                  | `www.google-analytics.com` (tracking) — actual Google login likely goes through `accounts.google.com` but isn’t in this HAR snapshot |                                                      |
| **Coinbase / MetaMask / Phantom** | Supported via frontend integrations (not visible as domains until used), usually through `ethers.js`, `wagmi`, or direct RPC calls   |                                                      |
| **Blockchain RPC**                | `eth-mainnet.g.alchemy.com`, `polygon-mainnet.g.alchemy.com`                                                                         | Alchemy RPC nodes for Ethereum & Polygon             |
| **Internal APIs**                 | `clob.polymarket.com`, `gamma-api.polymarket.com`, `data-api.polymarket.com`                                                         | Core backend for market data, order book, and trades |
| **Feature Flags**                 | `app.launchdarkly.com`, `events.launchdarkly.com`                                                                                    | LaunchDarkly for feature toggles                     |
| **Analytics / Tracking**          | `api2.amplitude.com`, `sr-client-cfg.amplitude.com`                                                                                  | Amplitude analytics                                  |
|                                   | `browser-intake-datadoghq.com`, `browser-intake-datadoghq.eu`                                                                        | Datadog performance/error monitoring                 |
|                                   | `pixel-config.reddit.com`, `www.redditstatic.com`                                                                                    | Reddit pixel tracking                                |
| **Customer Engagement**           | `api-iam.intercom.io`                                                                                                                | Intercom chat/support                                |
| **Email / CRM**                   | `cdp.customer.io`                                                                                                                    | Customer.io for email automation                     |
| **Performance Testing**           | `data.debugbear.com`                                                                                                                 | DebugBear synthetic monitoring                       |
| **Other Web3**                    | `api.fun.xyz`, `sdk-cdn.fun.xyz`                                                                                                     | Fun.xyz (Web3 onboarding + NFT/membership features)  |

---

## **2️⃣ Tech stack & services if you want to build a site like this**

If you want a **Polymarket-like website** with:

- Login via **Google, MetaMask, Coinbase Wallet, Phantom, WalletConnect**
- Deposit via **MetaMask, crypto, cash**

You’d likely need:

### **Frontend**

- **Framework**: React / Next.js (Polymarket uses React SPA)
- **Web3 Libraries**:

  - `wagmi` or `web3modal` (for MetaMask, Coinbase Wallet, WalletConnect)
  - `@solana/web3.js` or `phantom-wallet-adapter` (for Phantom/Solana)

- **State Management**: Zustand / Redux
- **UI**: Tailwind CSS / Material UI
- **Data Fetching**: SWR / React Query
- **Analytics**: Amplitude, Google Analytics
- **Error Monitoring**: Datadog, Sentry

### **Backend**

- **Language**: Node.js (TypeScript)
- **API Layer**: REST + WebSocket (for live market data)
- **Databases**: PostgreSQL / Redis
- **Blockchain Indexing**: The Graph or custom indexer
- **Auth Services**:

  - Google OAuth (via Firebase Auth or Auth0)
  - Magic Link for passwordless onboarding
  - Wallet signature verification (EIP-4361 Sign-In With Ethereum)

- **Feature Management**: LaunchDarkly
- **Customer Engagement**: Intercom
- **Email/CRM**: Customer.io

### **Blockchain Infrastructure**

- **RPC Providers**: Alchemy / Infura / QuickNode
- **Polygon & Ethereum** for EVM wallets
- **Solana RPC** (e.g., GenesysGo, Helius) for Phantom integration
- **Smart Contracts**: Solidity (EVM), Rust (Solana) for market logic
- **Bridging**: Wormhole / Allbridge for Solana → Polygon asset transfers

### **Payments / Deposits**

- **Crypto Deposits**: Direct to smart contract or through custodial payment gateway (Coinbase Commerce, Transak, MoonPay)
- **Cash Deposits**: Fiat on-ramp (Stripe, MoonPay, Transak)
- **Stablecoins**: USDC (ERC-20 + SPL versions)

---

If you want, I can **map out the complete architecture diagram** for this type of multi-wallet, multi-payment, cross-chain site so you can see how all these services connect. That would make the build plan much clearer.
