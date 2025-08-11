'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { AccountBalanceWallet } from '@mui/icons-material'
import { useWalletStore } from '@/store/walletStore'

export function CashInfo() {
  const cashBalance = useWalletStore((state) => state.cashBalance)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccountBalanceWallet sx={{ color: 'success.main', fontSize: 20 }} />
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          Cash
        </Typography>
        <Typography
          variant="body2"
          fontWeight="bold"
          color="success.main"
          sx={{ lineHeight: 1 }}
        >
          {formatCurrency(cashBalance)}
        </Typography>
      </Box>
    </Box>
  )
}