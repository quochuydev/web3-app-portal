'use client';

import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Wallet Connection
        </Typography>
        
        <Box sx={{ textAlign: 'center', py: 2 }}>
          {!isConnected ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleConnect}
              disabled={isPending}
              sx={{ minWidth: 200 }}
            >
              {isPending ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              onClick={() => disconnect()}
              sx={{ minWidth: 200 }}
            >
              Disconnect
            </Button>
          )}
        </Box>

        {isConnected && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Connected Address:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {address}
            </Typography>
          </Box>
        )}

        {!isConnected && (
          <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
            Connect your MetaMask wallet to get started
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnection;