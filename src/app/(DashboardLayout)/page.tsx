'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// Web3 components
import WalletConnection from '@/app/(DashboardLayout)/components/web3/WalletConnection';
import WalletBalance from '@/app/(DashboardLayout)/components/web3/WalletBalance';
import BettingHistory from '@/app/(DashboardLayout)/components/web3/BettingHistory';
import BettingInterface from '@/app/(DashboardLayout)/components/web3/BettingInterface';
import EventMonitor from '@/app/(DashboardLayout)/components/web3/EventMonitor';

const Dashboard = () => {
  return (
    <PageContainer title="Web3 Portal Dashboard" description="Web3 betting and wallet management portal">
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <WalletConnection />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <WalletBalance />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
            <BettingInterface />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BettingHistory />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EventMonitor />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;