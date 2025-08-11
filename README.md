# Web3 Portal - Betting & Wallet Management

Next.js 15 Web3 application for decentralized betting with MetaMask integration.

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

## What to do manually

1. **Get Alchemy API key** (optional for better performance):
   - Sign up at [alchemy.com](https://alchemy.com)
   - Create new app for Ethereum mainnet
   - Copy API key to `.env.local`

2. **MetaMask setup**:
   - Install MetaMask browser extension
   - Create/import wallet
   - Ensure you're on Ethereum mainnet
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