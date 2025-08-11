'use client';

import { Card, CardContent, Typography, Box, Chip, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useAccount } from 'wagmi';
import { useBettingEvents } from '@/hooks/useBettingEvents';

const EventMonitor = () => {
  const { isConnected } = useAccount();
  const { events, isListening } = useBettingEvents();

  if (!isConnected) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" mb={2}>
            Event Monitor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect wallet to monitor betting events
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'win':
        return 'success';
      case 'loss':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', maxHeight: '400px', overflow: 'auto' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            Event Monitor
          </Typography>
          {isListening && (
            <Chip 
              label="Listening" 
              color="success" 
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        
        {events.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No events yet. Place some bets to see event notifications here.
          </Alert>
        ) : (
          <List dense>
            {events.map((event) => (
              <ListItem key={event.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">
                        Market #{event.marketId} - {event.amount} ETH
                      </Typography>
                      <Chip 
                        label={event.outcome.toUpperCase()}
                        color={getOutcomeColor(event.outcome) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {event.payout && event.payout !== '0' && (
                        <Typography variant="caption" color="success.main">
                          Payout: {event.payout} ETH
                        </Typography>
                      )}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatTimestamp(event.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default EventMonitor;