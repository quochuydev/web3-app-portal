import { create } from 'zustand'

interface WalletState {
  portfolioBalance: number
  cashBalance: number
  isConnected: boolean
  address: string | null
  setPortfolioBalance: (balance: number) => void
  setCashBalance: (balance: number) => void
  setConnection: (isConnected: boolean, address?: string) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  portfolioBalance: 1250.75,
  cashBalance: 2400.50,
  isConnected: false,
  address: null,
  setPortfolioBalance: (balance) => set({ portfolioBalance: balance }),
  setCashBalance: (balance) => set({ cashBalance: balance }),
  setConnection: (isConnected, address = null) => set({ isConnected, address }),
}))