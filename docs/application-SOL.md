# Solana-based Prediction Market Platform - Technical Architecture

*Note: While the original request mentions MetaMask, this document covers Solana wallet integration (Phantom) as MetaMask doesn't natively support Solana. The architecture can be adapted for cross-chain compatibility.*

## Overview
This document outlines the technical architecture for a Polymarket-like betting platform built on Solana using SOL as the primary currency. The platform enables users to create and participate in prediction markets with decentralized settlement.

---

## 1. Pre-Setup Services & Environment Configuration

### Core Infrastructure Services

#### Blockchain Infrastructure
- **Solana RPC Endpoints**: 
  - Mainnet: `https://api.mainnet-beta.solana.com`
  - Devnet: `https://api.devnet.solana.com` (for testing)
  - Alternative: Helius, QuickNode, or Alchemy Solana RPCs for better reliability

#### Smart Contract Platform
- **Anchor Framework**: For Solana program development
- **Program Library**: Solana Program Library (SPL) for token standards

#### External APIs & Services
- **Price Oracles**: 
  - Pyth Network for real-time price feeds
  - Switchboard for custom data feeds
- **Event Resolution**: 
  - UMA Protocol (cross-chain oracle)
  - Custom oracle network for event outcomes
- **IPFS Storage**: For market metadata and documentation

### Environment Variables (.env.local)

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
SOLANA_PRIVATE_KEY=your_program_authority_private_key

# Smart Contract Addresses
NEXT_PUBLIC_BETTING_PROGRAM_ID=BettingProgramPublicKey123...
NEXT_PUBLIC_SPL_TOKEN_PROGRAM=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

# Oracle Services
PYTH_PROGRAM_ID=FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
UMA_ORACLE_API_KEY=your_uma_api_key
SWITCHBOARD_PROGRAM_ID=SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f

# External Services
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key
IPFS_PROJECT_ID=your_ipfs_project_id
IPFS_PROJECT_SECRET=your_ipfs_secret

# Application Configuration
NEXT_PUBLIC_PLATFORM_FEE_BPS=100  # 1% platform fee
NEXT_PUBLIC_MIN_BET_AMOUNT=0.01   # Minimum bet in SOL
NEXT_PUBLIC_MAX_BET_AMOUNT=1000   # Maximum bet in SOL

# Database & Analytics
DATABASE_URL=postgresql://user:password@localhost:5432/prediction_market
ANALYTICS_API_KEY=your_analytics_key
```

---

## 2. Authentication & Wallet Integration

### Wallet Connection Flow

#### Supported Wallets
- **Primary**: Phantom Wallet (most popular on Solana)
- **Secondary**: Solflare, Backpack, Glow
- **Web Wallet**: Torus/Web3Auth for social login
- **Cross-chain**: Sollet for MetaMask bridge compatibility

#### Authentication Implementation

```typescript
// lib/solana.ts
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

export const network = WalletAdapterNetwork.Mainnet
export const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network)
export const connection = new Connection(endpoint)

// Wallet connection with Phantom
export const connectPhantom = async () => {
  if (window.solana && window.solana.isPhantom) {
    const response = await window.solana.connect()
    return response.publicKey.toString()
  }
  throw new Error('Phantom wallet not found')
}

// MetaMask bridge compatibility (via Sollet)
export const connectMetaMaskBridge = async () => {
  if (window.ethereum) {
    // Use Sollet or similar bridge service
    const provider = new SolletExtensionAdapter()
    await provider.connect()
    return provider.publicKey?.toString()
  }
  throw new Error('MetaMask bridge not available')
}
```

#### Login Flow Steps
1. User clicks "Connect Wallet"
2. Phantom wallet popup appears (or MetaMask bridge)
3. User approves connection
4. Application receives public key
5. Optional: Sign message for authentication
6. Store wallet state in Zustand/Context

---

## 3. Balance & Portfolio Management

### SOL Balance Retrieval

```typescript
// services/balanceService.ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

export class BalanceService {
  constructor(private connection: Connection) {}

  async getSOLBalance(publicKey: string): Promise<number> {
    const balance = await this.connection.getBalance(new PublicKey(publicKey))
    return balance / LAMPORTS_PER_SOL
  }

  async getTokenBalance(walletAddress: string, tokenMint: string): Promise<number> {
    // For custom SPL tokens if needed
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      new PublicKey(walletAddress),
      { mint: new PublicKey(tokenMint) }
    )
    
    return tokenAccounts.value.reduce((total, account) => {
      return total + account.account.data.parsed.info.tokenAmount.uiAmount
    }, 0)
  }

  async getPortfolioValue(walletAddress: string): Promise<{
    totalValue: number,
    activeBets: number,
    availableBalance: number
  }> {
    const [solBalance, activeBets] = await Promise.all([
      this.getSOLBalance(walletAddress),
      this.getActiveBetsValue(walletAddress)
    ])

    return {
      totalValue: solBalance + activeBets,
      activeBets,
      availableBalance: solBalance
    }
  }
}
```

### Betting History API

```typescript
// api/betting-history.ts
export interface BettingHistory {
  id: string
  marketId: string
  marketTitle: string
  betAmount: number
  outcome: 'YES' | 'NO'
  odds: number
  timestamp: Date
  status: 'ACTIVE' | 'WON' | 'LOST' | 'PENDING'
  payout?: number
  transactionSignature: string
}

export const getBettingHistory = async (walletAddress: string): Promise<BettingHistory[]> => {
  try {
    // 1. Query Solana transaction history
    const signatures = await connection.getSignaturesForAddress(
      new PublicKey(walletAddress),
      { limit: 100 }
    )
    
    // 2. Filter betting program transactions
    const bettingSignatures = signatures.filter(sig => 
      sig.memo?.includes('BETTING') || 
      // Check if transaction involves betting program
      true // Will be filtered in next step
    )
    
    // 3. Parse betting transactions
    const bettingTxs = await Promise.all(
      bettingSignatures.map(async sig => {
        const tx = await connection.getParsedTransaction(sig.signature)
        return parseBettingTransaction(tx, sig.signature)
      })
    )
    
    return bettingTxs.filter(Boolean) as BettingHistory[]
  } catch (error) {
    throw new Error(`Failed to fetch betting history: ${error.message}`)
  }
}

const parseBettingTransaction = (tx: any, signature: string): BettingHistory | null => {
  // Parse transaction logs and extract betting data
  if (!tx || !tx.meta || tx.meta.err) return null
  
  // Extract betting information from transaction data
  const instruction = tx.transaction.message.instructions.find(
    (inst: any) => inst.programId === BETTING_PROGRAM_ID
  )
  
  if (!instruction) return null
  
  // Decode instruction data to extract bet details
  return {
    id: signature,
    marketId: 'extracted_market_id',
    marketTitle: 'Market Title',
    betAmount: 0, // Extract from instruction data
    outcome: 'YES',
    odds: 0.5,
    timestamp: new Date(tx.blockTime * 1000),
    status: 'ACTIVE',
    transactionSignature: signature
  }
}
```

---

## 4. Betting Flow & Market Interaction

### Market Structure

```rust
// Smart Contract (Anchor/Rust)
#[account]
pub struct Market {
    pub market_id: Pubkey,
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub total_yes_amount: u64,
    pub total_no_amount: u64,
    pub resolution_time: i64,
    pub oracle: Pubkey,
    pub status: MarketStatus,
    pub winner: Option<Outcome>,
    pub platform_fee_bps: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MarketStatus {
    Active,
    Resolved,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Outcome {
    Yes,
    No,
}
```

### Betting API Flow

#### 1. Place Bet Transaction

```typescript
// services/bettingService.ts
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@project-serum/anchor'

export class BettingService {
  private program: Program
  
  constructor(provider: AnchorProvider) {
    // Initialize Anchor program
    this.program = new Program(IDL, BETTING_PROGRAM_ID, provider)
  }

  async placeBet(
    marketId: string,
    outcome: 'YES' | 'NO',
    amount: number,
    walletAdapter: any
  ) {
    try {
      // 1. Get market account data
      const marketAccount = await this.getMarketAccount(marketId)
      
      if (marketAccount.status !== 'Active') {
        throw new Error('Market is not active')
      }
      
      // 2. Calculate current odds
      const odds = this.calculateOdds(marketAccount, outcome)
      
      // 3. Validate bet amount
      if (amount < 0.01 || amount > 1000) {
        throw new Error('Invalid bet amount')
      }
      
      // 4. Check user balance
      const balance = await connection.getBalance(walletAdapter.publicKey)
      if (balance < amount * LAMPORTS_PER_SOL) {
        throw new Error('Insufficient balance')
      }
      
      // 5. Build and send transaction
      const tx = await this.program.methods
        .placeBet(
          new BN(amount * LAMPORTS_PER_SOL),
          outcome === 'YES' ? { yes: {} } : { no: {} }
        )
        .accounts({
          market: new PublicKey(marketId),
          bettor: walletAdapter.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      
      const signature = await walletAdapter.sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, 'confirmed')
      
      // 6. Update local state
      await this.updateUserBets(walletAdapter.publicKey.toString())
      
      return { 
        signature, 
        odds,
        estimatedPayout: this.calculatePotentialPayout(amount, odds)
      }
    } catch (error) {
      throw new BettingError(`Failed to place bet: ${error.message}`)
    }
  }

  private calculateOdds(market: any, outcome: 'YES' | 'NO'): number {
    const totalYes = market.totalYesAmount.toNumber() / LAMPORTS_PER_SOL
    const totalNo = market.totalNoAmount.toNumber() / LAMPORTS_PER_SOL
    const total = totalYes + totalNo
    
    if (total === 0) return 0.5 // Initial odds
    
    return outcome === 'YES' ? totalNo / total : totalYes / total
  }

  private calculatePotentialPayout(betAmount: number, odds: number): number {
    return betAmount / odds
  }
}
```

#### 2. Market Data APIs

```typescript
// api/markets.ts
export interface Market {
  id: string
  title: string
  description: string
  category: string
  totalVolume: number
  yesPrice: number
  noPrice: number
  resolutionTime: Date
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED'
  creator: string
  winner?: 'YES' | 'NO'
}

export const getActiveMarkets = async (): Promise<Market[]> => {
  try {
    // Fetch all market accounts from Solana
    const marketAccounts = await connection.getProgramAccounts(
      new PublicKey(BETTING_PROGRAM_ID),
      {
        filters: [
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: '1', // Active status
            },
          },
        ],
      }
    )
    
    return marketAccounts.map(({ account, pubkey }) => {
      const marketData = deserializeMarketAccount(account.data)
      return {
        id: pubkey.toString(),
        title: marketData.title,
        description: marketData.description,
        category: marketData.category || 'General',
        totalVolume: (marketData.totalYesAmount + marketData.totalNoAmount) / LAMPORTS_PER_SOL,
        yesPrice: calculatePrice(marketData, 'YES'),
        noPrice: calculatePrice(marketData, 'NO'),
        resolutionTime: new Date(marketData.resolutionTime * 1000),
        status: 'ACTIVE',
        creator: marketData.creator.toString()
      }
    })
  } catch (error) {
    throw new Error(`Failed to fetch markets: ${error.message}`)
  }
}

export const getMarketById = async (marketId: string): Promise<Market> => {
  const account = await connection.getAccountInfo(new PublicKey(marketId))
  if (!account) {
    throw new Error('Market not found')
  }
  
  const marketData = deserializeMarketAccount(account.data)
  // Return formatted market data
}
```

---

## 5. Event Resolution & Payout System

### Oracle Integration

#### Pyth Network Integration
```typescript
// services/oracleService.ts
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client'

export class OracleService {
  private pythClient: PythHttpClient

  constructor() {
    this.pythClient = new PythHttpClient(
      connection, 
      getPythProgramKeyForCluster('mainnet-beta')
    )
  }

  async getPriceData(priceId: string) {
    const data = await this.pythClient.getData()
    const priceData = data.productPrice.get(priceId)
    
    return {
      price: priceData?.price || 0,
      confidence: priceData?.confidence || 0,
      timestamp: priceData?.timestamp || 0
    }
  }

  async resolveMarketFromOracle(marketId: string): Promise<{
    outcome: 'YES' | 'NO',
    confidence: number,
    proof: any
  }> {
    // Get market oracle configuration
    const market = await this.getMarketAccount(marketId)
    const oracleConfig = await this.getOracleConfig(market.oracle)
    
    // Fetch data based on oracle type
    switch (oracleConfig.type) {
      case 'PRICE':
        return this.resolvePriceBasedMarket(oracleConfig)
      case 'EVENT':
        return this.resolveEventBasedMarket(oracleConfig)
      default:
        throw new Error('Unknown oracle type')
    }
  }
}
```

### Resolution Flow

#### Automated Resolution
```typescript
// services/resolutionService.ts
export class ResolutionService {
  async resolveMarket(marketId: string) {
    try {
      // 1. Check if market is ready for resolution
      const market = await this.getMarketAccount(marketId)
      
      if (market.status !== 'Active') {
        throw new Error('Market is not active')
      }
      
      if (Date.now() < market.resolutionTime * 1000) {
        throw new Error('Market resolution time not reached')
      }
      
      // 2. Get oracle outcome
      const oracleResult = await this.oracleService.resolveMarketFromOracle(marketId)
      
      // 3. Build resolution transaction
      const tx = await this.program.methods
        .resolveMarket(
          oracleResult.outcome === 'YES' ? { yes: {} } : { no: {} }
        )
        .accounts({
          market: new PublicKey(marketId),
          oracle: market.oracle,
          authority: this.authorityKeypair.publicKey,
        })
        .transaction()
      
      // 4. Execute resolution
      const signature = await this.sendAndConfirmTransaction(tx)
      
      // 5. Calculate and prepare payouts
      await this.calculatePayouts(marketId, oracleResult.outcome)
      
      // 6. Emit resolution event
      await this.emitResolutionEvent(marketId, oracleResult.outcome, signature)
      
      return { 
        signature, 
        outcome: oracleResult.outcome,
        confidence: oracleResult.confidence
      }
    } catch (error) {
      throw new ResolutionError(`Market resolution failed: ${error.message}`)
    }
  }

  private async calculatePayouts(marketId: string, winner: 'YES' | 'NO') {
    // Get all bets for this market
    const bets = await this.getAllMarketBets(marketId)
    const market = await this.getMarketAccount(marketId)
    
    const winningBets = bets.filter(bet => bet.outcome === winner)
    const totalWinningAmount = winningBets.reduce((sum, bet) => sum + bet.amount, 0)
    const totalPool = market.totalYesAmount + market.totalNoAmount
    const platformFee = totalPool * 0.01 // 1% fee
    const payoutPool = totalPool - platformFee
    
    // Calculate individual payouts
    for (const bet of winningBets) {
      const payoutRatio = bet.amount / totalWinningAmount
      const payout = payoutPool * payoutRatio
      
      await this.createPayoutRecord({
        bettor: bet.bettor,
        marketId,
        betAmount: bet.amount,
        payout,
        claimed: false
      })
    }
  }
}
```

### Payout Mechanism

#### Winner Payout Calculation
```typescript
export const calculatePayout = (
  betAmount: number,
  userWinningAmount: number,
  totalWinningAmount: number,
  totalPool: number,
  platformFee: number = 0.01 // 1%
): number => {
  // Proportional payout from total pool
  const grossPool = totalPool * (1 - platformFee)
  const userPayoutRatio = userWinningAmount / totalWinningAmount
  const grossPayout = grossPool * userPayoutRatio
  
  return Math.max(grossPayout, betAmount) // Minimum 1:1 payout protection
}
```

#### Claim Winnings Flow
```typescript
// User claims winnings
export const claimWinnings = async (marketId: string, walletAdapter: any) => {
  try {
    // 1. Get user's payout record
    const payoutRecord = await getPayoutRecord(
      walletAdapter.publicKey.toString(), 
      marketId
    )
    
    if (!payoutRecord || payoutRecord.claimed) {
      throw new Error('No winnings available to claim')
    }
    
    // 2. Build claim transaction
    const tx = await this.program.methods
      .claimPayout()
      .accounts({
        market: new PublicKey(marketId),
        claimer: walletAdapter.publicKey,
        payoutAccount: payoutRecord.account,
        systemProgram: SystemProgram.programId,
      })
      .transaction()
    
    // 3. Execute claim
    const signature = await walletAdapter.sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, 'finalized')
    
    // 4. Update payout record
    await updatePayoutRecord(payoutRecord.id, { claimed: true })
    
    return { 
      signature, 
      amount: payoutRecord.payout / LAMPORTS_PER_SOL 
    }
  } catch (error) {
    throw new ClaimError(`Failed to claim winnings: ${error.message}`)
  }
}
```

---

## 6. Win/Loss Trigger System

### Event Detection
```typescript
// services/eventService.ts
export class EventService {
  private webSocketConnection: WebSocket
  
  async startEventMonitoring() {
    // Monitor blockchain for resolution events
    this.connection.onProgramAccountChange(
      new PublicKey(BETTING_PROGRAM_ID),
      (accountInfo, context) => {
        this.handleMarketUpdate(accountInfo, context)
      },
      'confirmed'
    )
  }
  
  private async handleMarketUpdate(accountInfo: any, context: any) {
    try {
      const marketData = deserializeMarketAccount(accountInfo.data)
      
      if (marketData.status === 'Resolved') {
        await this.processMarketResolution({
          marketId: context.accountId,
          winner: marketData.winner,
          timestamp: new Date()
        })
      }
    } catch (error) {
      console.error('Error processing market update:', error)
    }
  }
  
  private async processMarketResolution(event: {
    marketId: string,
    winner: 'YES' | 'NO',
    timestamp: Date
  }) {
    // 1. Notify all affected users
    const affectedUsers = await this.getMarketParticipants(event.marketId)
    
    for (const user of affectedUsers) {
      const userBets = await this.getUserBetsForMarket(user, event.marketId)
      const winningBets = userBets.filter(bet => bet.outcome === event.winner)
      const losingBets = userBets.filter(bet => bet.outcome !== event.winner)
      
      if (winningBets.length > 0) {
        await this.sendWinNotification(user, {
          marketId: event.marketId,
          winningBets,
          totalWinAmount: winningBets.reduce((sum, bet) => sum + bet.expectedPayout, 0)
        })
      }
      
      if (losingBets.length > 0) {
        await this.sendLossNotification(user, {
          marketId: event.marketId,
          losingBets,
          totalLoss: losingBets.reduce((sum, bet) => sum + bet.amount, 0)
        })
      }
    }
    
    // 2. Update market statistics
    await this.updateMarketStats(event.marketId, event.winner)
    
    // 3. Process platform fees
    await this.collectPlatformFees(event.marketId)
  }
}
```

### Notification System
```typescript
// services/notificationService.ts
export class NotificationService {
  async sendWinNotification(userId: string, winData: {
    marketId: string,
    winningBets: Bet[],
    totalWinAmount: number
  }) {
    const notification = {
      type: 'MARKET_WIN',
      userId,
      marketId: winData.marketId,
      message: `Congratulations! You won ${winData.totalWinAmount.toFixed(4)} SOL`,
      data: winData,
      timestamp: new Date(),
      read: false
    }
    
    // Store notification
    await this.storeNotification(notification)
    
    // Send real-time notification if user is online
    await this.sendRealTimeNotification(userId, notification)
    
    // Send email notification (optional)
    if (await this.userHasEmailNotificationsEnabled(userId)) {
      await this.sendEmailNotification(userId, notification)
    }
  }
  
