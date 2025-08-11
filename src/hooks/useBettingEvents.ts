'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export interface BetEvent {
  id: string;
  marketId: string;
  userAddress: string;
  amount: string;
  outcome: 'win' | 'loss' | 'pending';
  payout?: string;
  timestamp: number;
}

// Mock event system - replace with actual contract event listeners
export const useBettingEvents = () => {
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<BetEvent[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Mock event listener setup
  useEffect(() => {
    if (!isConnected || !address) {
      setEvents([]);
      setIsListening(false);
      return;
    }

    setIsListening(true);

    // Mock event simulation - replace with actual contract event listeners
    const simulateEvents = () => {
      const mockEvent: BetEvent = {
        id: `event_${Date.now()}`,
        marketId: '1',
        userAddress: address,
        amount: '0.01',
        outcome: Math.random() > 0.5 ? 'win' : 'loss',
        payout: Math.random() > 0.5 ? '0.018' : '0',
        timestamp: Date.now()
      };

      setEvents(prev => [mockEvent, ...prev.slice(0, 9)]); // Keep last 10 events
    };

    // Simulate random events every 30 seconds (for demo purposes)
    const interval = setInterval(simulateEvents, 30000);

    return () => {
      clearInterval(interval);
      setIsListening(false);
    };
  }, [address, isConnected]);

  const handleWinEvent = (event: BetEvent) => {
    // Handle win logic
    console.log('Bet won!', event);
    
    // Show notification, update UI, etc.
    if (typeof window !== 'undefined') {
      const notification = new Notification('Bet Won! 🎉', {
        body: `You won ${event.payout} ETH!`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleLossEvent = (event: BetEvent) => {
    // Handle loss logic
    console.log('Bet lost', event);
    
    // Show notification, update UI, etc.
    if (typeof window !== 'undefined') {
      const notification = new Notification('Bet Lost 😞', {
        body: `Better luck next time!`,
        icon: '/favicon.ico'
      });
    }
  };

  // Process events when they change
  useEffect(() => {
    events.forEach(event => {
      if (event.outcome === 'win') {
        handleWinEvent(event);
      } else if (event.outcome === 'loss') {
        handleLossEvent(event);
      }
    });
  }, [events]);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  return {
    events,
    isListening,
    handleWinEvent,
    handleLossEvent
  };
};