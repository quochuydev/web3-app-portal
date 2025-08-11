'use client';

import { useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useAccount } from 'wagmi';

// Mock betting markets
const mockMarkets = [
  { id: 1, title: 'BTC Price > $50k by End of Month', odds: '1.8x' },
  { id: 2, title: 'ETH Price > $3k by End of Week', odds: '2.1x' },
  { id: 3, title: 'SOL Price > $100 by End of Day', odds: '3.2x' }
];

const BettingInterface = () => {
  const { isConnected } = useAccount();
  const [selectedMarket, setSelectedMarket] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  if (!isConnected) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" mb={2}>
            Place Bet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect wallet to place bets
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handlePlaceBet = async () => {
    if (!selectedMarket || !betAmount) return;
    
    setIsPlacingBet(true);
    // Mock betting logic - replace with actual contract interaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPlacingBet(false);
    
    // Reset form
    setSelectedMarket('');
    setBetAmount('');
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Place Bet
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Market</InputLabel>
              <Select
                value={selectedMarket}
                label="Select Market"
                onChange={(e) => setSelectedMarket(e.target.value)}
              >
                {mockMarkets.map((market) => (
                  <MenuItem key={market.id} value={market.id.toString()}>
                    <Box>
                      <Typography variant="body2">{market.title}</Typography>
                      <Typography variant="caption" color="primary">
                        Odds: {market.odds}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bet Amount (ETH)"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              inputProps={{ min: "0", step: "0.001" }}
            />
          </Grid>

          {selectedMarket && betAmount && (
            <Grid item xs={12}>
              <Alert severity="info">
                Potential payout: {(parseFloat(betAmount) * parseFloat(mockMarkets.find(m => m.id.toString() === selectedMarket)?.odds.replace('x', '') || '0')).toFixed(4)} ETH
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceBet}
              disabled={!selectedMarket || !betAmount || isPlacingBet}
            >
              {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BettingInterface;