  async sendLossNotification(userId: string, lossData: {
    marketId: string,
    losingBets: Bet[],
    totalLoss: number
  }) {
    const notification = {
      type: 'MARKET_LOSS',
      userId,
      marketId: lossData.marketId,
      message: `Your bet of ${lossData.totalLoss.toFixed(4)} SOL did not win this time`,
      data: lossData,
      timestamp: new Date(),
      read: false
    }
    
    await this.storeNotification(notification)
    await this.sendRealTimeNotification(userId, notification)
  }
}
```

---

## 7. Developer API Summary

### Core Developer APIs

```typescript
// Main API interface for developers
export interface BettingPlatformAPI {
  // Authentication
  connectWallet(walletType?: 'phantom' | 'solflare' | 'backpack'): Promise<string>
  disconnectWallet(): Promise<void>
  signMessage(message: string): Promise<string>
  
  // Balance Management
  getSOLBalance(address: string): Promise<number>
  getPortfolioValue(address: string): Promise<{
    totalValue: number,
    activeBets: number,
    availableBalance: number
  }>
  getBettingHistory(address: string): Promise<BettingHistory[]>
  
  // Market Operations
  getActiveMarkets(category?: string): Promise<Market[]>
  getMarketDetails(marketId: string): Promise<Market>
  getMarketOdds(marketId: string): Promise<{ yesOdds: number, noOdds: number }>
  placeBet(marketId: string, outcome: 'YES' | 'NO', amount: number): Promise<{
    signature: string,
    odds: number,
    estimatedPayout: number
  }>
  
  // Payouts & Winnings
  getWinnings(address: string): Promise<{
    marketId: string,
    amount: number,
    claimed: boolean
  }[]>
  claimWinnings(marketId: string): Promise<{
    signature: string,
    amount: number
  }>
  
  // Real-time Updates
  subscribeToMarketUpdates(marketId: string, callback: (market: Market) => void): () => void
  subscribeToUserUpdates(address: string, callback: (update: UserUpdate) => void): () => void
  subscribeToResolutions(callback: (resolution: MarketResolution) => void): () => void
  
  // Utilities
  estimatePayout(marketId: string, outcome: 'YES' | 'NO', amount: number): Promise<number>
  getTransactionStatus(signature: string): Promise<'pending' | 'confirmed' | 'failed'>
}

// Usage Example
const api = new BettingPlatformAPI()

// Connect wallet and place bet
const address = await api.connectWallet('phantom')
const balance = await api.getSOLBalance(address)

if (balance >= 1.0) {
  const result = await api.placeBet('market123', 'YES', 1.0)
  console.log(`Bet placed! Expected payout: ${result.estimatedPayout} SOL`)
}

// Monitor for resolution
api.subscribeToResolutions((resolution) => {
  if (resolution.marketId === 'market123') {
    console.log(`Market resolved: ${resolution.winner}`)
    // Check if user won
    api.getWinnings(address).then(winnings => {
      const marketWinnings = winnings.find(w => w.marketId === 'market123')
      if (marketWinnings && !marketWinnings.claimed) {
        api.claimWinnings('market123')
      }
    })
  }
})
```

This comprehensive architecture provides all the necessary components for building a Solana-based prediction market platform with SOL as the primary currency, including proper wallet integration, betting mechanics, oracle resolution, and payout systems.