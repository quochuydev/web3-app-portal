'use client';

import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useAccount, useBalance } from 'wagmi';

const WalletBalance = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address: address,
    chainId: 1, // Ethereum mainnet
  });

  if (!isConnected) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" mb={2}>
            Balance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect wallet to view balance
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Available Balance
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box>
            <Typography variant="h3" color="primary" mb={1}>
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ethereum Mainnet
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletBalance;