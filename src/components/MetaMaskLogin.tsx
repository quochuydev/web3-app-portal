'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Stack,
  Alert
} from '@mui/material'
import { AccountBalanceWallet, Logout } from '@mui/icons-material'

export function MetaMaskLogin() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [connectionError, setConnectionError] = useState<string>('')

  const handleConnect = async () => {
    try {
      setConnectionError('')
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setConnectionError('MetaMask is not installed. Please install MetaMask to continue.')
        return
      }
      
      const connector = connectors[0] // Use the first (and only) connector
      if (connector) {
        await connect({ connector })
      } else {
        setConnectionError('No connectors available.')
      }
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to connect')
    }
  }

  const handleDisconnect = () => {
    setConnectionError('')
    disconnect()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="success.main">
            ✅ Connected to MetaMask
          </Typography>
          
          <Stack spacing={3} mt={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Wallet Address
              </Typography>
              <Typography variant="h6" fontFamily="monospace">
                {address}
              </Typography>
              <Chip 
                label={formatAddress(address)} 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Connected via
              </Typography>
              <Chip 
                label={connector?.name || 'Unknown'} 
                color="primary" 
                variant="filled"
              />
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleDisconnect}
              sx={{ mt: 3, maxWidth: 200 }}
            >
              Disconnect
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <AccountBalanceWallet 
          sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
        />
        
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={3}>
          Connect with MetaMask to access the Web3 Portal
        </Typography>

        {connectionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {connectionError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleConnect}
          disabled={isPending}
          startIcon={<AccountBalanceWallet />}
          sx={{ 
            minWidth: 200,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {isPending ? 'Connecting...' : 'Connect MetaMask'}
        </Button>

        <Typography variant="caption" display="block" mt={2} color="text.secondary">
          Make sure MetaMask is installed in your browser
        </Typography>
      </CardContent>
    </Card>
  )
}