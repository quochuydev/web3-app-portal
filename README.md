# Web3 Portal - Betting & Wallet Management

Next.js 15 Web3 application for decentralized betting with MetaMask integration.

## Requirements

- **Node.js 20+** (tested with v20.15.1)
- **MetaMask browser extension**

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment** (optional):
   Create `.env.local`:

   ```bash
   NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Connect MetaMask**:
   - Open http://localhost:3000
   - Click "Connect MetaMask"
   - Switch to Ethereum mainnet

## Environment Variables Setup

Each variable in `.env.example` and how to get it:

### 1. **NEXT_PUBLIC_MAINNET_RPC_URL** (optional)

- **What**: Ethereum RPC endpoint for better performance
- **How to get**:
  1. Go to [alchemy.com](https://alchemy.com)
  2. Sign up and create account
  3. Click "Create new app"
  4. Choose "Ethereum" + "Mainnet"
  5. Copy the HTTP URL from dashboard
  6. Replace `YOUR_ALCHEMY_API_KEY` in `.env.local`

### 2. **NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS** (for production)

- **What**: Smart contract address for betting functionality
- **How to get**:
  1. Deploy your betting smart contract to Ethereum
  2. Copy the deployed contract address (starts with 0x...)
  3. Replace the example address

### 3. **NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS** (for production)

- **What**: ERC-20 token contract for betting currency
- **How to get**:
  1. Deploy your ERC-20 token contract, or
  2. Use existing token address
  3. Replace the example address

## Manual Setup Required

1. **MetaMask wallet**:
   - Install MetaMask browser extension
   - Create/import wallet
   - Switch to Ethereum mainnet
   - Have some ETH for gas fees

## Features

- ✅ MetaMask wallet connection
- ✅ ETH balance display
- ✅ Mock betting interface
- ✅ Betting history
- ✅ Win/loss notifications

## Commands

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
