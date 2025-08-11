'use client'

import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import { useWalletStore } from '@/store/walletStore'

export function PortfolioInfo() {
  const portfolioBalance = useWalletStore((state) => state.portfolioBalance)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          Portfolio
        </Typography>
        <Typography
          variant="body2"
          fontWeight="bold"
          color="success.main"
          sx={{ lineHeight: 1 }}
        >
          {formatCurrency(portfolioBalance)}
        </Typography>
      </Box>
    </Box>
  )
}