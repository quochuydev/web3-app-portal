'use client';

import { Card, CardContent, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAccount } from 'wagmi';

// Mock data - replace with actual contract calls
const mockHistory = [
  {
    id: 1,
    event: 'BTC Price > $50k',
    amount: '0.01 ETH',
    status: 'Won',
    payout: '0.018 ETH',
    date: '2024-01-15'
  },
  {
    id: 2,
    event: 'ETH Price > $3k',
    amount: '0.005 ETH',
    status: 'Lost',
    payout: '0 ETH',
    date: '2024-01-14'
  },
  {
    id: 3,
    event: 'NBA Finals Winner',
    amount: '0.02 ETH',
    status: 'Pending',
    payout: 'TBD',
    date: '2024-01-13'
  }
];

const BettingHistory = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" mb={2}>
            Betting History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect wallet to view betting history
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Betting History
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payout</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockHistory.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {bet.event}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bet.date}
                    </Typography>
                  </TableCell>
                  <TableCell>{bet.amount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bet.status} 
                      color={getStatusColor(bet.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bet.payout}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default BettingHistory;